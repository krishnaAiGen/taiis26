# Deploying to Vercel + going live with real card payments

Two differences from the Hostinger setup matter, and both will break payment
silently if missed:

1. **Vercel serves at the domain root**, not under `/taiis2026/`. The base path
   and PayPal's return path both change.
2. **Vercel ignores `.htaccess` and `_redirects`.** SPA routing comes from
   `vercel.json` instead — already committed.

`vercel.json` sets `VITE_BASE_PATH=/` for Vercel builds only, so local
Hostinger builds still produce the `/taiis2026/` version. Nothing to remember.

---

## Step 1 — Push

```bash
git add vercel.json VERCEL.md && git commit -m "Add Vercel deployment config"
git push
```

## Step 2 — Import the project

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → pick
   `krishnaAiGen/taiis26`
2. Framework preset: **Vite** (auto-detected). Build command `npm run build` and
   output directory `dist` come from `vercel.json` — leave them alone.
3. **Do not deploy yet** — add the environment variables first (Step 3).
   Deploying without them fails the build, by design: `src/lib/supabase.ts`
   throws rather than shipping a broken bundle.

## Step 3 — Environment variables in Vercel

Project → **Settings → Environment Variables**. Add each for **Production**
(and Preview, if you want preview deploys to work):

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://hfptedugagwunozdszsv.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_PxFgWNS-m5LalnmZu3RiiQ_ngGBLvaP` |
| `VITE_REGISTRATION_TABLE` | `prod_taiis` |
| `VITE_PAYMENT_ENABLED` | `false` — for the first deploy only |

These override the committed `.env.production`, so there is no file to edit.

**Never add** `PAYPAL_CLIENT_SECRET` or a Supabase `service_role` key here.
Every `VITE_`-prefixed variable is compiled into the public JavaScript bundle.
PayPal secrets belong in Supabase function secrets only.

Deploy. Note the URL — e.g. `https://taiis26.vercel.app`. Everything below
calls it `<YOUR-URL>`.

Check the deploy: open `<YOUR-URL>/paper-registration` **directly in a fresh
tab**. It must load, not 404. That proves the SPA rewrite works, which is the
same mechanism PayPal's return URL depends on.

## Step 4 — Point the Edge Functions at the Vercel domain

Two values change because the site now lives at the root:

```bash
npx supabase secrets set \
  SITE_ORIGIN=<YOUR-URL> \
  SITE_BASE_PATH=/ \
  ALLOWED_ORIGINS='<YOUR-URL>,http://localhost:5173' \
  REGISTRATION_TABLE=prod_taiis
```

`SITE_BASE_PATH=/` is the one people miss. Left at `/taiis2026/`, PayPal would
return payers to `<YOUR-URL>/taiis2026/paper-registration`, which does not exist
on Vercel — they would pay and land on a blank page.

## Step 5 — Live PayPal credentials

