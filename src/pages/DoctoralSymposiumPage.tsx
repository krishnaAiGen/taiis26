import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { CalendarDays, ExternalLink, Send } from "lucide-react"
import { RegistrationFeeTable } from "../components/RegistrationFeeTable"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-base leading-relaxed text-slate-600"
        >
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function SectionBlock({
  title,
  children,
  icon,
}: {
  title: string
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 font-serif text-2xl text-primary-950 sm:text-[1.65rem]">
        {icon}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function DoctoralSymposiumPage() {
  const { doctoralSymposium, paperSubmission, paperRegistration } = siteConfig
  const doctoralFeeSection = paperRegistration.feeSections.find((section) =>
    section.heading.includes("Doctoral Symposium"),
  )

  return (
    <>
      <Breadcrumbs current={doctoralSymposium.title} />
      <PageHeader
        title={doctoralSymposium.title}
        subtitle={doctoralSymposium.pageTitle}
      />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="space-y-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="space-y-4">
                {doctoralSymposium.intro.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-lg leading-relaxed text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <SectionBlock title={doctoralSymposium.objectivesTitle}>
                <p className="text-slate-600">{doctoralSymposium.objectivesIntro}</p>
                <BulletList items={doctoralSymposium.objectives} />
              </SectionBlock>

              <SectionBlock title={doctoralSymposium.topicsTitle}>
                <p className="text-slate-600">{doctoralSymposium.topicsIntro}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {doctoralSymposium.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </SectionBlock>

              <SectionBlock title={doctoralSymposium.submissionCategoriesTitle}>
                <div className="space-y-6">
                  {doctoralSymposium.submissionCategories.map((category) => (
                    <div
                      key={category.title}
                      className="rounded-xl border border-slate-200 bg-slate-50/50 p-5"
                    >
                      <h3 className="font-semibold text-primary-900">{category.title}</h3>
                      <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {category.paragraphs.map((p) => (
                          <p key={p.slice(0, 48)}>{p}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock title={doctoralSymposium.submissionRequirementsTitle}>
                <p className="text-slate-600">
                  {doctoralSymposium.submissionRequirementsIntro}
                </p>
                <BulletList items={doctoralSymposium.submissionRequirements} />
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {doctoralSymposium.submissionRequirementsNote}
                </p>
              </SectionBlock>

              <SectionBlock title={doctoralSymposium.reviewTitle}>
                <p className="text-slate-600">{doctoralSymposium.reviewIntro}</p>
                <BulletList items={doctoralSymposium.reviewCriteria} />
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {doctoralSymposium.reviewNote}
                </p>
              </SectionBlock>

              <SectionBlock title={doctoralSymposium.presentationTitle}>
                <p className="text-slate-600">{doctoralSymposium.presentationIntro}</p>
                <BulletList items={doctoralSymposium.presentationItems} />
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {doctoralSymposium.presentationNote}
                </p>
              </SectionBlock>

              <SectionBlock title={doctoralSymposium.publicationTitle}>
                <div className="space-y-3 text-base leading-relaxed text-slate-600">
                  {doctoralSymposium.publicationParagraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock title={doctoralSymposium.awardsTitle}>
                <p className="text-slate-600">{doctoralSymposium.awardsIntro}</p>
                <BulletList items={doctoralSymposium.awards} />
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {doctoralSymposium.awardsNote}
                </p>
              </SectionBlock>

              {doctoralFeeSection ? (
                <SectionBlock title={doctoralSymposium.registrationTitle}>
                  <p className="text-base leading-relaxed text-slate-600">
                    {doctoralSymposium.registrationIntro}
                  </p>
                  <div className="mt-4">
                    <RegistrationFeeTable
                      categories={doctoralFeeSection.categories}
                      earlyBirdHeader={paperRegistration.earlyBirdHeader}
                      lateHeader={paperRegistration.lateHeader}
                    />
                  </div>
                  <h3 className="mt-8 font-serif text-lg text-primary-950 sm:text-xl">
                    {doctoralSymposium.registrationGuidelinesTitle}
                  </h3>
                  <div className="mt-3 space-y-4 text-base leading-relaxed text-slate-600">
                    {paperRegistration.doctoralGuidelines.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                  </div>
                  <Link
                    to="/paper-registration"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-800"
                  >
                    {doctoralSymposium.registrationFullFeesLabel}
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </Link>
                </SectionBlock>
              ) : null}

              <SectionBlock
                title={doctoralSymposium.importantDatesTitle}
                icon={<CalendarDays className="h-6 w-6 text-primary-500" />}
              >
                <ul className="overflow-hidden rounded-xl border border-slate-200">
                  {doctoralSymposium.importantDates.map((row, i) => (
                    <li
                      key={row.label}
                      className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm ${
                        row.highlight
                          ? "bg-primary-50 font-medium text-primary-900"
                          : i % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50"
                      }`}
                    >
                      <span className="text-slate-800">{row.label}</span>
                      <span className={row.highlight ? "text-primary-800" : "text-slate-600"}>
                        {row.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionBlock>

              <SectionBlock
                title={doctoralSymposium.submissionProcedureTitle}
                icon={<Send className="h-6 w-6 text-primary-500" />}
              >
                <div className="space-y-3 text-base leading-relaxed text-slate-600">
                  {doctoralSymposium.submissionProcedure.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-600">{doctoralSymposium.cmtTrackNote}</p>
                <a
                  href={paperSubmission.cmtUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-400 via-accent-500 to-lime-400 px-6 py-3 text-sm font-semibold text-primary-950 shadow-lg shadow-accent-500/30 transition-all hover:brightness-110 hover:shadow-accent-400/40"
                >
                  {doctoralSymposium.submitButtonLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </SectionBlock>

              <p className="border-t border-slate-100 pt-8 text-lg leading-relaxed text-slate-600">
                {doctoralSymposium.closing}
              </p>
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
