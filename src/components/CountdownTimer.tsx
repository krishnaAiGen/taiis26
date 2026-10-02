import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, MapPin } from "lucide-react"
import { siteConfig } from "../config/siteConfig"
import { SiteImage } from "./SiteImage"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownTimer() {
  const { countdown } = siteConfig.home
  const { conference } = siteConfig
  const { labels } = countdown
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calcTimeLeft(conference.countdownTarget),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(conference.countdownTarget))
    }, 1000)
    return () => clearInterval(timer)
  }, [conference.countdownTarget])

  const units = [
    { value: timeLeft.days, label: labels.days },
    { value: timeLeft.hours, label: labels.hours },
    { value: timeLeft.minutes, label: labels.minutes },
    { value: timeLeft.seconds, label: labels.seconds },
  ]

  return (
    <section className="relative overflow-hidden bg-primary-950 py-16 text-white">
      {"backgroundImage" in countdown && countdown.backgroundImage ? (
        <>
          <SiteImage
            src={countdown.backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-primary-950/82 backdrop-blur-[2px]" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/30 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-primary-400/10 blur-3xl" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            {countdown.title}
          </h2>
          <p className="mt-2 text-primary-100">{countdown.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-200">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-accent-400" />
              {conference.dates}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent-400" />
              {conference.location}
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 to-accent-400/10 p-6 text-center shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:border-sun-400/50 hover:from-white/20 hover:to-bloom-400/15"
            >
              <motion.span
                key={unit.value}
                initial={{ scale: 1.15, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="block bg-gradient-to-b from-white to-accent-300 bg-clip-text font-serif text-4xl font-normal tabular-nums text-transparent sm:text-5xl"
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-widest text-primary-200">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