1. [developer.paypal.com/dashboard](https://developer.paypal.com/dashboard/) →
   **Apps & Credentials** → toggle **Live** (top right)
2. Create an app → copy the **Client ID** and **Secret**
3. Still in Live mode: **Webhooks → Add webhook**

   ```
   https://hfptedugagwunozdszsv.supabase.co/functions/v1/paypal-webhook
   ```

   Events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`,
   `PAYMENT.CAPTURE.REFUNDED`, `PAYMENT.CAPTURE.REVERSED`
4. Copy the **Webhook ID** — the sandbox one will not validate live events

Live credentials require a **verified PayPal business account**. Personal
accounts cannot issue live REST credentials.

Verify the keys before trusting them:

```bash
PAYPAL_ENV=live \
PAYPAL_CLIENT_ID=<live client id> \
PAYPAL_CLIENT_SECRET=<live secret> \
npm run verify-paypal
```

Authenticates and creates one throwaway order per currency. No money moves.

## Step 6 — Switch the functions to live

```bash
npx supabase secrets set \
  PAYPAL_ENV=live \
  PAYPAL_CLIENT_ID=<live client id> \
  PAYPAL_CLIENT_SECRET='<live secret>' \
  PAYPAL_WEBHOOK_ID=<live webhook id>
```

Quote the secret — it contains `-` and `_`, and an unquoted value can be
mangled by the shell. Paste it in **full**: a truncated secret does not fail
here, it fails later as a confusing `invalid_client`.

Confirm with `npx supabase secrets list` (digests, never plaintext).

## Step 7 — The US$1 live test

Rather than testing with a full US$450 registration, enable the hidden US$1
category. It needs **two** switches, one of them server-side:

```bash
npx supabase secrets set ALLOW_TEST_CATEGORY=true
```

In Vercel → Settings → Environment Variables:

| Name | Value |
| --- | --- |
| `VITE_PAYMENT_ENABLED` | `true` |
| `VITE_SHOW_TEST_CATEGORY` | `true` |

Then **Deployments → ⋯ → Redeploy**. Vercel bakes env vars in at build time, so
changing a variable has no effect until you redeploy.

### Run the test

1. `<YOUR-URL>/paper-registration` → **Click here to register**
2. Category: **TEST — do not use (US$1)** under *Live payment verification*
3. Currency: **USD** (NT$ has no provider wired)
4. Fill the form → **Proceed to payment**
5. At PayPal choose **Pay with Debit or Credit Card** and use a real card
6. You should return to the congratulations screen with a printable invoice

Then confirm in Supabase → Table Editor → `prod_taiis`, newest row:

| Column | Expected |
| --- | --- |
| `payment_status` | `paid` |
| `paid_at` | a timestamp |
| `payment_capture_id` | a PayPal capture id |
| `payment_amount` | `1.00` |

If it stays `pending`, the capture failed. Supabase dashboard → Edge Functions →
`confirm-paypal-payment` → **Logs**.

Refund the US$1 in the PayPal dashboard afterwards.

## Step 8 — Turn the test off

**Server first** — this is the switch that actually prevents US$1 registrations:

```bash
npx supabase secrets set ALLOW_TEST_CATEGORY=false
```

Then in Vercel set `VITE_SHOW_TEST_CATEGORY=false` and redeploy. Leave
`VITE_PAYMENT_ENABLED=true`.

Delete the test rows:

```sql
delete from public.prod_taiis
where registration_category like 'Live payment verification%';
```

## Step 9 — Custom domain (optional)

Vercel → Settings → Domains. If you point a domain here, update the origin:

```bash
npx supabase secrets set \
  SITE_ORIGIN=https://<new-domain> \
  ALLOWED_ORIGINS='https://<new-domain>,http://localhost:5173'
```

`cyber-conf.com` currently serves WordPress on Hostinger, so a subdomain such as
`taiis2026.cyber-conf.com` avoids a conflict. Keeping the site under
`cyber-conf.com/taiis2026/` is not possible from Vercel without moving the whole
apex domain.

## Step 10 — Harden after launch

```bash
npx supabase secrets set \
  ALLOWED_ORIGINS='<YOUR-URL>' \
  ALLOW_LOCALHOST=false
```

Drops the localhost CORS allowance once you stop testing locally.

---

## Complete variable reference

### Vercel — Settings → Environment Variables (public, in the bundle)

| Name | Production value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://hfptedugagwunozdszsv.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |
| `VITE_REGISTRATION_TABLE` | `prod_taiis` |
| `VITE_PAYMENT_ENABLED` | `true` |
| `VITE_SHOW_TEST_CATEGORY` | `false` (`true` only while testing) |

`VITE_BASE_PATH` is set to `/` by `vercel.json` — do not add it manually.

### Supabase — `npx supabase secrets set` (private, server only)

| Name | Production value |
| --- | --- |
| `PAYPAL_ENV` | `live` |
| `PAYPAL_CLIENT_ID` | live client id |
| `PAYPAL_CLIENT_SECRET` | live secret |
| `PAYPAL_WEBHOOK_ID` | live webhook id |
| `REGISTRATION_TABLE` | `prod_taiis` |
| `SITE_ORIGIN` | `<YOUR-URL>` |
| `SITE_BASE_PATH` | `/` |
| `ALLOWED_ORIGINS` | `<YOUR-URL>` |
| `ALLOW_TEST_CATEGORY` | `false` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically —
never set them yourself.

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Build fails: "Missing Supabase env vars" | Step 3 variables not set for Production |
| Blank page, assets 404 | `vercel.json` missing — Vercel built with the wrong base |
| `/paper-registration` 404s on direct load | `vercel.json` rewrites missing |
| "payment page could not be opened" | `ALLOWED_ORIGINS` missing the Vercel URL (CORS) — check the browser console |
| Redirected to PayPal, return page is blank | `SITE_BASE_PATH` still `/taiis2026/` |
| `invalid_client` in function logs | Secret truncated or sandbox/live mismatch |
| Row stays `pending` after paying | Capture failed — see `confirm-paypal-payment` logs |
| Env var change had no effect | Vercel bakes them in at build; redeploy |

## Still outstanding

NT$ registrations have no payment provider. They save with
`payment_method = 'ntd'` and `payment_status = 'pending'`, and the registrant is
told instructions will follow by e-mail. Collect and mark them manually:

```sql
select created_at, first_name, last_name, email, payment_amount
from public.prod_taiis
where payment_method = 'ntd' and payment_status = 'pending'
order by created_at desc;
```
