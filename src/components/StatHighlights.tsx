import { motion } from "framer-motion"
import { siteConfig } from "../config/siteConfig"

const accentBars = [
  "from-accent-400 to-primary-500",
  "from-sun-400 to-bloom-400",
  "from-lime-400 to-accent-500",
  "from-bloom-400 to-primary-500",
]

export function StatHighlights() {
  const { highlights } = siteConfig.home

  return (
    <section className="relative overflow-hidden border-y border-primary-100/80 bg-white/90 py-10 backdrop-blur-sm">
      <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-accent-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-bloom-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-shine group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-primary-50/80 p-5 shadow-md shadow-primary-500/5 transition-shadow hover:shadow-lg hover:shadow-accent-500/10"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentBars[i % accentBars.length]}`}
              />
              <motion.div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-400/10 blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                {item.label}
              </p>
              <p className="mt-2 font-serif text-2xl text-primary-950 transition-colors group-hover:text-primary-600">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{item.hint}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
