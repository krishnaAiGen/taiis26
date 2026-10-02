import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { SiteImage } from "../components/SiteImage"
import { siteConfig } from "../config/siteConfig"

export function NearbyAttractionsPage() {
  const { nearbyAttractions } = siteConfig

  return (
    <>
      <Breadcrumbs current={nearbyAttractions.title} />
      <PageHeader title={nearbyAttractions.title} />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {nearbyAttractions.photos.map((photo, i) => (
                <figure
                  key={photo.image}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm"
                >
                  <SiteImage
                    src={photo.image}
                    alt={photo.alt}
                    className={`h-28 w-full sm:h-32 md:h-36 ${
                      photo.fit === "contain"
                        ? "bg-slate-200 object-contain"
                        : "object-cover"
                    }`}
                    loading={i < 6 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </figure>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
