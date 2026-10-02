import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"

export function QualityPoliciesPage() {
  const { qualityPolicies } = siteConfig

  return (
    <>
      <Breadcrumbs current={qualityPolicies.title} />
      <PageHeader title={qualityPolicies.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="space-y-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <p className="text-lg leading-relaxed text-slate-600">
                {qualityPolicies.intro}
              </p>

              {qualityPolicies.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-serif text-2xl text-primary-950 sm:text-[1.65rem]">
                    {section.title}
                  </h2>
                  {"intro" in section && section.intro ? (
                    <p className="mt-4 text-slate-600">{section.intro}</p>
                  ) : null}
                  {"items" in section && section.items ? (
                    <ul className="mt-4 space-y-2.5">
                      {section.items.map((item) => (
                        <li
                          key={item.slice(0, 48)}
                          className="flex items-start gap-3 text-base leading-relaxed text-slate-600"
                        >
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {"paragraphs" in section && section.paragraphs ? (
                    <div className="mt-4 space-y-3">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 48)}
                          className="text-base leading-relaxed text-slate-600"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
