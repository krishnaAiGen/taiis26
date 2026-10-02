/**
 * Creates a PayPal order for an existing registration row and returns the URL
 * the browser should redirect to.
 *
 * The browser sends only a registration id. Everything that decides how much
 * money moves — category, country, early-bird window — is read from the
 * database and recomputed here, so a tampered client cannot underpay.
 */

import { createClient } from "jsr:@supabase/supabase-js@2"
import { paypalFetch, corsHeadersFor } from "../_shared/paypal.ts"
import { priceFor, isCurrency } from "../_shared/pricing.ts"

const TABLE = Deno.env.get("REGISTRATION_TABLE") ?? "dev_taiis"
const SITE_ORIGIN = Deno.env.get("SITE_ORIGIN") ?? "http://localhost:5173"
// The site is served from a subdirectory (https://cyber-conf.com/taiis2026/),
// so the return URL must include it. Override with SITE_BASE_PATH if that moves.
const BASE_PATH = (Deno.env.get("SITE_BASE_PATH") ?? "/taiis2026/").replace(/\/$/, "")
const RETURN_PATH = `${BASE_PATH}/paper-registration`

/**
 * Statuses a checkout may be started from. Must stay in step with CAPTURABLE in
 * confirm-paypal-payment, or an order can be created that nothing will capture.
 */
const STARTABLE = new Set(["pending", "failed"])

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
    if (typeof registrationId !== "string" || registrationId.length === 0) {
      return json({ error: "registrationId is required" }, 400)
    }

    // service_role bypasses RLS; this function is the only thing holding it.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    )

    const { data: registration, error } = await supabase
      .from(TABLE)
      .select("id, registration_category, country, payment_status, payment_currency, payment_method")
      .eq("id", registrationId)
      .single()

    if (error || !registration) return json({ error: "Registration not found" }, 404)

    // Only an unsettled registration may start a checkout. `refunded` and
    // `cancelled` are excluded deliberately: confirm-paypal-payment refuses to
    // capture from those states, so an order created here could be approved and
    // then never settled, leaving the payer charged in PayPal's eyes and the
    // row untouched. Those cases belong with the organizers.
    if (!STARTABLE.has(registration.payment_status)) {
      return json(
        registration.payment_status === "paid"
          ? { error: "This registration has already been paid." }
          : {
              error:
                "This registration cannot be paid online. Please contact the organizing committee.",
            },
        409,
      )
    }

    // PayPal only collects USD here. NT$ registrations are routed to a separate
    // Taiwanese provider, because PayPal blocks payments between two
    // Taiwan-registered accounts and this merchant account is one.
    if (registration.payment_method !== "paypal") {
      return json(
        { error: "This registration is not collected through PayPal." },
        400,
      )
    }
    if (!isCurrency(registration.payment_currency) || registration.payment_currency !== "USD") {
      return json({ error: "PayPal checkout is only available for USD." }, 400)
    }

    const price = priceFor(
      registration.registration_category,
      registration.payment_currency,
      new Date(),
    )

    const order = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            // Lets the webhook find the registration without trusting the client.
            custom_id: registration.id,
            description: `TAIIS 2026 — ${registration.registration_category}`.slice(0, 127),
            amount: { currency_code: price.currency, value: price.value },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "TAIIS 2026",
              user_action: "PAY_NOW",
              return_url: `${SITE_ORIGIN}${RETURN_PATH}?payment=success&ref=${registration.id}`,
              cancel_url: `${SITE_ORIGIN}${RETURN_PATH}?payment=cancelled&ref=${registration.id}`,
            },
          },
        },
      }),
    })

    const body = await order.json()
    if (!order.ok) {
      console.error("PayPal order creation failed", body)
      return json({ error: "Could not start the payment. Please try again." }, 502)
    }

    // Record what we asked for, so the capture and the webhook can detect a
    // mismatch later. payment_reference holds the ORDER id for the lifetime of
    // the row — confirm-paypal-payment re-reads the order through it, and the
    // capture id is stored separately once money moves. Any capture id from a
    // previous attempt is cleared so it cannot be mistaken for this order's.
    await supabase
      .from(TABLE)
      .update({
        payment_reference: body.id,
        payment_capture_id: null,
        payment_amount: price.amount,
        payment_currency: price.currency,
      })
      .eq("id", registration.id)

    const approveUrl = body.links?.find(
      (l: { rel: string; href: string }) => l.rel === "payer-action" || l.rel === "approve",
    )?.href

    if (!approveUrl) {
      console.error("No approval link in PayPal response", body)
      return json({ error: "Could not start the payment. Please try again." }, 502)
    }

    return json({
      approveUrl,
      orderId: body.id,
      amount: price.value,
      currency: price.currency,
      isEarlyBird: price.isEarlyBird,
    })
  } catch (err) {
    // Logged, not returned: the message can contain PayPal API detail that
    // should not reach a browser. Read it in the dashboard under
    // Edge Functions -> create-paypal-order -> Logs.
    console.error(err)
    return json({ error: "Unexpected error creating the payment." }, 500)
  }
})
