import { ExternalLink, FileDown, FileText } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"
import { assetUrl } from "../utils/assetUrl"

function TextWithCmtLink({ text }: { text: string }) {
  const { cmtUrl, cmtLinkText } = siteConfig.paperSubmission
  const parts = text.split(cmtLinkText)

  if (parts.length === 1) {
    return <>{text}</>
  }

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a
              href={cmtUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-600 underline decoration-primary-300 underline-offset-2 transition-colors hover:text-primary-700"
            >
              {cmtLinkText}
            </a>
          )}
        </span>
      ))}
    </>
  )
}

export function PaperSubmissionPage() {
  const { paperSubmission } = siteConfig

  return (
    <>
      <Breadcrumbs current={paperSubmission.title} />
      <PageHeader title={paperSubmission.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="mb-8 rounded-2xl border border-accent-300/40 bg-gradient-to-r from-primary-50 to-accent-400/10 px-6 py-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">
                Page limit
              </p>
              <p className="mt-1 font-serif text-2xl text-primary-950">
                Maximum {paperSubmission.pageLimit} pages
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {paperSubmission.pageLimitNote}
              </p>
            </div>

            <div className="space-y-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div>
                <h2 className="font-serif text-2xl text-primary-950">
                  {paperSubmission.guidelinesTitle}
                </h2>
                <ul className="mt-4 space-y-3">
                  {paperSubmission.guidelines.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-lg leading-relaxed text-slate-600"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-primary-950">
                  {paperSubmission.templatesTitle}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-slate-600">
                  {paperSubmission.templatesIntro}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {paperSubmission.templates.map((template) => {
                    const isFile = "file" in template && template.file
                    const href = isFile
                      ? assetUrl(template.file)
                      : template.url
                    return (
                      <a
                        key={template.name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:border-primary-200 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white">
                          {isFile ? (
                            <FileDown className="h-5 w-5" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <h3 className="mt-4 font-semibold text-slate-900">
                          {template.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                          {template.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                          {template.linkLabel}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-primary-950">
                  {paperSubmission.methodTitle}
                </h2>
                <div className="mt-4 space-y-5">
                  <p className="text-lg leading-relaxed text-slate-600">
                    <TextWithCmtLink text={paperSubmission.methodIntro} />
                  </p>
                  <p className="text-lg leading-relaxed text-slate-600">
                    <TextWithCmtLink text={paperSubmission.cmtAcknowledgment} />
                  </p>
                </div>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
