# Deploying TAIIS 2026 registration + payment

Target: **https://cyber-conf.com/taiis2026/** — Hostinger (LiteSpeed), deployed by
building locally and uploading `dist/`.

---

## 0. Already done — do not redo

| Item | State |
| --- | --- |
| `dev_taiis` / `prod_taiis` tables | Created, RLS enabled |
| Edge Functions | All three deployed and ACTIVE |
| `0003_payment_integrity.sql` | **Must be run — see step 1a** |
| `public/.htaccess` SPA rewrite | In the repo, ships with every build |
| Base path `/taiis2026/` | Already the default — leave `VITE_BASE_PATH` unset |
| `ALLOWED_ORIGINS` | Already includes `https://cyber-conf.com` |

The three functions, and what each does:

| Function | `verify_jwt` | Role |
| --- | --- | --- |
| `create-paypal-order` | true | Browser asks for a checkout URL; recomputes the fee server-side |
| `confirm-paypal-payment` | true | Captures the approved order on return and returns the invoice |
| `paypal-webhook` | **false** | PayPal's async callback; authenticity via PayPal signature |

Nothing to create. Only secrets change.

---

## 1a. Run the payment-integrity migration — do this first

Run `supabase/migrations/0003_payment_integrity.sql` in the Supabase dashboard →
SQL Editor. It is safe to re-run.

It does two things the Edge Functions now depend on:

- adds `payment_capture_id`, so `payment_reference` can keep holding the PayPal
  **order** id for the life of the row instead of being overwritten by the
  capture id
- replaces the anon INSERT policy so a browser can no longer pre-set
  `payment_reference` or `payment_capture_id`

Without it, `confirm-paypal-payment` fails on every payment with an unknown
column, so run it **before** redeploying the functions:

```bash
npx supabase functions deploy create-paypal-order confirm-paypal-payment paypal-webhook
```

If you tested payments before this migration, clear the old rows — their
`payment_reference` holds a capture id rather than an order id:

```sql
delete from public.dev_taiis where payment_reference is not null;
```

---

## 1. Create live PayPal credentials

