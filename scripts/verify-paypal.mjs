// Verifies PayPal credentials and the order payload without deploying anything.
//
//   PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... npm run verify-paypal
//
// Credentials are read from the environment and never written to disk. Add
// PAYPAL_ENV=live to check live credentials (this only creates orders; it does
// not capture money, but prefer sandbox).

import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const clientId = process.env.PAYPAL_CLIENT_ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET
if (!clientId || !clientSecret) {
  console.error(
    "Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in the environment, e.g.\n" +
      "  PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... npm run verify-paypal",
  )
  process.exit(1)
}

const isLive = process.env.PAYPAL_ENV === "live"
const BASE = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Read the same fee data the Edge Functions use.
const fees = JSON.parse(
  readFileSync(resolve(root, "src/config/paperRegistrationContent.json"), "utf-8"),
)
const first = fees.feeSections[0]
const category = `${first.heading} — ${first.categories[0].name}`
const usd = first.categories[0].earlyBird.usd
const ntd = first.categories[0].earlyBird.ntd

console.log(`Environment: ${isLive ? "LIVE" : "sandbox"} (${BASE})`)

const authRes = await fetch(`${BASE}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
})

if (!authRes.ok) {
  console.error(`\n✗ Authentication failed (HTTP ${authRes.status})`)
  console.error("  Check the client ID and secret belong to the same app and environment.")
  process.exit(1)
}
const token = (await authRes.json()).access_token
console.log("✓ Authentication OK")

let failures = 0
for (const [label, currency, value] of [
  ["USD (international registrant)", "USD", usd.toFixed(2)],
  ["TWD (Taiwan registrant)", "TWD", String(ntd)],
]) {
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: "00000000-0000-0000-0000-000000000000",
          description: `TAIIS 2026 — ${category}`.slice(0, 127),
          amount: { currency_code: currency, value },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "TAIIS 2026",
            user_action: "PAY_NOW",
            return_url: "https://example.invalid/return",
            cancel_url: "https://example.invalid/cancel",
          },
        },
      },
    }),
  })
  const body = await res.json()
  if (res.ok) {
    console.log(`✓ ${label}: order created for ${value} ${currency}`)
  } else {
    failures++
    const detail = body.details?.[0]
    console.error(
      `✗ ${label}: HTTP ${res.status} — ${detail?.issue ?? body.message ?? "unknown error"}`,
    )
    if (currency === "TWD") {
      console.error(
        "  If this is CURRENCY_NOT_SUPPORTED, bill Taiwan registrants in USD:\n" +
          "  change currencyForCountry() in supabase/functions/_shared/pricing.ts to always return 'USD'.",
      )
    }
  }
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
