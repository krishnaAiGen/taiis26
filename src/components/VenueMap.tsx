import { ExternalLink, MapPin } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

export function VenueMap({ className = "" }: { className?: string }) {
  const { map } = siteConfig.venue

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
        <iframe
          title={map.embedTitle}
          src={map.embedUrl}
          className="aspect-video w-full min-h-[240px] border-0 sm:min-h-[280px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-2 text-sm">
        <p className="flex items-start gap-2 text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
          <span>{map.address}</span>
        </p>
        <a
          href={map.openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-primary-600 transition-colors hover:text-accent-600"
        >
          Open in Google Maps
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
