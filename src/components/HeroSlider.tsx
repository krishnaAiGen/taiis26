import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { siteConfig } from "../config/siteConfig"
import { SiteImage } from "./SiteImage"

const MotionSiteImage = motion.create(SiteImage)

export function HeroSlider() {
  const { nearbyAttractions, hero } = siteConfig
  const intervalMs = hero.slider.intervalMs
  const slides = useMemo(
    () =>
      nearbyAttractions.photos.map((photo) => ({
        src: photo.image,
        alt: photo.alt,
      })),
    [nearbyAttractions.photos],
  )
  const [current, setCurrent] = useState(0)

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, intervalMs)
    return () => clearInterval(timer)
  }, [next, intervalMs, slides.length])

  if (slides.length === 0) return null

  const slide = slides[current]
  const showDots = slides.length <= 12

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <MotionSiteImage
            src={slide.src}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: intervalMs / 1000 + 1, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-primary-900/50 to-indigo-950/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.12)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(244,114,182,0.1)_0%,_transparent_45%)]" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.35]" />

      {showDots ? (
        <div className="absolute bottom-6 left-1/2 z-[1] flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-8 bg-accent-400"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
