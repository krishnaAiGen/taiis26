import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, CalendarDays, ExternalLink, MapPin, Sparkles } from "lucide-react"
import { HeroSlider } from "./HeroSlider"
import { FloatingOrbs } from "./FloatingOrbs"
import { siteConfig } from "../config/siteConfig"

const heroButtonPrimary =
  "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-400 via-accent-500 to-lime-400 px-6 py-3 text-sm font-semibold text-primary-950 shadow-lg shadow-accent-500/40 transition-all hover:brightness-110 hover:shadow-accent-400/50"

function HeroNewBadge() {
  return (
    <span className="animate-hero-new-badge inline-flex shrink-0 items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-bold uppercase leading-none tracking-wide text-primary-950 shadow-sm">
      New
    </span>
  )
}

export function Hero() {
  const { conference, hero } = siteConfig

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-primary-950 text-white">
      <HeroSlider />
      <FloatingOrbs />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent-400/50 bg-gradient-to-r from-accent-400/20 to-bloom-400/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-300"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-3.5 w-3.5 text-sun-400" />
            </motion.span>
            {conference.location} · {conference.datesShort}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-6 font-serif text-4xl leading-[1.08] tracking-tight drop-shadow-lg sm:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-br from-white via-primary-100 to-accent-300 bg-clip-text text-transparent">
              {conference.fullName}
            </span>
          </motion.h1>
          <p className="mt-4 text-xl text-primary-100/95 drop-shadow sm:text-2xl">
            ({conference.acronym})
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-primary-100 sm:text-base">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md">
              <CalendarDays className="h-4 w-4 text-accent-400" />
              {conference.dates}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md">
              <MapPin className="h-4 w-4 text-accent-400" />
              {conference.locationFull}
            </span>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={hero.ctaSubmit.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaSubmit.label}
                <ExternalLink className="h-4 w-4" />
              </motion.span>
            </a>
            <Link to={hero.ctaPrimary.path}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaPrimary.label}
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link to={hero.ctaSubmissionGuidelines.path}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaSubmissionGuidelines.label}
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link to={hero.ctaSecondary.path}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaSecondary.label}
                <HeroNewBadge />
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link to={hero.ctaSpecialSessions.path}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaSpecialSessions.label}
                <HeroNewBadge />
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link to={hero.ctaWorkshops.path}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaWorkshops.label}
                <HeroNewBadge />
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link to={hero.ctaDoctoralSymposium.path}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaDoctoralSymposium.label}
                <HeroNewBadge />
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link to={hero.ctaExtendedJournalPublication.path}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={heroButtonPrimary}
              >
                {hero.ctaExtendedJournalPublication.label}
                <HeroNewBadge />
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
