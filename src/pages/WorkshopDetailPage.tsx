import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { ProgramEventSections } from "../components/ProgramEventSections"
import { siteConfig } from "../config/siteConfig"
import { findWorkshopBySlug } from "../utils/workshops"

export function WorkshopDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const workshop = findWorkshopBySlug(slug)
  const { workshops } = siteConfig

  if (!workshop) {
    return <Navigate to="/workshops" replace />
  }

  const chairs = "chairs" in workshop ? workshop.chairs : undefined
  const { submission: submissionCopy } = workshops
  const submissionIntro = submissionCopy.workshopIntro
    .replace("{code}", workshop.code)
    .replace("{title}", workshop.title)

  return (
    <>
      <Breadcrumbs
        current={workshop.code}
        parent={{ label: workshops.title, path: "/workshops" }}
      />
      <PageHeader title={workshop.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <Link
              to="/workshops"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-800"
            >
              <ArrowLeft className="h-4 w-4" />
              All workshops
            </Link>
            <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                {workshop.code}
              </p>
              <h2 className="mt-2 font-serif text-xl leading-snug text-primary-950 sm:text-2xl">
                {workshop.title}
              </h2>
              <ProgramEventSections
                aimAndScope={workshop.aimAndScope}
                topics={workshop.topics}
                sectionTitles={workshops.sectionTitles}
                committeesNote={workshops.committeesNote}
                submissionDates={workshops.submissionDates}
                chairs={chairs}
                submissionIntro={submissionIntro}
                submissionCmtUrl={siteConfig.paperSubmission.cmtUrl}
                submissionButtonLabel={submissionCopy.submitButtonLabel}
              />
            </article>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
