import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export interface MarqueeCardStripProps {
  count: number
  getItemKey: (index: number) => string
  renderCard: (index: number) => ReactNode
  intervalMs?: number
  marqueeDurationSec?: number
  /** Tailwind gradient stops for left/right fade, e.g. `from-white via-white/80` */
  edgeFadeClassName?: string
  className?: string
}

export function MarqueeCardStrip({
  count,
  getItemKey,
  renderCard,
  intervalMs = 4500,
  marqueeDurationSec = 28,
  edgeFadeClassName = "from-slate-50 via-slate-50/80",
  className = "mt-10",
}: MarqueeCardStripProps) {
  const reduceMotion = useReducedMotion()
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!reduceMotion || count <= 1) return
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % count)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [reduceMotion, count, intervalMs])

  if (count === 0) return null

  if (!reduceMotion && count > 1) {
    const indices = [...Array.from({ length: count }, (_, i) => i), ...Array.from({ length: count }, (_, i) => i)]
    return (
      <div className={`partner-marquee relative ${className}`}>
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r ${edgeFadeClassName} to-transparent sm:w-20`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l ${edgeFadeClassName} to-transparent sm:w-20`}
        />

        <div className="overflow-hidden">
          <div
            className="partner-marquee-track flex w-max gap-6"
            style={
              {
                "--marquee-duration": `${marqueeDurationSec}s`,
              } as CSSProperties
            }
          >
            {indices.map((i, slot) => (
              <div key={`${getItemKey(i)}-${slot}`}>{renderCard(i)}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const safePage = count > 0 ? page % count : 0

  return (
    <>
      <div className={`relative overflow-hidden ${className}`}>
        <motion.div
          key={safePage}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex justify-center px-4"
        >
          {renderCard(safePage)}
        </motion.div>
      </div>
      {count > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={getItemKey(i)}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all ${
                i === safePage
                  ? "w-8 bg-gradient-to-r from-accent-400 to-primary-500"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}
