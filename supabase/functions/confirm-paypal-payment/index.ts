/**
 * Captures an approved PayPal order and returns receipt data for the invoice.
 *
 * PayPal splits approval and capture: the payer approving an order does NOT
 * move money. The order must be captured afterwards, which is what this does
 * when the browser returns from PayPal. The webhook only records captures that
 * PayPal reports as completed; it never settles an order itself.
 *
 * Safe to call repeatedly — an already-captured order is re-read and verified
 * rather than re-charged, so a refresh of the confirmation page is harmless.
 *
 * Nothing here trusts the caller beyond the registration id. Every figure that
 * decides whether the row becomes `paid` is read back from PayPal and checked
 * against the stored order.
 */

import { createClient } from "jsr:@supabase/supabase-js@2"
import { paypalFetch, corsHeadersFor } from "../_shared/paypal.ts"

const TABLE = Deno.env.get("REGISTRATION_TABLE") ?? "dev_taiis"

interface Row {
  id: string
  created_at: string
  registration_category: string
  attendance_mode: string
  first_name: string
  last_name: string
  email: string
  organization: string
  country: string
  paper_id: string | null
  paper_title: string | null
  payment_status: string
  payment_reference: string | null
  payment_capture_id: string | null
  payment_amount: number | null
  payment_currency: string | null
  payment_method: string
  paid_at: string | null
}

/**
 * Statuses a capture may still be attempted from. `paid` is already settled,
 * and `refunded` / `cancelled` must never be captured back into `paid` — which
 * is what an unconditional retry used to allow.
 */
const CAPTURABLE = new Set(["pending", "failed"])

/** Only fields that belong on an invoice — no phone, dietary or consent data. */
function receiptFor(row: Row) {
  return {
    invoiceNumber: `TAIIS2026-${row.id.slice(0, 8).toUpperCase()}`,
    registrationId: row.id,
    issuedAt: row.paid_at ?? new Date().toISOString(),
    registeredAt: row.created_at,
    name: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
    organization: row.organization,
    country: row.country,
    category: row.registration_category,
    attendanceMode: row.attendance_mode,
    paperId: row.paper_id,
    paperTitle: row.paper_title,
    amount: row.payment_amount,
    currency: row.payment_currency,
    paymentMethod: row.payment_method,
    // The capture id is the transaction a payer can look up in PayPal; the
    // order id in payment_reference is for our own reconciliation.
    paymentReference: row.payment_capture_id ?? row.payment_reference,
    status: row.payment_status,
  }
}

/** The subset of a PayPal order response this function reads. */
interface PayPalOrder {
  purchase_units?: Array<{
    custom_id?: string
    payments?: {
      captures?: Array<{
        id?: string
        status?: string
        custom_id?: string
        amount?: { value?: string; currency_code?: string }
      }>
    }
  }>
}

/**
 * Every registration id PayPal reports for this order.
 *
 * It is read from two places because a capture response does not reliably echo
 * custom_id at purchase-unit level, while a GET on the order always does. Both
 * are checked rather than whichever happens to be present, so a mismatch in
 * either place is caught.
 */
function customIdsIn(order: PayPalOrder): string[] {
  const unit = order.purchase_units?.[0]
  const capture = unit?.payments?.captures?.[0]
  return [unit?.custom_id, capture?.custom_id].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  )
}

type Verdict =
  /** Funds confirmed for this exact registration. */
  | { ok: true; captureId: string }
  /**
   * `tampered` separates "this order does not pay for this registration" from
   * "the money has not arrived yet". The first is an attack and marks the row
   * failed; the second is a transient state and leaves the row alone.
   */
  | { ok: false; tampered: boolean; reason: string }

/**
 * Decides whether a PayPal order actually paid for this registration.
 *
 * The custom_id check is the important one. It is set to the registration id
 * server-side when the order is created, so a caller cannot point one order at
 * a different row — which is what stopped a single real payment being replayed
 * across unlimited registrations.
 */
