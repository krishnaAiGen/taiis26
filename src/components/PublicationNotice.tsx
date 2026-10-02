import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

export function PublicationNotice() {
  const { publicationPreview } = siteConfig.home

  return (
    <p className="text-base leading-relaxed text-yellow-800 sm:text-lg">
      {publicationPreview.noticeBeforeLink}
      <a
        href={publicationPreview.springerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-yellow-900 underline decoration-yellow-600 underline-offset-2 transition-colors hover:text-yellow-950"
      >
        {publicationPreview.springerUrl}
      </a>
      {publicationPreview.noticeAfterLink}
    </p>
  )
}

export function PublicationNoticeCard({
  showReadMore = false,
}: {
  showReadMore?: boolean
}) {
  const { publicationPreview } = siteConfig.home

  return (
    <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-6 sm:p-8">
      <PublicationNotice />
      {showReadMore && (
        <Link
          to={publicationPreview.readMorePath}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-900 transition-colors hover:text-yellow-950"
        >
          {publicationPreview.readMoreLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
