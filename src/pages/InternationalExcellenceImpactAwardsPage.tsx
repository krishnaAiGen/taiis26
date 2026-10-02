import type { ReactNode } from "react"
import { Award, CalendarDays, ExternalLink, Mail } from "lucide-react"
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
  id,
  title,
  children,
  icon,
}: {
  id?: string
  title: string
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-center gap-2 font-serif text-2xl text-primary-950 sm:text-[1.65rem]">
        {icon}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function InternationalExcellenceImpactAwardsPage() {
  const { internationalExcellenceImpactAwards, conference, awardsNav } =
    siteConfig
  const content = internationalExcellenceImpactAwards

  return (
    <>
      <Breadcrumbs
        current={content.title}
        parent={{
          label: awardsNav.title,
          path: "/awards/international-excellence-and-impact-awards",
        }}
      />
      <PageHeader title={content.title} subtitle={content.subtitle} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="space-y-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="rounded-xl border border-accent-200 bg-gradient-to-r from-accent-50 to-primary-50 px-5 py-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-800">
                  {content.callForNominations}
                </p>
              </div>

              <div className="space-y-4">
                {content.intro.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-lg leading-relaxed text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {content.actionLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={"external" in link && link.external ? "_blank" : undefined}
                    rel={
                      "external" in link && link.external
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-900 transition-colors hover:bg-primary-100"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <SectionBlock
                title={content.importantDatesTitle}
                icon={<CalendarDays className="h-6 w-6 text-primary-500" />}
              >
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-primary-950">
                          Activity
                        </th>
                        <th className="px-4 py-3 font-semibold text-primary-950">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {content.importantDates.map((row) => (
                        <tr key={row.activity}>
                          <td className="px-4 py-3 text-slate-700">
                            {row.activity}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {row.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  {content.importantDatesNote}
                </p>
              </SectionBlock>

              <SectionBlock
                id="award-categories"
                title={content.awardCategoriesTitle}
                icon={<Award className="h-6 w-6 text-primary-500" />}
              >
                <div className="space-y-8">
                  {content.awardCategoryGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="font-serif text-lg text-primary-900">
                        {group.title}
                      </h3>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-slate-600">
                  {content.awardCategoriesNote}
                </p>
              </SectionBlock>

              <SectionBlock title={content.whoCanBeNominatedTitle}>
                <p className="text-slate-600">{content.whoCanBeNominatedIntro}</p>
                <BulletList items={content.whoCanBeNominated} />
                <p className="mt-4 text-slate-600">{content.whoCanBeNominatedNote}</p>
              </SectionBlock>

              <SectionBlock title={content.whoCanSubmitTitle}>
                <p className="text-slate-600">{content.whoCanSubmitIntro}</p>
                <BulletList items={content.whoCanSubmit} />
                <p className="mt-4 text-slate-600">{content.whoCanSubmitNote}</p>
              </SectionBlock>

              <SectionBlock
                id="nomination-requirements"
                title={content.nominationRequirementsTitle}
              >
                <p className="text-slate-600">{content.nominationRequirementsIntro}</p>
                <BulletList items={content.nominationRequirements} />
                <p className="mt-4 text-sm text-slate-600">
                  {content.nominationRequirementsNote}
                </p>
              </SectionBlock>

              <SectionBlock title={content.youngResearchersTitle}>
                {content.youngResearchersParagraphs.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="mt-3 text-slate-600 first:mt-0"
                  >
                    {p}
                  </p>
                ))}
              </SectionBlock>

              <SectionBlock id="nomination-form" title={content.howToSubmitTitle}>
                <ol className="space-y-5">
                  {content.howToSubmitSteps.map((step) => (
                    <li key={step.title} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                      <p className="font-semibold text-primary-950">{step.title}</p>
                      <p className="mt-2 text-slate-600">{step.description}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={content.nominationFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-400 via-accent-500 to-lime-400 px-6 py-3 text-sm font-semibold text-primary-950 shadow-md shadow-accent-500/25 transition-all hover:brightness-110"
                  >
                    {content.submitNominationButtonLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-4 text-sm text-slate-600">{content.nominationFormNote}</p>
              </SectionBlock>

              <SectionBlock title={content.evaluationProcessTitle}>
                <ol className="space-y-4">
                  {content.evaluationProcess.map((stage) => (
                    <li key={stage.title}>
                      <p className="font-semibold text-primary-950">{stage.title}</p>
                      <p className="mt-1 text-slate-600">{stage.description}</p>
                    </li>
                  ))}
                </ol>
              </SectionBlock>

              <SectionBlock title={content.evaluationCriteriaTitle}>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-primary-950">
                          Criterion
                        </th>
                        <th className="px-4 py-3 font-semibold text-primary-950">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {content.evaluationCriteria.map((row) => (
                        <tr key={row.criterion}>
                          <td className="px-4 py-3 text-slate-700">
                            {row.criterion}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {row.weight}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  {content.evaluationCriteriaNotes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock title={content.integrityTitle}>
                <BulletList items={content.integrityItems} />
              </SectionBlock>

              <SectionBlock title={content.recognitionTitle}>
                <p className="text-slate-600">{content.recognitionIntro}</p>
                <BulletList items={content.recognitionItems} />
              </SectionBlock>

              <SectionBlock title={content.conferencePaperAwardsTitle}>
                <p className="text-slate-600">{content.conferencePaperAwardsIntro}</p>
                <BulletList items={content.conferencePaperAwards} />
                <p className="mt-4 text-slate-600">{content.conferencePaperAwardsNote}</p>
              </SectionBlock>

              <SectionBlock title={content.downloadsTitle}>
                <ul className="space-y-3">
                  {content.downloads.map((item) => (
                    <li
                      key={item.label}
                      className="rounded-lg border border-slate-100 px-4 py-3"
                    >
                      <p className="font-medium text-primary-950">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-slate-600">
                  Conference website:{" "}
                  <a
                    href="https://cyber-conf.com/taiis2026/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-900"
                  >
                    https://cyber-conf.com/taiis2026/
                  </a>
                </p>
              </SectionBlock>

              <SectionBlock title={content.faqTitle}>
                <dl className="space-y-6">
                  {content.faq.map((item) => (
                    <div key={item.question}>
                      <dt className="font-semibold text-primary-950">
                        {item.question}
                      </dt>
                      <dd className="mt-2 text-slate-600">{item.answer}</dd>
                    </div>
                  ))}
                </dl>
              </SectionBlock>

              <SectionBlock title={content.contactTitle}>
                <p className="text-slate-600">{content.contactIntro}</p>
                <a
                  href={`mailto:${conference.email}?subject=${encodeURIComponent(content.contactEmailSubject)}`}
                  className="mt-4 inline-flex items-center gap-2 font-medium text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-900"
                >
                  <Mail className="h-4 w-4" />
                  {conference.email}
                </a>
              </SectionBlock>

              <SectionBlock title={content.disclaimerTitle}>
                <p className="text-sm leading-relaxed text-slate-600">
                  {content.disclaimer}
                </p>
              </SectionBlock>
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
