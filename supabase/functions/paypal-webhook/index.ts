/**
 * Receives PayPal payment events and records settled captures.
 *
 * Three defences matter here:
 *   1. Signature verification — otherwise anyone who learns this URL could POST
 *      a fake "completed" event and register for free.
 *   2. Only a COMPLETED capture counts. Approval moves no money, and a capture
 *      can be PENDING or DECLINED; neither means the fee arrived.
 *   3. Amount verification — a verified event for the wrong amount is still
 *      wrong, so the captured total is compared against what we asked for.
 */

import { createClient } from "jsr:@supabase/supabase-js@2"
import { verifyWebhookSignature } from "../_shared/paypal.ts"

const TABLE = Deno.env.get("REGISTRATION_TABLE") ?? "dev_taiis"

/**
 * The only event that proves money moved.
 *
 * CHECKOUT.ORDER.APPROVED must NOT be here. Approval is the payer clicking
 * "Pay Now"; PayPal moves nothing until the order is captured, and an
 * uncaptured order is simply voided a few hours later. Treating approval as
 * payment meant a payer could approve, close the tab and hold a `paid`
 * registration for free — and, because it raced the browser's return, it also
 * flipped legitimate rows to `paid` before the capture ran, so
 * confirm-paypal-payment short-circuited and the fee was never collected.
 */
const PAID_EVENTS = new Set(["PAYMENT.CAPTURE.COMPLETED"])

/**
 * Acknowledged and otherwise ignored. Capturing is driven by the browser's
 * return to confirm-paypal-payment, not by these.
 */
const IGNORED_EVENTS = new Set(["CHECKOUT.ORDER.APPROVED"])

const FAILED_EVENTS = new Set(["PAYMENT.CAPTURE.DENIED"])

/** A reversal is as final as a refund: the money is no longer ours. */
const REVERSED_EVENTS = new Set([
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
])

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 })

  // Read raw bytes: signature verification must see exactly what was sent.
  const rawBody = await req.text()

  let verified: boolean
  try {
    verified = await verifyWebhookSignature(req.headers, rawBody)
  } catch (err) {
    console.error("Signature verification error", err)
    return new Response("Verification unavailable", { status: 500 })
  }

  if (!verified) {
    console.warn("Rejected webhook with invalid signature")
    return new Response("Invalid signature", { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const resource = event.resource ?? {}
  const type: string = event.event_type

  if (IGNORED_EVENTS.has(type)) {
    console.log(`Ignoring ${type}: approval is not payment, capture settles it`)
    return new Response("ok", { status: 200 })
  }

  // custom_id was set to the registration id when the order was created, so it
  // can only ever name the row the order was priced for.
  const registrationId: string | undefined =
    resource.custom_id ?? resource.purchase_units?.[0]?.custom_id

  if (!registrationId) {
    // Nothing to correlate — acknowledge so PayPal stops retrying.
    console.warn("Webhook without custom_id", type)
    return new Response("ok", { status: 200 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  )

  const { data: registration } = await supabase
    .from(TABLE)
    .select("id, payment_amount, payment_currency, payment_status, payment_reference")
    .eq("id", registrationId)
    .single()

  if (!registration) {
    console.warn("Webhook for unknown registration", registrationId)
    return new Response("ok", { status: 200 })
  }

  if (PAID_EVENTS.has(type)) {
    // A COMPLETED capture is the only state where the fee has actually arrived.
    if (resource.status && resource.status !== "COMPLETED") {
      console.warn("Capture has not completed", {
        registrationId,
        status: resource.status,
      })
      return new Response("ok", { status: 200 })
    }

    // A valid signature proves PayPal sent it, not that the right amount
    // arrived. Compare against the figure recorded at order creation.
    const paidValue = Number(resource.amount?.value)
    const paidCurrency = resource.amount?.currency_code

    const expected = Number(registration.payment_amount)
    const amountOk =
      registration.payment_amount !== null &&
      Number.isFinite(paidValue) &&
      Math.abs(paidValue - expected) < 0.01
    const currencyOk = paidCurrency === registration.payment_currency

    if (!amountOk || !currencyOk) {
      console.error("Payment amount mismatch", {
        registrationId,
        expected: `${expected} ${registration.payment_currency}`,
        received: `${paidValue} ${paidCurrency}`,
      })
      await supabase
        .from(TABLE)
        .update({ payment_status: "failed" })
        .eq("id", registrationId)
        .neq("payment_status", "paid")
      return new Response("ok", { status: 200 })
    }

    // Defence in depth. custom_id already ties the capture to this row, so a
    // mismatch here is logged for reconciliation rather than rejected — rows
    // created before payment_capture_id existed can still hold a capture id in
    // payment_reference.
    const orderId = resource.supplementary_data?.related_ids?.order_id
    if (orderId && registration.payment_reference && orderId !== registration.payment_reference) {
      console.warn("Capture order id does not match the recorded order", {
        registrationId,
        orderId,
        recorded: registration.payment_reference,
      })
    }

    // Idempotent: PayPal retries, and re-running must not corrupt a paid row.
    await supabase
      .from(TABLE)
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        payment_capture_id: resource.id ?? null,
      })
      .eq("id", registrationId)
      .neq("payment_status", "paid")

    return new Response("ok", { status: 200 })
  }

  if (FAILED_EVENTS.has(type)) {
    await supabase
      .from(TABLE)
      .update({ payment_status: "failed" })
      .eq("id", registrationId)
      .neq("payment_status", "paid")
    return new Response("ok", { status: 200 })
  }

  if (REVERSED_EVENTS.has(type)) {
    await supabase
      .from(TABLE)
      .update({ payment_status: "refunded" })
      .eq("id", registrationId)
    return new Response("ok", { status: 200 })
  }

  // Unhandled event types are acknowledged so PayPal does not retry them.
  return new Response("ok", { status: 200 })
})
