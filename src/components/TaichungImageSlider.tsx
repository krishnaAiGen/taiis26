import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SiteImage } from "./SiteImage"

export type TaichungSlide = {
  src: string
  alt: string
  fit?: "contain" | "cover"
}

interface TaichungImageSliderProps {
  slides: readonly TaichungSlide[]
  intervalMs?: number
  className?: string
  imageClassName?: string
  showDots?: boolean
  /** Slow zoom during each slide; disable for sharper small thumbnails. */
  zoomEffect?: boolean
  showOverlay?: boolean
}

const MotionSiteImage = motion.create(SiteImage)

export function TaichungImageSlider({
  slides,
  intervalMs = 5000,
  className = "",
  imageClassName = "aspect-[4/5] w-full object-cover",
  showDots = true,
  zoomEffect = true,
  showOverlay = true,
}: TaichungImageSliderProps) {
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

  const slide = slides[current]
  const slideImageClass =
    slide.fit === "contain"
      ? "h-full w-full bg-slate-100 object-contain object-center"
      : imageClassName

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {zoomEffect ? (
            <MotionSiteImage
              src={slide.src}
              alt={slide.alt}
              className={slideImageClass}
              loading="lazy"
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: intervalMs / 1000 + 0.5, ease: "linear" }}
            />
          ) : (
            <SiteImage
              src={slide.src}
              alt={slide.alt}
              className={slideImageClass}
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showOverlay ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/25 via-transparent to-transparent" />
      ) : null}

      {showDots && slides.length > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrent(i)
              }}
              className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-white shadow-sm"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
