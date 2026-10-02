import { ExternalLink } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { SiteImage } from "../components/SiteImage"
import { siteConfig } from "../config/siteConfig"

export function JournalPublicationOpportunitiesPage() {
  const { journalPublicationOpportunities } = siteConfig

  return (
    <>
      <Breadcrumbs current={journalPublicationOpportunities.title} />
      <PageHeader title={journalPublicationOpportunities.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              {journalPublicationOpportunities.introParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-relaxed text-slate-600 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </MotionSection>

          <MotionSection className="mt-12" delay={0.05}>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {journalPublicationOpportunities.journals.map((journal, index) => (
                <li key={journal.name}>
                  <a
                    href={journal.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50/40 p-4">
                      <SiteImage
                        src={journal.cover}
                        alt={journal.coverAlt}
                        className="h-52 w-full max-w-[11rem] rounded-lg border border-slate-200/80 bg-white object-contain shadow-sm transition-transform group-hover:scale-[1.02]"
                        loading={index < 4 ? "eager" : "lazy"}
                        sizes="176px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-lg leading-snug text-primary-950 group-hover:text-primary-700">
                        {journal.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">{journal.publisher}</p>
                      {"indexing" in journal && journal.indexing ? (
                        <p className="mt-2 text-sm leading-snug text-slate-600">
                          {journal.indexing}
                        </p>
                      ) : null}
                      {"impactFactor" in journal && journal.impactFactor ? (
                        <p className="mt-1 text-sm leading-snug text-slate-600">
                          IF: {journal.impactFactor}
                        </p>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                        Visit journal homepage
                        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
