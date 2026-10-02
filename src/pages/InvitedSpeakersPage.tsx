import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { SiteImage } from "../components/SiteImage"
import { siteConfig } from "../config/siteConfig"

export function InvitedSpeakersPage() {
  const { invitedSpeakers } = siteConfig

  return (
    <>
      <Breadcrumbs current={invitedSpeakers.title} />
      <PageHeader title={invitedSpeakers.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {invitedSpeakers.speakers.map((speaker, index) => (
              <MotionSection key={speaker.name} delay={index * 0.05}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <SiteImage
                      src={speaker.photo}
                      alt={speaker.photoAlt}
                      className="h-28 w-24 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover object-top sm:h-32 sm:w-28"
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="112px"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-serif text-xl text-primary-950 sm:text-2xl">
                        {speaker.name}
                      </h2>
                      {speaker.distinction ? (
                        <p className="mt-1 text-sm font-semibold text-primary-700">
                          {speaker.distinction}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {speaker.affiliation}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                    {speaker.bio.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="text-base leading-relaxed text-slate-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