function verifyOrder(order: PayPalOrder, row: Row): Verdict {
  const unit = order.purchase_units?.[0]

  // Fails closed: an order PayPal cannot attribute to any registration is not
  // evidence that this one was paid.
  const owners = customIdsIn(order)
  if (owners.length === 0 || owners.some((owner) => owner !== row.id)) {
    return {
      ok: false,
      tampered: true,
      reason: `order is for registration ${owners.join(", ") || "(none)"}, not ${row.id}`,
    }
  }

  const capture = unit?.payments?.captures?.[0]
  if (!capture) {
    return { ok: false, tampered: false, reason: "order carries no capture" }
  }

  // PayPal returns 2xx for captures that are PENDING (eCheck, manual review) or
  // DECLINED. Only COMPLETED means the funds actually arrived.
  if (capture.status !== "COMPLETED") {
    return {
      ok: false,
      tampered: false,
      reason: `capture status is ${capture.status ?? "(none)"}`,
    }
  }

  if (row.payment_amount === null || row.payment_currency === null) {
    return {
      ok: false,
      tampered: true,
      reason: "registration has no recorded amount to check against",
    }
  }

  const captured = Number(capture.amount?.value)
  const expected = Number(row.payment_amount)
  if (!Number.isFinite(captured) || Math.abs(captured - expected) >= 0.01) {
    return {
      ok: false,
      tampered: true,
      reason: `captured ${capture.amount?.value}, expected ${expected}`,
    }
  }

  if (capture.amount?.currency_code !== row.payment_currency) {
    return {
      ok: false,
      tampered: true,
      reason: `captured ${capture.amount?.currency_code}, expected ${row.payment_currency}`,
    }
  }

  return { ok: true, captureId: capture.id ?? "" }
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req)
  const json = (body: unknown, status = 200): Response =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405)

  try {
    const { registrationId } = await req.json()
    if (typeof registrationId !== "string" || !registrationId) {
      return json({ error: "registrationId is required" }, 400)
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", registrationId)
      .single()

    if (error || !data) return json({ error: "Registration not found" }, 404)
    const row = data as Row

    // Already settled, or in a state that must not be captured — hand back the
    // row as it stands rather than touching PayPal.
    if (!CAPTURABLE.has(row.payment_status)) {
      return json({ receipt: receiptFor(row) })
    }

    if (row.payment_method !== "paypal") {
      return json({ error: "This registration is not collected through PayPal." }, 400)
    }
    if (!row.payment_reference) {
      return json({ error: "No PayPal order is associated with this registration." }, 409)
    }

    const orderId = row.payment_reference

    const capture = await paypalFetch(`/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      body: "{}",
    })
    const body = await capture.json()

    // A repeat capture comes back as 422 ORDER_ALREADY_CAPTURED. The money was
    // taken on the first attempt, but the 422 body carries no order detail — so
    // the order is re-read and verified rather than assumed good. Treating this
    // branch as success without verification is what allowed a captured order
    // to be replayed onto other registrations.
    const alreadyCaptured =
      capture.status === 422 &&
      body?.details?.some((d: { issue?: string }) => d.issue === "ORDER_ALREADY_CAPTURED")

    if (!capture.ok && !alreadyCaptured) {
      console.error("PayPal capture failed", capture.status, body)
      return json(
        { error: "The payment could not be completed.", status: row.payment_status },
        502,
      )
    }

    // The order is re-read when the 422 gave us no detail, and also when a
    // successful capture response did not echo a registration id — a GET on the
    // order always carries one, so the ownership check never has to fail a real
    // payment for want of something to compare.
    let order = body as PayPalOrder
    if (alreadyCaptured || customIdsIn(order).length === 0) {
      const lookup = await paypalFetch(`/v2/checkout/orders/${orderId}`, { method: "GET" })
      if (!lookup.ok) {
        console.error(
          "Could not re-read the PayPal order",
          lookup.status,
          await lookup.text(),
        )
        return json(
          {
            error:
              "The payment could not be verified. Please contact the organizing committee.",
            status: row.payment_status,
          },
          502,
        )
      }
      order = (await lookup.json()) as PayPalOrder
    }

    const verdict = verifyOrder(order, row)
    if (!verdict.ok) {
      console.error("Capture verification failed", {
        registrationId: row.id,
        orderId,
        reason: verdict.reason,
      })

      if (verdict.tampered) {
        // Guarded: the webhook may have legitimately settled this row since it
        // was read, and a verification failure must not undo a real payment.
        await supabase
          .from(TABLE)
          .update({ payment_status: "failed" })
          .eq("id", row.id)
          .neq("payment_status", "paid")
        return json(
          { error: "The payment could not be verified against this registration." },
          409,
        )
      }

      // Not settled yet (pending capture, manual review). Leave the row alone
      // so the webhook can finish it when PayPal reports completion.
      return json(
        { error: "The payment has not completed yet.", status: row.payment_status },
        409,
      )
    }

    const paidAt = new Date().toISOString()
    const { data: updated } = await supabase
      .from(TABLE)
      .update({
        payment_status: "paid",
        paid_at: paidAt,
        // payment_reference keeps the order id; the capture id goes alongside it.
        payment_capture_id: verdict.captureId || null,
      })
      .eq("id", row.id)
      .neq("payment_status", "paid")
      .select("*")
      .maybeSingle()

    return json({
      receipt: receiptFor(
        (updated as Row) ?? {
          ...row,
          payment_status: "paid",
          paid_at: paidAt,
          payment_capture_id: verdict.captureId || row.payment_capture_id,
        },
      ),
    })
  } catch (err) {
    console.error(err)
    return json({ error: "Unexpected error confirming the payment." }, 500)
  }
})
