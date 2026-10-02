import { ExternalLink, Globe } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"

export function VisaInformationPage() {
  const { visaInformation } = siteConfig

  return (
    <>
      <Breadcrumbs current={visaInformation.title} />
      <PageHeader title={visaInformation.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="space-y-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="space-y-4">
                {visaInformation.intro.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-lg leading-relaxed text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <section>
                <h2 className="flex items-center gap-2 font-serif text-2xl text-primary-950 sm:text-[1.65rem]">
                  <Globe className="h-6 w-6 text-primary-500" />
                  {visaInformation.officialResourcesTitle}
                </h2>
                <ul className="mt-4 space-y-2">
                  {visaInformation.officialResources.map((resource) => (
                    <li key={resource.label}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary-700 underline decoration-primary-300 underline-offset-2 transition-colors hover:text-primary-900"
                      >
                        {resource.label}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
