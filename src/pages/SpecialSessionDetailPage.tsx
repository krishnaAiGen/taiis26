import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { ProgramEventSections } from "../components/ProgramEventSections"
import { siteConfig } from "../config/siteConfig"
import { findSpecialSessionBySlug } from "../utils/specialSessions"

export function SpecialSessionDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const session = findSpecialSessionBySlug(slug)
  const { specialSessions } = siteConfig

  if (!session) {
    return <Navigate to="/special-sessions" replace />
  }

  const chairs = "chairs" in session ? session.chairs : undefined
  const { submission: submissionCopy } = specialSessions
  const submissionIntro = submissionCopy.specialSessionIntro
    .replace("{code}", session.code)
    .replace("{title}", session.title)

  return (
    <>
      <Breadcrumbs
        current={session.code}
        parent={{ label: specialSessions.title, path: "/special-sessions" }}
      />
      <PageHeader title={session.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <Link
              to="/special-sessions"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-800"
            >
              <ArrowLeft className="h-4 w-4" />
              All special sessions
            </Link>
            <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                {session.code}
              </p>
              <h2 className="mt-2 font-serif text-xl leading-snug text-primary-950 sm:text-2xl">
                {session.title}
              </h2>
              <ProgramEventSections
                aimAndScope={session.aimAndScope}
                topics={session.topics}
                sectionTitles={specialSessions.sectionTitles}
                committeesNote={specialSessions.committeesNote}
                submissionDates={specialSessions.submissionDates}
                focus={"focus" in session ? session.focus : undefined}
                focusLabel={specialSessions.focusLabel}
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
