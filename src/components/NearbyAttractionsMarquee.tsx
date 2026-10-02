import { siteConfig } from "../config/siteConfig"
import { SiteImage } from "./SiteImage"
import { MarqueeCardStrip } from "./MarqueeCardStrip"

function AttractionPhotoCard({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="flex h-[280px] w-[520px] shrink-0 items-center justify-center sm:h-[300px] sm:w-[560px]">
      <SiteImage
        src={image}
        alt={alt}
        className="max-h-[280px] w-full max-w-[520px] object-contain sm:max-h-[300px] sm:max-w-[560px]"
      />
    </div>
  )
}

export function NearbyAttractionsMarquee() {
  const { photos, slider } = siteConfig.nearbyAttractions
  const intervalMs = slider?.intervalMs ?? 9000
  const marqueeDurationSec = slider?.marqueeDurationSec ?? 180

  return (
    <MarqueeCardStrip
      count={photos.length}
      getItemKey={(i) => photos[i].image}
      renderCard={(i) => (
        <AttractionPhotoCard image={photos[i].image} alt={photos[i].alt} />
      )}
      intervalMs={intervalMs}
      marqueeDurationSec={marqueeDurationSec}
      edgeFadeClassName="from-white via-white/80"
    />
  )
}
