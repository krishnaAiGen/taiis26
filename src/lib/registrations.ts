import { getSupabase, supabaseConfigured } from "./supabase"

/**
 * Registration target table. Development writes to `dev_taiis` and production
 * builds write to `prod_taiis`; see .env.local and .env.production.
 */
export const registrationTable = import.meta.env.VITE_REGISTRATION_TABLE

/**
 * Whether registration can run at all in this deployment. Checked by the UI so
 * a misconfigured environment disables the form instead of blanking the site.
 */
export const registrationConfigured = supabaseConfigured && Boolean(registrationTable)

/** One registration row, matching supabase/migrations/0001_taiis_registrations.sql. */
export interface RegistrationRow {
  /**
   * Generated in the browser rather than by the database default. RLS grants
   * anon INSERT but deliberately no SELECT, so PostgREST cannot return the new
   * row — knowing the id up front is what lets us hand it to the payment
   * function without opening up read access.
   */
  id: string
  registration_category: string
  attendance_mode: string
  first_name: string
  last_name: string
  email: string
  mobile_phone: string
  organization: string
  country: string
  citizenship: string
  paper_id: string | null
  paper_title: string | null
  attending_dinner: boolean
  dietary_requirement: string | null
  dietary_comments: string | null
  consent_photos: boolean
  consent_future_invite: boolean
  consent_related_events: boolean
  consent_terms: boolean
  /**
   * Indicative amount for the chosen category. Never trust this as the amount
   * actually charged — the payment service must recompute the fee server-side
   * from registration_category before creating a payment order.
   */
  payment_amount: number
  payment_currency: "USD" | "TWD"
  /** Which provider collects this fee: PayPal for USD, a Taiwanese provider for TWD. */
  payment_method: "paypal" | "ntd"
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string }

/** Postgres/PostgREST codes we can explain better than the raw driver message. */
function friendlyMessage(code: string | undefined, fallback: string): string {
  switch (code) {
    case "PGRST205":
      return `The "${registrationTable}" table does not exist yet. Run supabase/migrations/0001_taiis_registrations.sql in the Supabase SQL editor.`
    case "42501":
      return "The registration table is not accepting submissions. Please contact the organizing committee."
    case "23514":
      return "Some answers were not accepted. Please review the form and try again."
    default:
      return fallback
  }
}

export async function submitRegistration(
  row: RegistrationRow,
): Promise<SubmitResult> {
  const { error } = await getSupabase().from(registrationTable).insert(row)

  if (!error) return { ok: true }

  return {
    ok: false,
    message: friendlyMessage(
      error.code,
      error.message || "Could not submit your registration. Please try again.",
    ),
  }
}

/**
 * Payment is only attempted once the Edge Functions are deployed and their
 * secrets are set. Until then the form saves the registration and tells the
 * registrant that payment instructions will follow by e-mail.
 */
export const paymentEnabled = import.meta.env.VITE_PAYMENT_ENABLED === "true"

export type PaymentResult =
  | { ok: true; approveUrl: string }
  | { ok: false; message: string }

/**
 * Asks the create-paypal-order Edge Function for a checkout URL.
 *
 * Only the registration id is sent. The amount, currency and early-bird window
 * are all recomputed server-side from the stored row, so nothing the browser
 * says can change how much is charged.
 */
export async function createPaymentOrder(
  registrationId: string,
): Promise<PaymentResult> {
  const { data, error } = await getSupabase().functions.invoke("create-paypal-order", {
    body: { registrationId },
  })

  if (error) {
    return {
      ok: false,
      message:
        "Your registration was saved, but the payment page could not be opened. " +
        "The organizing committee will e-mail you payment instructions.",
    }
  }

  if (!data?.approveUrl) {
    return {
      ok: false,
      message:
        "Your registration was saved, but no payment link was returned. " +
        "The organizing committee will e-mail you payment instructions.",
    }
  }

  return { ok: true, approveUrl: data.approveUrl }
}
