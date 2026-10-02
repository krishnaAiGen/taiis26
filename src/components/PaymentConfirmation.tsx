import { useEffect, useRef, useState } from "react"
import { CheckCircle2, AlertCircle, Loader2, Printer } from "lucide-react"
import { siteConfig } from "../config/siteConfig"
import content from "../config/registrationFormContent.json"
import { confirmPayment, type Receipt } from "../lib/receipt"
import { RegistrationInvoice } from "./RegistrationInvoice"

const { confirmation } = content

/** Substitutes the {name}, {location} and {dates} placeholders in the content file. */
function fill(template: string, name: string): string {
  return template
    .replaceAll("{name}", name)
    .replaceAll("{location}", siteConfig.conference.location)
    .replaceAll("{dates}", siteConfig.conference.dates)
}

type State =
  | { phase: "working" }
  | { phase: "done"; receipt: Receipt }
  | { phase: "failed"; message: string }

export function PaymentConfirmation({ registrationId }: { registrationId: string }) {
  const [state, setState] = useState<State>({ phase: "working" })
  /**
   * The capture request is memoised rather than guarded by a boolean, so
   * StrictMode's double-mount in development fires it once but still delivers
   * the result. Guarding with a flag instead would let the first pass's cleanup
   * discard the only response and leave the page stuck on "confirming".
   */
  const request = useRef<Promise<Awaited<ReturnType<typeof confirmPayment>>> | null>(null)

  useEffect(() => {
    let active = true
    request.current ??= confirmPayment(registrationId)
    request.current.then((result) => {
      if (!active) return
      setState(
        result.ok
          ? { phase: "done", receipt: result.receipt }
          : { phase: "failed", message: result.message },
      )
    })
    return () => {
      active = false
    }
  }, [registrationId])

  if (state.phase === "working") {
    return (
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
        <p className="text-base text-slate-600">{confirmation.working}</p>
      </div>
    )
  }

  if (state.phase === "failed") {
    return (
      <div
        role="alert"
        className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="font-medium text-amber-900">{confirmation.failedTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800">
            {state.message}
          </p>
          <p className="mt-2 text-sm text-amber-800">
            {confirmation.referenceLabel}{" "}
            <span className="font-mono">{registrationId}</span>
          </p>
        </div>
      </div>
    )
  }

  // A receipt is returned for any settled-or-not registration, so the banner
  // follows the status rather than the mere presence of a receipt. Printing a
  // "Congratulations — you are registered!" header above a refunded invoice
  // would contradict the document underneath it.
  const isPaid = state.receipt.status === "paid"

  return (
    <div className="mt-8">
      {/* Banner — hidden when printing, the invoice stands alone */}
      <div
        className={`invoice-hide rounded-2xl border px-6 py-8 text-center sm:px-10 ${
          isPaid
            ? "border-lime-500/40 bg-gradient-to-br from-lime-50/80 to-accent-500/5"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        {isPaid ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-lime-500" />
        ) : (
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        )}
        <h2 className="mt-4 font-serif text-2xl text-primary-950 sm:text-3xl">
          {isPaid ? confirmation.title : confirmation.unsettledTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          {fill(
            isPaid ? confirmation.body : confirmation.unsettledBody,
            state.receipt.name,
          )}
        </p>
        {isPaid ? (
          <p className="mt-4 font-serif text-xl text-primary-700 sm:text-2xl">
            {fill(confirmation.seeYou, state.receipt.name)}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:ring-2 focus:ring-primary-500/40 focus:outline-none"
        >
          <Printer className="h-4 w-4" />
          {confirmation.printLabel}
        </button>
        <p className="mt-2 text-sm text-slate-500">{confirmation.printHint}</p>
      </div>

      <div className="mt-8">
        <RegistrationInvoice receipt={state.receipt} />
      </div>
    </div>
  )
}
