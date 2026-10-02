import { siteConfig } from "../config/siteConfig"
import { formatDate, formatMoney, type Receipt } from "../lib/receipt"

/**
 * Printable invoice. The `invoice-sheet` class is what the print stylesheet in
 * index.css isolates, so Print / Save as PDF produces just this document
 * without the site chrome.
 */
/**
 * The badge must follow the row rather than assume payment. A refunded
 * registration still returns a receipt, and stamping "Paid" on it would hand
 * the holder a document contradicting the ledger.
 */
const statusBadge: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-lime-500/15 text-lime-600" },
  refunded: { label: "Refunded", className: "bg-slate-400/15 text-slate-600" },
  cancelled: { label: "Cancelled", className: "bg-slate-400/15 text-slate-600" },
  failed: { label: "Payment failed", className: "bg-rose-500/15 text-rose-600" },
  pending: { label: "Payment pending", className: "bg-amber-500/15 text-amber-700" },
}

export function RegistrationInvoice({ receipt }: { receipt: Receipt }) {
  const { conference } = siteConfig
  const badge = statusBadge[receipt.status] ?? statusBadge.pending
  const isPaid = receipt.status === "paid"
  const rows: Array<[string, string]> = [
    ["Registration category", receipt.category],
    ["Attendance mode", receipt.attendanceMode],
    ...(receipt.paperId
      ? ([["Paper ID", receipt.paperId]] as Array<[string, string]>)
      : []),
    ...(receipt.paperTitle
      ? ([["Paper title", receipt.paperTitle]] as Array<[string, string]>)
      : []),
  ]

  return (
    <div className="invoice-sheet rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <p className="font-serif text-2xl text-primary-950">
            {conference.acronym}
          </p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
            {conference.fullName}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {conference.dates} · {conference.locationFull}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Registration Invoice
          </p>
          <p className="mt-1 font-mono text-base font-semibold text-primary-950">
            {receipt.invoiceNumber}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Issued {formatDate(receipt.issuedAt)}
          </p>
          <p
            className={`mt-2 inline-block rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${badge.className}`}
          >
            {badge.label}
          </p>
        </div>
      </div>

      {/* Parties */}
      <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Billed to
          </p>
          <p className="mt-2 text-base font-semibold text-primary-950">
            {receipt.name}
          </p>
          <p className="text-sm text-slate-600">{receipt.organization}</p>
          <p className="text-sm text-slate-600">{receipt.country}</p>
          <p className="mt-1 text-sm text-slate-600">{receipt.email}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Issued by
          </p>
          <p className="mt-2 text-base font-semibold text-primary-950">
            {conference.organizer}
          </p>
          <p className="text-sm text-slate-600">{conference.locationFull}</p>
          <p className="mt-1 text-sm text-slate-600">{conference.email}</p>
        </div>
      </div>

      {/* Line items */}
      <table className="mt-6 w-full text-left">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="pb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Description
            </th>
            <th className="pb-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-4 align-top">
              <p className="text-base font-medium text-primary-950">
                Conference registration — {conference.acronym}
              </p>
              <dl className="mt-2 space-y-1">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex flex-wrap gap-x-2 text-sm">
                    <dt className="text-slate-500">{label}:</dt>
                    <dd className="text-slate-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </td>
            <td className="py-4 text-right align-top text-base font-medium text-primary-950">
              {formatMoney(receipt.amount, receipt.currency)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-300">
            <td className="pt-4 text-base font-semibold text-primary-950">
              {isPaid ? "Total paid" : "Total due"}
            </td>
            <td className="pt-4 text-right font-serif text-xl text-primary-950">
              {formatMoney(receipt.amount, receipt.currency)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Payment detail */}
      <div className="mt-6 grid gap-x-8 gap-y-2 border-t border-slate-200 pt-6 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Payment method</span>
          <span className="text-slate-700">
            {receipt.paymentMethod === "paypal" ? "PayPal" : "Bank / NT$ provider"}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Transaction reference</span>
          <span className="font-mono text-slate-700">
            {receipt.paymentReference ?? "—"}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Registered on</span>
          <span className="text-slate-700">{formatDate(receipt.registeredAt)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Registration ID</span>
          <span className="font-mono text-xs text-slate-700">
            {receipt.registrationId}
          </span>
        </div>
      </div>

      <p className="mt-6 border-t border-slate-200 pt-5 text-sm leading-relaxed text-slate-500">
        {isPaid
          ? "This document confirms payment of the registration fee for "
          : "This document records a registration whose fee is not settled, for "}
        {conference.fullName} ({conference.acronym}), {conference.dates}, at{" "}
        {conference.locationFull}.{" "}
        {isPaid
          ? "Please retain it for reimbursement or visa purposes."
          : "It is not a proof of payment."}{" "}
        For queries, contact {conference.email}.
      </p>
    </div>
  )
}
