# Payment Edge Functions

Two functions handle PayPal. They exist so that `PAYPAL_CLIENT_SECRET` stays on
a server: this site is a static bundle, and **every `VITE_`-prefixed variable is
compiled into the public JavaScript**. A payment secret there can be read by
anyone who opens devtools.

| Function | Role |
| --- | --- |
| `create-paypal-order` | Browser asks for a checkout URL. Recomputes the fee server-side and creates the PayPal order. |
| `paypal-webhook` | PayPal reports the outcome. The only thing allowed to mark a registration `paid`. |

## Where each credential goes

| Credential | Location |
| --- | --- |
| PayPal **Client ID** | Function secret (not needed in the browser at all with the redirect flow) |
| PayPal **Client Secret** | Function secret — **never** `.env.local` |
| PayPal **Webhook ID** | Function secret |
| `sb_publishable_…` | `.env.local` — public by design |
| `service_role` key | Injected automatically by Supabase; never add it yourself |

## Deploy

The CLI is already a dev dependency of this project, so every command below uses
`npx supabase` — there is nothing to install globally.

```bash
# One-time. `login` opens a browser; `link` may prompt for the database
# password — press Enter to skip it, deploying functions does not need it.
npx supabase login
npx supabase link --project-ref hfptedugagwunozdszsv

# Secrets — sandbox first. PAYPAL_ENV defaults to sandbox if unset or misspelled,
# so live charges require an explicit opt-in.
npx supabase secrets set \
  PAYPAL_ENV=sandbox \
  PAYPAL_CLIENT_ID=Abldip2xPQBTTmKCRI_pnMHxWwHVbBlk9RuN6eEXq0LwWWWazaFpe2PUExPKXsoriUGvHCNdTtbyeWgY \
  PAYPAL_CLIENT_SECRET='<paste the sandbox secret here>' \
  PAYPAL_WEBHOOK_ID=10W97385PF5709024 \
  REGISTRATION_TABLE=dev_taiis \
  SITE_ORIGIN=http://localhost:5173

npx supabase functions deploy create-paypal-order
npx supabase functions deploy paypal-webhook
```

`verify_jwt` is set per function in `supabase/config.toml`, so the webhook is
already configured to accept unauthenticated requests — no `--no-verify-jwt`
flag needed.

Then in the PayPal developer dashboard, add a webhook pointing at:

```
https://hfptedugagwunozdszsv.supabase.co/functions/v1/paypal-webhook
```

subscribed to `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`,
`PAYMENT.CAPTURE.REFUNDED`, and `CHECKOUT.ORDER.APPROVED`. Copy the webhook ID
it generates back into `PAYPAL_WEBHOOK_ID`.

Finally set `VITE_PAYMENT_ENABLED=true` in `.env.local` and restart the dev
server. Until that flag flips, the form saves the registration and tells the
registrant payment instructions will arrive by e-mail.

## Going live

```bash
supabase secrets set \
  PAYPAL_ENV=live \
  PAYPAL_CLIENT_ID=<live client id> \
  PAYPAL_CLIENT_SECRET=<live secret> \
  PAYPAL_WEBHOOK_ID=<live webhook id> \
  REGISTRATION_TABLE=prod_taiis \
  SITE_ORIGIN=https://<your-domain>
```

Set the live secret yourself from a terminal. Do not paste it into a chat,
a ticket, or a commit — anything that has been pasted should be rotated.

## Verifying credentials without deploying

```bash
PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... npm run verify-paypal
```

Authenticates and creates one throwaway order per currency. Credentials are read
from the environment and never written to disk. Verified against this project's
sandbox app: USD and TWD both accepted.

## Pricing

`_shared/fees.ts` is generated from `src/config/paperRegistrationContent.json`:

```bash
npm run generate-fee-table
```

Run it after changing any fee, then redeploy `create-paypal-order`. The browser
never sends a price — it sends a registration id, and the amount is derived from
the stored category, the registrant's country, and the early-bird cutoff.

## Why the webhook checks the amount

A valid signature only proves PayPal sent the event. It does not prove the
right amount arrived. The webhook compares the captured total against the figure
recorded when the order was created and marks the row `failed` on a mismatch
rather than `paid`.
