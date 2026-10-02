import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { PublicationNoticeCard } from "../components/PublicationNotice"
import { PublicationPartners } from "../components/PublicationPartners"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"

export function PublicationIndexingPage() {
  const { publicationIndexing } = siteConfig

  return (
    <>
      <Breadcrumbs current={publicationIndexing.title} />
      <PageHeader title={publicationIndexing.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection className="mx-auto max-w-3xl">
            <PublicationNoticeCard />
          </MotionSection>
          <div className="mt-12">
            <PublicationPartners />
          </div>
        </div>
      </section>
    </>
  )
}
