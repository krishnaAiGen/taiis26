/**
 * Minimal PayPal REST client. Lives in an Edge Function so PAYPAL_CLIENT_SECRET
 * is never shipped to a browser.
 */

const LIVE = "https://api-m.paypal.com"
const SANDBOX = "https://api-m.sandbox.paypal.com"

export function paypalBase(): string {
  // Anything other than an explicit "live" stays on sandbox, so a missing or
  // misspelled env var can never accidentally charge a real card.
  return Deno.env.get("PAYPAL_ENV") === "live" ? LIVE : SANDBOX
}

function credentials(): { id: string; secret: string } {
  const id = Deno.env.get("PAYPAL_CLIENT_ID")
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET")
  if (!id || !secret) {
    throw new Error(
      "PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not set. Run: " +
        "supabase secrets set PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=...",
    )
  }
  return { id, secret }
}

/** OAuth2 client-credentials token. PayPal tokens last ~9h; we fetch per cold start. */
let cachedToken: { value: string; expiresAt: number } | null = null

export async function accessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value

  const { id, secret } = credentials()
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    throw new Error(`PayPal auth failed (${res.status}): ${await res.text()}`)
  }

  const json = await res.json()
  cachedToken = {
    value: json.access_token,
    // Refresh a minute early to avoid using a token mid-expiry.
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  }
  return cachedToken.value
}

export async function paypalFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await accessToken()
  return fetch(`${paypalBase()}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

/**
 * Verifies a webhook really came from PayPal. Without this, anyone who learns
 * the webhook URL could POST a fake "payment completed" event and register free.
 */
export async function verifyWebhookSignature(
  headers: Headers,
  rawBody: string,
): Promise<boolean> {
  const webhookId = Deno.env.get("PAYPAL_WEBHOOK_ID")
  if (!webhookId) throw new Error("PAYPAL_WEBHOOK_ID is not set")

  const required = [
    "paypal-auth-algo",
    "paypal-cert-url",
    "paypal-transmission-id",
    "paypal-transmission-sig",
    "paypal-transmission-time",
  ]
  for (const header of required) {
    if (!headers.get(header)) return false
  }

  const res = await paypalFetch("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      // Must be the parsed body of the exact bytes received.
      webhook_event: JSON.parse(rawBody),
    }),
  })

  if (!res.ok) return false
  const json = await res.json()
  return json.verification_status === "SUCCESS"
}

/**
 * Origins allowed to call these functions from a browser.
 *
 * A single hardcoded origin is too brittle: http://localhost:5173 and
 * http://127.0.0.1:5173 are different origins to the browser, and pointing
 * SITE_ORIGIN at production would silently block all local testing. Set
 * ALLOWED_ORIGINS (comma-separated) to override.
 */
export function allowedOrigins(): string[] {
  const explicit = Deno.env.get("ALLOWED_ORIGINS")
  if (explicit) {
    return explicit.split(",").map((o) => o.trim()).filter(Boolean)
  }
  const site = Deno.env.get("SITE_ORIGIN")
  const dev = ["http://localhost:5173", "http://127.0.0.1:5173"]
  return site ? [site, ...dev.filter((d) => d !== site)] : dev
}

/**
 * Any port on the loopback host. Vite silently moves to 5174, 5175, ... when a
 * port is busy, and each one is a distinct origin to the browser — pinning a
 * single dev port turns that into a confusing CORS failure. Loopback origins
 * can only come from the developer's own machine.
 *
 * Set ALLOW_LOCALHOST=false to switch this off once registration is public.
 */
function isLoopbackOrigin(origin: string): boolean {
  if (Deno.env.get("ALLOW_LOCALHOST") === "false") return false
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
}

export function isOriginAllowed(origin: string): boolean {
  return allowedOrigins().includes(origin) || isLoopbackOrigin(origin)
}

/**
 * Echoes the caller's origin when it is allowed. CORS requires an exact match —
 * returning a different allowed origin still blocks the request.
 */
export function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? ""
  const allowed = allowedOrigins()
  return {
    "Access-Control-Allow-Origin": isOriginAllowed(origin) ? origin : allowed[0],
    // Responses differ per origin, so caches must not share them.
    Vary: "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }
}
