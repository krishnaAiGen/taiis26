import { useId, useMemo, useState } from "react"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { siteConfig } from "../config/siteConfig"
import content from "../config/registrationFormContent.json"
import {
  submitRegistration,
  createPaymentOrder,
  paymentEnabled,
  type RegistrationRow,
} from "../lib/registrations"

interface FeeAmount {
  usd: number
  ntd: number
}

interface CategoryOption {
  /** Unique across sections — category names repeat between fee tables. */
  value: string
  name: string
  section: string
  earlyBird: FeeAmount
  late: FeeAmount
  attendanceMode: string
  requiresPaper: boolean
}

const { participation, fields, dietary, consents, submit, sections } = content

/** Category names already encode the mode, so it is derived rather than asked. */
function attendanceModeFor(name: string): string {
  return /online/i.test(name) ? "Online" : "In-Person"
}

type Currency = "USD" | "TWD"

/** Suggested default only — the registrant can change it. */
function suggestedCurrency(country: string): Currency {
  return /^taiwan$/i.test(country.trim()) ? "TWD" : "USD"
}

/**
 * US$ is collected by PayPal. NT$ goes to a separate Taiwanese provider:
 * PayPal blocks payments between two Taiwan-registered accounts, and the
 * conference merchant account is registered in Taiwan.
 */
function methodForCurrency(currency: Currency): "paypal" | "ntd" {
  return currency === "TWD" ? "ntd" : "paypal"
}

/**
 * US$1 entry for verifying live payments. Shown only while
 * VITE_SHOW_TEST_CATEGORY is "true", and separately gated server-side by
 * ALLOW_TEST_CATEGORY — hiding it here alone would not stop anyone who had
 * already read the category string out of the bundle.
 */
const showTestCategory = import.meta.env.VITE_SHOW_TEST_CATEGORY === "true"

function buildCategoryOptions(): CategoryOption[] {
  const exempt: readonly string[] = participation.paperExemptSections
  const real = siteConfig.paperRegistration.feeSections.flatMap((section) =>
    section.categories.map((category) => ({
      value: `${section.heading} :: ${category.name}`,
      name: category.name,
      section: section.heading,
      earlyBird: category.earlyBird,
      late: category.late,
      attendanceMode: attendanceModeFor(category.name),
      requiresPaper: !exempt.includes(section.heading),
    })),
  )

  if (!showTestCategory) return real

  const t = content.testCategory
  const amounts = { usd: t.usd, ntd: t.ntd }
  return [
    ...real,
    {
      value: `${t.section} :: ${t.name}`,
      name: t.name,
      section: t.section,
      earlyBird: amounts,
      late: amounts,
      attendanceMode: "Online",
      requiresPaper: false,
    },
  ]
}

function money(amount: FeeAmount): string {
  return `US$${amount.usd.toLocaleString("en-US")} / NT$${amount.ntd.toLocaleString("en-US")}`
}

const initialValues = {
  category: "",
  /** Empty until chosen; falls back to the country-based suggestion. */
  currency: "" as Currency | "",
  firstName: "",
  lastName: "",
  email: "",
  mobilePhone: "",
  organization: "",
  country: "",
  citizenship: "",
  paperId: "",
  paperTitle: "",
  attendingDinner: "yes",
  dietaryRequirement: dietary.options[0],
  dietaryComments: "",
  consentPhotos: false,
  consentFutureInvite: false,
  consentRelatedEvents: false,
  consentTerms: false,
}

type Values = typeof initialValues
type Errors = Partial<Record<keyof Values, string>>

const labelClass = "block text-sm font-medium text-primary-950"
const controlClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"
const errorControlClass = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/30"
const sectionTitleClass =
  "font-serif text-lg text-primary-950 sm:text-xl"

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm text-rose-600">
      {message}
    </p>
  )
}

