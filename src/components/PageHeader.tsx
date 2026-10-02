import { motion } from "framer-motion"
import { SiteImage } from "./SiteImage"
import { TaichungImageSlider, type TaichungSlide } from "./TaichungImageSlider"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  backgroundSlides?: readonly TaichungSlide[]
  slideIntervalMs?: number
}

export function PageHeader({
  title,
  subtitle,
  backgroundImage,
  backgroundSlides,
  slideIntervalMs = 5500,
}: PageHeaderProps) {
  const hasSlides = backgroundSlides && backgroundSlides.length > 0

  return (
    <section className="relative overflow-hidden bg-primary-950 py-16 text-white sm:py-20">
      {hasSlides ? (
        <>
          <TaichungImageSlider
            slides={backgroundSlides}
            intervalMs={slideIntervalMs}
            className="absolute inset-0"
            imageClassName="h-full w-full object-cover"
            showDots={backgroundSlides.length > 1}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/92 via-primary-950/75 to-primary-900/65" />
        </>
      ) : backgroundImage ? (
        <>
          <SiteImage
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/80 to-primary-900/70" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-600/40 via-primary-950 to-primary-950" />
      )}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base text-primary-100 sm:text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
