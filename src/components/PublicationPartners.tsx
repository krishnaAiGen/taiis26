import { MotionSection } from "./MotionSection"
import { SectionHeading } from "./SectionHeading"
import { siteConfig } from "../config/siteConfig"
import { SiteImage } from "./SiteImage"
import { MarqueeCardStrip } from "./MarqueeCardStrip"

interface PublicationPartnersProps {
  className?: string
}

function PartnerCard({
  name,
  logo,
  alt,
}: {
  name: string
  logo: string
  alt: string
}) {
  return (
    <div className="flex h-[140px] w-[280px] shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-primary-50 px-6 py-8 shadow-sm transition-shadow hover:border-accent-300/50 hover:shadow-lg hover:shadow-accent-500/10">
      <SiteImage
        src={logo}
        alt={alt}
        className="max-h-24 w-full max-w-[220px] object-contain"
      />
      <span className="sr-only">{name}</span>
    </div>
  )
}

export function PublicationPartners({ className = "" }: PublicationPartnersProps) {
  const { publicationPartners } = siteConfig
  const { partners, slider } = publicationPartners
  const marqueeDuration = slider?.marqueeDurationSec ?? 28
  const intervalMs = slider?.intervalMs ?? 4500

  return (
    <MotionSection className={className}>
      <SectionHeading>{publicationPartners.title}</SectionHeading>

      <MarqueeCardStrip
        count={partners.length}
        getItemKey={(i) => partners[i].name}
        renderCard={(i) => (
          <PartnerCard
            name={partners[i].name}
            logo={partners[i].logo}
            alt={partners[i].alt}
          />
        )}
        intervalMs={intervalMs}
        marqueeDurationSec={marqueeDuration}
      />
    </MotionSection>
  )
}
