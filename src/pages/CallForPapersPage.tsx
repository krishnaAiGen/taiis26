import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { ConferenceTracks } from "../components/ConferenceTracks"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"

export function CallForPapersPage() {
  const { callForPapers } = siteConfig

  return (
    <>
      <Breadcrumbs current={callForPapers.title} />
      <PageHeader title={callForPapers.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
              {callForPapers.intro}
            </p>
            <h2 className="mt-12 font-serif text-2xl text-primary-950 sm:text-3xl">
              {callForPapers.topicsTitle}
            </h2>
            <div className="mt-8">
              <ConferenceTracks />
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
