import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Camera } from "lucide-react"
import { MotionSection } from "./MotionSection"
import { siteConfig } from "../config/siteConfig"
import { SiteImage } from "./SiteImage"
import { assetUrl } from "../utils/assetUrl"

export function TaichungShowcase() {
  const { taichungShowcase } = siteConfig.home
  const [featured, ...rest] = taichungShowcase.places

  return (
    <section className="relative overflow-hidden bg-primary-950 py-20 text-white sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("${assetUrl(taichungShowcase.textureImage)}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-950/40 via-primary-950/90 to-primary-950" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionSection>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
                <Camera className="h-4 w-4" />
                {taichungShowcase.eyebrow}
              </p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl"
              >
                <span className="bg-gradient-to-r from-white via-accent-300 to-bloom-300 bg-clip-text text-transparent">
                  {taichungShowcase.title}
                </span>
              </motion.h2>
              <p className="mt-4 text-base leading-relaxed text-primary-100 sm:text-lg">
                {taichungShowcase.subtitle}
              </p>
            </div>
            <Link
              to={taichungShowcase.ctaPath}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:border-accent-400/50 hover:bg-white/15"
            >
              {taichungShowcase.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-4 lg:gap-5">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="group relative min-h-[280px] overflow-hidden rounded-3xl border border-white/10 sm:col-span-2 lg:col-span-7 lg:row-span-4 lg:min-h-[520px]"
            >
              <SiteImage
                src={featured.image}
                alt={featured.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <h3 className="font-serif text-2xl sm:text-3xl">{featured.name}</h3>
                <p className="mt-2 max-w-xl text-sm text-primary-100 sm:text-base">
                  {featured.description}
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-wider text-primary-300/80">
                  {featured.credit}
                </p>
              </div>
            </motion.article>

            {rest.map((place, i) => (
              <motion.article
                key={place.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 * (i + 1) }}
                className="group relative min-h-[180px] overflow-hidden rounded-2xl border border-white/10 lg:col-span-5 lg:min-h-[0]"
              >
                <SiteImage
                  src={place.image}
                  alt={place.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-xl">{place.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-primary-100">
                    {place.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-primary-400">
            {taichungShowcase.photoNote}
          </p>
        </MotionSection>
      </div>
    </section>
  )
}
