import { useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, X, AlertCircle } from "lucide-react"
import { PaymentConfirmation } from "../components/PaymentConfirmation"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { RegistrationFeeTable } from "../components/RegistrationFeeTable"
import { RegistrationForm } from "../components/RegistrationForm"
import { siteConfig } from "../config/siteConfig"
import registrationFormContent from "../config/registrationFormContent.json"

function GuidelinesBlock({
  heading,
  paragraphs,
}: {
  heading: string
  paragraphs: readonly string[]
}) {
  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
      <h2 className="font-serif text-xl text-primary-950 sm:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>
    </div>
  )
}

function RegistrationCta() {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  function openForm() {
    setOpen(true)
    // Wait for the panel to mount before scrolling to it.
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <div className="mt-8">
      {!open ? (
        <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-accent-500/5 px-6 py-8 text-center sm:px-8">
          <button
            type="button"
            onClick={openForm}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:ring-2 focus:ring-primary-500/40 focus:outline-none"
          >
            {registrationFormContent.ctaLabel}
            <ChevronDown className="h-4 w-4" />
          </button>
          <p className="mt-3 text-sm text-slate-500">
            {registrationFormContent.ctaHint}
          </p>
        </div>
      ) : null}

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="scroll-mt-24"
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
                {registrationFormContent.closeLabel}
              </button>
            </div>
            <RegistrationForm />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/** Renders PayPal's return state: ?payment=success|cancelled&ref=<registration id> */
function PaymentReturn() {
  const [params] = useSearchParams()
  const outcome = params.get("payment")
  const ref = params.get("ref")

  if (!outcome || !ref) return null

  if (outcome === "cancelled") {
    return (
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="font-medium text-amber-900">
            {registrationFormContent.confirmation.cancelledTitle}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800">
            {registrationFormContent.confirmation.cancelledBody}
          </p>
        </div>
      </div>
    )
  }

  if (outcome === "success") return <PaymentConfirmation registrationId={ref} />
  return null
}

export function PaperRegistrationPage() {
  const { paperRegistration } = siteConfig
  const [params] = useSearchParams()
  // After paying, the confirmation and invoice replace the registration CTA —
  // offering "register" again to someone who just paid is confusing.
  const returningFromPayment = params.get("payment") === "success" && Boolean(params.get("ref"))

  return (
    <>
      <Breadcrumbs current={paperRegistration.title} />
      <PageHeader title={paperRegistration.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <p className="invoice-hide text-lg leading-relaxed text-slate-600">
              {paperRegistration.intro}
            </p>

            <PaymentReturn />
            {!returningFromPayment ? <RegistrationCta /> : null}

            {paperRegistration.feeSections.map((section) => (
              <div key={section.heading} className="mt-10">
                <h2 className="font-serif text-xl text-primary-950 sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-4">
                  <RegistrationFeeTable
                    categories={section.categories}
                    earlyBirdHeader={paperRegistration.earlyBirdHeader}
                    lateHeader={paperRegistration.lateHeader}
                  />
                </div>
              </div>
            ))}

            <GuidelinesBlock
              heading={paperRegistration.generalGuidelines.heading}
              paragraphs={paperRegistration.generalGuidelines.paragraphs}
            />

            <GuidelinesBlock
              heading={paperRegistration.doctoralGuidelines.heading}
              paragraphs={paperRegistration.doctoralGuidelines.paragraphs}
            />
          </MotionSection>
        </div>
      </section>
    </>
  )
}
