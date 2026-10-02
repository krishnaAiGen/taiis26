import { motion } from "framer-motion"
import { Building2, MapPin } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { SectionHeading } from "../components/SectionHeading"
import { SiteImage } from "../components/SiteImage"
import { VenueMap } from "../components/VenueMap"
import { siteConfig } from "../config/siteConfig"

export function VenuePage() {
  const { venue } = siteConfig
  const headerSlides = venue.gallery.map((photo) => ({
    src: photo.image,
    alt: photo.alt,
  }))

  return (
    <>
      <Breadcrumbs current={venue.title} />
      <PageHeader
        title={venue.title}
        subtitle={venue.subtitle}
        backgroundSlides={headerSlides}
        slideIntervalMs={6000}
      />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <motion.div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
              <div className="bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 px-8 py-10 text-white">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-accent-400" />
                  <h2 className="font-serif text-2xl sm:text-3xl">{venue.name}</h2>
                </div>
              </div>
              <div className="grid gap-8 p-8 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-500" />
                    <div className="space-y-3 text-lg leading-relaxed">
                      <p>{venue.note}</p>
                      <p className="text-base text-slate-500">{venue.map.address}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <VenueMap />
                </div>
              </div>
            </motion.div>
          </MotionSection>

          <MotionSection className="mt-14">
            <SectionHeading>{venue.galleryTitle}</SectionHeading>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {venue.gallery.map((photo) => (
                <figure
                  key={photo.image}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <SiteImage
                    src={photo.image}
                    alt={photo.alt}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
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
