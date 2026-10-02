import { supabase } from "./supabase"

/** Invoice data returned by the confirm-paypal-payment Edge Function. */
export interface Receipt {
  invoiceNumber: string
  registrationId: string
  issuedAt: string
  registeredAt: string
  name: string
  email: string
  organization: string
  country: string
  category: string
  attendanceMode: string
  paperId: string | null
  paperTitle: string | null
  amount: number | null
  currency: string | null
  paymentMethod: string
  paymentReference: string | null
  status: string
}

export type ReceiptResult =
  | { ok: true; receipt: Receipt }
  | { ok: false; message: string }

/**
 * Captures the approved PayPal order and returns the receipt.
 *
 * PayPal only reports approval on redirect; capturing is a separate call, which
 * the Edge Function performs. It is idempotent, so refreshing the confirmation
 * page does not double-charge.
 */
export async function confirmPayment(
  registrationId: string,
): Promise<ReceiptResult> {
  const { data, error } = await supabase.functions.invoke(
    "confirm-paypal-payment",
    { body: { registrationId } },
  )

  if (error || !data?.receipt) {
    return {
      ok: false,
      message:
        "We could not confirm your payment automatically. If your card was charged, " +
        "please contact the organizing committee with your registration reference.",
    }
  }

  return { ok: true, receipt: data.receipt as Receipt }
}

export function formatMoney(
  amount: number | null,
  currency: string | null,
): string {
  if (amount === null || !currency) return "—"
  const n = currency === "TWD"
    ? Math.round(amount).toLocaleString("en-US")
    : amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return currency === "TWD" ? `NT$${n}` : `US$${n}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
