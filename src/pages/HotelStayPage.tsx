import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { SiteImage } from "../components/SiteImage"
import { siteConfig } from "../config/siteConfig"

export function HotelStayPage() {
  const { hotelStay } = siteConfig

  return (
    <>
      <Breadcrumbs current={hotelStay.title} />
      <PageHeader title={hotelStay.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {hotelStay.hotels.map((hotel, index) => (
                <article key={hotel.id} className="flex flex-col">
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${hotel.name} — official website`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <SiteImage
                        src={hotel.image}
                        alt={hotel.imageAlt}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading={index < 3 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </a>
                  <h2 className="mt-4 text-center font-serif text-lg font-semibold text-primary-950 sm:text-xl">
                    {hotel.name}
                  </h2>
                </article>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