export function RegistrationForm() {
  const formId = useId()
  const categories = useMemo(buildCategoryOptions, [])
  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  /** Set when the row saved but the payment page could not be opened. */
  const [savedWithoutPayment, setSavedWithoutPayment] = useState<string | null>(null)

  const selected = categories.find((c) => c.value === values.category) ?? null
  const needsPaper = selected?.requiresPaper ?? false

  /**
   * The currency the registrant picked, falling back to the one suggested by
   * their country until they touch the control.
   */
  const billingCurrency: Currency = values.currency || suggestedCurrency(values.country)
  const billingAmount =
    billingCurrency === "TWD"
      ? (selected?.earlyBird.ntd ?? 0)
      : (selected?.earlyBird.usd ?? 0)
  const billingLabel =
    billingCurrency === "TWD"
      ? `NT$${billingAmount.toLocaleString("en-US")}`
      : `US$${billingAmount.toLocaleString("en-US")}`

  function setField<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  function validate(): Errors {
    const next: Errors = {}
    const req = content.validation.required

    if (!values.category) next.category = req
    if (!values.firstName.trim()) next.firstName = req
    if (!values.lastName.trim()) next.lastName = req
    if (!values.mobilePhone.trim()) next.mobilePhone = req
    if (!values.organization.trim()) next.organization = req
    if (!values.country) next.country = req
    if (!values.citizenship.trim()) next.citizenship = req

    if (!values.email.trim()) {
      next.email = req
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim())) {
      next.email = content.validation.email
    }

    if (needsPaper) {
      if (!values.paperId.trim()) next.paperId = req
      if (!values.paperTitle.trim()) next.paperTitle = req
    }

    if (!values.consentTerms) next.consentTerms = content.validation.terms

    return next
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const found = validate()
    if (Object.keys(found).length > 0) {
      setErrors(found)
      const firstKey = Object.keys(found)[0]
      document.getElementById(`${formId}-${firstKey}`)?.focus()
      return
    }

    setPending(true)
    const registrationId = crypto.randomUUID()
    const row: RegistrationRow = {
      id: registrationId,
      registration_category: selected ? `${selected.section} — ${selected.name}` : "",
      attendance_mode: selected?.attendanceMode ?? "",
      first_name: values.firstName.trim(),
      last_name: values.lastName.trim(),
      email: values.email.trim(),
      mobile_phone: values.mobilePhone.trim(),
      organization: values.organization.trim(),
      country: values.country,
      citizenship: values.citizenship.trim(),
      paper_id: needsPaper ? values.paperId.trim() : null,
      paper_title: needsPaper ? values.paperTitle.trim() : null,
      attending_dinner: values.attendingDinner === "yes",
      dietary_requirement: values.dietaryRequirement || null,
      dietary_comments: values.dietaryComments.trim() || null,
      consent_photos: values.consentPhotos,
      consent_future_invite: values.consentFutureInvite,
      consent_related_events: values.consentRelatedEvents,
      consent_terms: values.consentTerms,
      // Early-bird vs late is decided server-side at payment time; this is the
      // figure shown to the registrant, recorded for reconciliation only.
      payment_amount: billingAmount,
      payment_currency: billingCurrency,
      payment_method: methodForCurrency(billingCurrency),
    }

    const result = await submitRegistration(row)

    if (!result.ok) {
      setPending(false)
      setSubmitError(result.message)
      return
    }

    // The registration is saved at this point. A payment failure from here on
    // must never read as "your registration was lost".

    // NT$ is collected by a separate Taiwanese provider, not PayPal. Until that
    // provider is wired, these registrants are told instructions will follow.
    if (methodForCurrency(billingCurrency) === "ntd") {
      setPending(false)
      setValues(initialValues)
      setErrors({})
      setSavedWithoutPayment(submit.ntdPending)
      setDone(true)
      return
    }

    if (paymentEnabled) {
      const payment = await createPaymentOrder(registrationId)
      if (payment.ok) {
        // Leave `pending` true: the button stays disabled through the redirect.
        window.location.href = payment.approveUrl
        return
      }
      setPending(false)
      setValues(initialValues)
      setErrors({})
      setSavedWithoutPayment(payment.message)
      setDone(true)
      return
    }

    setPending(false)
    setValues(initialValues)
    setErrors({})
    setDone(true)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-lime-500/40 bg-lime-50/60 px-6 py-8 text-center sm:px-8">
        <CheckCircle2 className="mx-auto h-10 w-10 text-lime-500" />
        <h3 className="mt-4 font-serif text-xl text-primary-950 sm:text-2xl">
          {submit.successTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
          {savedWithoutPayment ?? submit.successBody}
        </p>
        <button
          type="button"
          onClick={() => {
            setSavedWithoutPayment(null)
            setDone(false)
          }}
          className="mt-6 rounded-xl border border-primary-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-sm transition-colors hover:bg-primary-50"
        >
          {submit.successAgain}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8"
    >
      <h2 className="font-serif text-2xl text-primary-950 sm:text-3xl">
        {content.formTitle}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-slate-600">
        {content.formIntro}
      </p>
      <p className="mt-4 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-sm text-primary-900">
        {content.statusNote}
      </p>
      <p className="mt-3 text-sm text-slate-500">{content.requiredNote}</p>

      {/* ---------------------------------------------- Participation */}
      <fieldset className="mt-8 border-t border-slate-200 pt-6">
        <legend className={sectionTitleClass}>{sections.participation}</legend>

        <div className="mt-4">
          <label className={labelClass} htmlFor={`${formId}-category`}>
            {participation.categoryLabel} *
          </label>
          <select
            id={`${formId}-category`}
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? `${formId}-category-error` : undefined}
            className={`${controlClass} ${errors.category ? errorControlClass : ""}`}
          >
            <option value="">{participation.categoryPlaceholder}</option>
            {/* Groups come from the options themselves so the test entry, which
                is not part of the published fee table, still appears. */}
            {[...new Set(categories.map((c) => c.section))].map((section) => (
              <optgroup key={section} label={section}>
                {categories
                  .filter((c) => c.section === section)
                  .map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name} — {money(c.earlyBird)}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <FieldError id={`${formId}-category-error`} message={errors.category} />
        </div>

        {selected ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {participation.earlyBirdLabel}
                </dt>
                <dd className="mt-1 text-base font-semibold text-primary-950">
                  {money(selected.earlyBird)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {participation.lateLabel}
                </dt>
                <dd className="mt-1 text-base font-semibold text-primary-950">
                  {money(selected.late)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {participation.attendanceModeLabel}
                </dt>
                <dd className="mt-1 text-base font-semibold text-primary-950">
                  {selected.attendanceMode}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-slate-500">{participation.priceNote}</p>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <span className={labelClass}>{participation.currencyLabel} *</span>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["USD", selected.earlyBird.usd, participation.currencyUsdNote],
                    ["TWD", selected.earlyBird.ntd, participation.currencyTwdNote],
                  ] as const
                ).map(([code, amount, note]) => {
                  const active = billingCurrency === code
                  return (
                    <label
                      key={code}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                        active
                          ? "border-primary-500 bg-primary-50/70 ring-1 ring-primary-500/30"
                          : "border-slate-300 bg-white hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${formId}-currency`}
                        value={code}
                        checked={active}
                        onChange={() => setField("currency", code)}
                        className="mt-1 h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500/40"
                      />
                      <span>
                        <span className="block font-semibold text-primary-950">
                          {code === "TWD"
                            ? `NT$${amount.toLocaleString("en-US")}`
                            : `US$${amount.toLocaleString("en-US")}`}
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-500">{note}</span>
                      </span>
                    </label>
                  )
                })}
              </div>

              <p className="mt-3 text-base text-primary-950">
                {participation.chargeLabel}{" "}
                <strong className="font-semibold">{billingLabel}</strong>
              </p>
            </div>
          </div>
        ) : null}
      </fieldset>

      {/* ---------------------------------------------- Contact */}
      <fieldset className="mt-8 border-t border-slate-200 pt-6">
        <legend className={sectionTitleClass}>{sections.contact}</legend>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor={`${formId}-firstName`}>
              {fields.firstName.label} *
            </label>
            <input
              id={`${formId}-firstName`}
              type="text"
              autoComplete="given-name"
              placeholder={fields.firstName.placeholder}
              value={values.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              aria-invalid={Boolean(errors.firstName)}
              className={`${controlClass} ${errors.firstName ? errorControlClass : ""}`}
            />
            <FieldError id={`${formId}-firstName-error`} message={errors.firstName} />
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-lastName`}>
              {fields.lastName.label} *
            </label>
            <input
              id={`${formId}-lastName`}
              type="text"
              autoComplete="family-name"
              placeholder={fields.lastName.placeholder}
              value={values.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              aria-invalid={Boolean(errors.lastName)}
              className={`${controlClass} ${errors.lastName ? errorControlClass : ""}`}
            />
            <FieldError id={`${formId}-lastName-error`} message={errors.lastName} />
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-email`}>
              {fields.email.label} *
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              placeholder={fields.email.placeholder}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              className={`${controlClass} ${errors.email ? errorControlClass : ""}`}
            />
            <FieldError id={`${formId}-email-error`} message={errors.email} />
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-mobilePhone`}>
              {fields.mobilePhone.label} *
            </label>
            <input
              id={`${formId}-mobilePhone`}
              type="tel"
              autoComplete="tel"
              placeholder={fields.mobilePhone.placeholder}
              value={values.mobilePhone}
              onChange={(e) => setField("mobilePhone", e.target.value)}
              aria-invalid={Boolean(errors.mobilePhone)}
              className={`${controlClass} ${errors.mobilePhone ? errorControlClass : ""}`}
            />
            <FieldError id={`${formId}-mobilePhone-error`} message={errors.mobilePhone} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor={`${formId}-organization`}>
              {fields.organization.label} *
            </label>
            <input
              id={`${formId}-organization`}
              type="text"
              autoComplete="organization"
              placeholder={fields.organization.placeholder}
              value={values.organization}
              onChange={(e) => setField("organization", e.target.value)}
              aria-invalid={Boolean(errors.organization)}
              className={`${controlClass} ${errors.organization ? errorControlClass : ""}`}
            />
            <FieldError
              id={`${formId}-organization-error`}
              message={errors.organization}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-country`}>
              {fields.country.label} *
            </label>
            <select
              id={`${formId}-country`}
              value={values.country}
              onChange={(e) => setField("country", e.target.value)}
              aria-invalid={Boolean(errors.country)}
              className={`${controlClass} ${errors.country ? errorControlClass : ""}`}
            >
              <option value="">{fields.country.placeholder}</option>
              {content.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <FieldError id={`${formId}-country-error`} message={errors.country} />
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-citizenship`}>
              {fields.citizenship.label} *
            </label>
            <input
              id={`${formId}-citizenship`}
              type="text"
              placeholder={fields.citizenship.placeholder}
              value={values.citizenship}
              onChange={(e) => setField("citizenship", e.target.value)}
              aria-invalid={Boolean(errors.citizenship)}
              className={`${controlClass} ${errors.citizenship ? errorControlClass : ""}`}
            />
            <FieldError
              id={`${formId}-citizenship-error`}
              message={errors.citizenship}
            />
          </div>
        </div>
      </fieldset>

      {/* ---------------------------------------------- Paper details */}
      {needsPaper ? (
        <fieldset className="mt-8 border-t border-slate-200 pt-6">
          <legend className={sectionTitleClass}>{sections.paper}</legend>
          <p className="mt-3 text-sm text-slate-500">{content.paperNote}</p>

          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor={`${formId}-paperId`}>
                {fields.paperId.label} *
              </label>
              <input
                id={`${formId}-paperId`}
                type="text"
                inputMode="numeric"
                placeholder={fields.paperId.placeholder}
                value={values.paperId}
                onChange={(e) => setField("paperId", e.target.value)}
                aria-invalid={Boolean(errors.paperId)}
                className={`${controlClass} ${errors.paperId ? errorControlClass : ""}`}
              />
              <FieldError id={`${formId}-paperId-error`} message={errors.paperId} />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor={`${formId}-paperTitle`}>
                {fields.paperTitle.label} *
              </label>
              <input
                id={`${formId}-paperTitle`}
                type="text"
                placeholder={fields.paperTitle.placeholder}
                value={values.paperTitle}
                onChange={(e) => setField("paperTitle", e.target.value)}
                aria-invalid={Boolean(errors.paperTitle)}
                className={`${controlClass} ${errors.paperTitle ? errorControlClass : ""}`}
              />
              <FieldError
                id={`${formId}-paperTitle-error`}
                message={errors.paperTitle}
              />
            </div>
          </div>
        </fieldset>
      ) : null}

      {/* ---------------------------------------------- Attendance */}
      <fieldset className="mt-8 border-t border-slate-200 pt-6">
        <legend className={sectionTitleClass}>{sections.attendance}</legend>

        <div className="mt-4">
          <span className={labelClass}>{content.dinner.label} *</span>
          <div className="mt-2 flex gap-5">
            {(["yes", "no"] as const).map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 text-base text-slate-700"
              >
                <input
                  type="radio"
                  name={`${formId}-dinner`}
                  value={option}
                  checked={values.attendingDinner === option}
                  onChange={() => setField("attendingDinner", option)}
                  className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500/40"
                />
                {option === "yes" ? content.dinner.yes : content.dinner.no}
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-500">{content.dinner.note}</p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor={`${formId}-dietaryRequirement`}>
              {dietary.label}
            </label>
            <select
              id={`${formId}-dietaryRequirement`}
              value={values.dietaryRequirement}
              onChange={(e) => setField("dietaryRequirement", e.target.value)}
              className={controlClass}
            >
              {dietary.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-dietaryComments`}>
              {fields.dietaryComments.label}
            </label>
            <input
              id={`${formId}-dietaryComments`}
              type="text"
              placeholder={fields.dietaryComments.placeholder}
              value={values.dietaryComments}
              onChange={(e) => setField("dietaryComments", e.target.value)}
              className={controlClass}
            />
          </div>
        </div>
      </fieldset>

      {/* ---------------------------------------------- Consent */}
      <fieldset className="mt-8 border-t border-slate-200 pt-6">
        <legend className={sectionTitleClass}>{sections.consent}</legend>

        <div className="mt-4 space-y-3.5">
          {(
            [
              ["consentPhotos", consents.photos],
              ["consentFutureInvite", consents.futureInvite],
              ["consentRelatedEvents", consents.relatedEvents],
            ] as const
          ).map(([key, text]) => (
            <label
              key={key}
              className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-slate-700"
            >
              <input
                type="checkbox"
                checked={values[key]}
                onChange={(e) => setField(key, e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-500/40"
              />
              <span>{text}</span>
            </label>
          ))}

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5">
            <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-slate-700">
              <input
                id={`${formId}-consentTerms`}
                type="checkbox"
                checked={values.consentTerms}
                onChange={(e) => setField("consentTerms", e.target.checked)}
                aria-invalid={Boolean(errors.consentTerms)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-500/40"
              />
              <span>
                {consents.terms} <span className="text-rose-600">*</span>
              </span>
            </label>
            <FieldError
              id={`${formId}-consentTerms-error`}
              message={errors.consentTerms}
            />
          </div>
        </div>
      </fieldset>

      {/* ---------------------------------------------- Submit */}
      {submitError ? (
        <div
          role="alert"
          className="mt-8 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <p className="font-medium text-rose-900">{submit.errorTitle}</p>
            <p className="mt-1 text-sm text-rose-700">{submitError}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:ring-2 focus:ring-primary-500/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {submit.pending}
            </>
          ) : (
            submit.idle
          )}
        </button>
        <p className="text-sm text-slate-500">
          {submit.helpPrefix}{" "}
          <a
            href={`mailto:${siteConfig.conference.email}`}
            className="font-medium text-primary-600 underline-offset-2 hover:underline"
          >
            {siteConfig.conference.email}
          </a>
        </p>
      </div>
    </form>
  )
}