1. [developer.paypal.com/dashboard](https://developer.paypal.com/dashboard/) →
   **Apps & Credentials** → toggle **Live** (top right).
2. Create an app (or open the existing one). Copy the **Client ID** and **Secret**.
3. Still in Live mode, open the app's **Webhooks** → Add webhook:

   ```
   https://hfptedugagwunozdszsv.supabase.co/functions/v1/paypal-webhook
   ```

   Subscribe to: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`,
   `PAYMENT.CAPTURE.REFUNDED`, `PAYMENT.CAPTURE.REVERSED`.

   **Do not subscribe to `CHECKOUT.ORDER.APPROVED`.** Approval is the payer
   clicking "Pay Now"; PayPal moves no money until the order is captured. The
   webhook ignores the event if it arrives, but leaving it unsubscribed keeps
   the intent clear. `PAYMENT.CAPTURE.COMPLETED` is the only event that proves
   a fee was collected.
4. Copy the **Webhook ID** PayPal generates — the sandbox one will not validate
   live events.

Verify the keys before trusting them:

```bash
PAYPAL_ENV=live \
PAYPAL_CLIENT_ID=<live client id> \
PAYPAL_CLIENT_SECRET=<live secret> \
npm run verify-paypal
```

This authenticates and creates one throwaway order per currency. No money moves.

---

## 2. Point the Edge Functions at production

Four secrets change. Paste the **full** secret — a truncated value fails later
as a confusing `invalid_client`.

```bash
npx supabase secrets set \
  SITE_ORIGIN=https://cyber-conf.com \
  REGISTRATION_TABLE=prod_taiis \
  PAYPAL_ENV=live \
  PAYPAL_CLIENT_ID=<live client id> \
  PAYPAL_CLIENT_SECRET='<live secret>' \
  PAYPAL_WEBHOOK_ID=<live webhook id>
```

Confirm all are present (values are shown as digests, never plaintext):

```bash
npx supabase secrets list
```

`SITE_BASE_PATH=/taiis2026/` and `ALLOWED_ORIGINS` are already correct.

> Changing `SITE_ORIGIN` sends PayPal's return URL to cyber-conf.com, so local
> payment testing stops working from that point. Do local testing first.

---

## 3. Turn payment on for production builds

Edit `.env.production`:

```diff
-VITE_PAYMENT_ENABLED=false
+VITE_PAYMENT_ENABLED=true
```

`VITE_REGISTRATION_TABLE=prod_taiis` is already set there, and mode-specific env
files outrank `.env.local`, so a production build uses the production table even
though `.env.local` says `dev_taiis`.

**Do not** put the PayPal secret in any `.env` file — every `VITE_`-prefixed
variable is compiled into the public JavaScript bundle.

---

## 4. Build and upload

```bash
npm run build
```

Upload the **contents** of `dist/` into `public_html/taiis2026/` — not the
`dist` folder itself, or the site lands at `/taiis2026/dist/`.

`dist/` includes `.htaccess`. Make sure your FTP/file manager is showing hidden
files, or deep links will 404 after an upload that replaces the directory.

The build reads Supabase credentials from `.env.local`, which is gitignored — so
always build on a machine that has it. There is no CI; if you add one later, set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in its environment.

---

## 5. Verify on the live site

```bash
curl -sI https://cyber-conf.com/taiis2026/paper-registration | head -1   # expect 200
```

Then in a browser:

1. `https://cyber-conf.com/taiis2026/paper-registration` → **Click here to register**
2. Fill the form, choose **USD**, submit → should redirect to `paypal.com`
3. Complete payment with a real card (cheapest category, refund afterwards)
4. You should return to the congratulations screen with a printable invoice
5. Supabase → Table Editor → `prod_taiis` → newest row shows
   `payment_status = paid` and `paid_at` set

If the row stays `pending`, the capture or webhook failed — check
Supabase dashboard → Edge Functions → Logs for `confirm-paypal-payment`.

---

## 6. The US$1 live-payment test

A hidden **US$1** registration category exists for verifying real payments
without charging a full fee. It is off by default and needs **two** switches —
one client, one server:

| Switch | Where | Effect |
| --- | --- | --- |
| `VITE_SHOW_TEST_CATEGORY` | `.env.production` | Shows the option in the dropdown |
| `ALLOW_TEST_CATEGORY` | Supabase secret | Lets the server price it at US$1 |

Both are required. The client flag alone is not a safeguard: the category string
is present in the public JavaScript bundle either way, so without the server
gate anyone who read it once could keep registering for a dollar. With the
server gate off, such an attempt fails before a PayPal order is created.

### To run the test

```bash
# 1. Server side
npx supabase secrets set ALLOW_TEST_CATEGORY=true

# 2. Client side — set VITE_SHOW_TEST_CATEGORY=true in .env.production, then
npm run build
# upload dist/ contents
```

Register choosing **“TEST — do not use (US$1)”** under *Live payment
verification*, pay US$1 with a real card, and confirm:

- you land on the congratulations screen with a printable invoice
- `prod_taiis` shows `payment_status = 'paid'` for that row

Refund the US$1 in the PayPal dashboard afterwards.

### To turn it off again

```bash
npx supabase secrets set ALLOW_TEST_CATEGORY=false
```

Set `VITE_SHOW_TEST_CATEGORY=false` in `.env.production`, rebuild, re-upload.
Turn the **server** flag off first — that is the one that actually prevents a
US$1 registration.

Then remove the test rows:

```sql
delete from public.prod_taiis
where registration_category like 'Live payment verification%';
```

## 7. Optional hardening after launch

```bash
npx supabase secrets set ALLOW_LOCALHOST=false
```

Removes the loopback CORS allowance once you no longer test locally.

---

## Testing on the live domain without taking real money

Useful intermediate step — real domain, fake money, production table untouched:

```bash
npx supabase secrets set \
  PAYPAL_ENV=sandbox \
  PAYPAL_CLIENT_ID=<sandbox client id> \
  PAYPAL_CLIENT_SECRET='<sandbox secret>' \
  PAYPAL_WEBHOOK_ID=<sandbox webhook id> \
  REGISTRATION_TABLE=dev_taiis \
  SITE_ORIGIN=https://cyber-conf.com
```

Switch `PAYPAL_ENV` and `REGISTRATION_TABLE` **together**. Sandbox payments
landing in `prod_taiis` would corrupt the real registration list.

---

## Known limitation: NT$ registrations

PayPal blocks payments between two Taiwan-registered accounts, and the merchant
account is registered in Taiwan. So:

- **USD** → PayPal, fully automated
- **NT$** → saved with `payment_method = 'ntd'` and `payment_status = 'pending'`;
  the registrant is told instructions will follow by e-mail

Until a Taiwanese provider (ECPay / NewebPay / bank transfer) is wired, NT$
registrations must be collected and marked paid manually:

```sql
update public.prod_taiis
set payment_status = 'paid', paid_at = now(), payment_reference = '<bank ref>'
where id = '<registration id>';
```

Find outstanding ones with:

```sql
select created_at, first_name, last_name, email, organization,
       payment_amount, payment_currency
from public.prod_taiis
where payment_method = 'ntd' and payment_status = 'pending'
order by created_at desc;
```

---

## Go-live checklist

- [ ] `0003_payment_integrity.sql` run; all three functions redeployed
- [ ] Live PayPal app created; credentials verified with `npm run verify-paypal`
- [ ] Live webhook created at the Supabase function URL; its ID copied
- [ ] Webhook subscriptions do **not** include `CHECKOUT.ORDER.APPROVED`
- [ ] `SITE_ORIGIN=https://cyber-conf.com`
- [ ] `REGISTRATION_TABLE=prod_taiis`
- [ ] `PAYPAL_ENV=live` with live client ID / secret / webhook ID
- [ ] `VITE_PAYMENT_ENABLED=true` in `.env.production`
- [ ] `npm run build`, contents of `dist/` uploaded to `public_html/taiis2026/`
- [ ] `https://cyber-conf.com/taiis2026/paper-registration` loads in a fresh tab
- [ ] One real end-to-end payment completed and refunded; row shows `paid`
- [ ] A plan exists for NT$ registrations

Do the real payment before announcing registration. A sandbox pass does not
prove the live webhook is reachable.
