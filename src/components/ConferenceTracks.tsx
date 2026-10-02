import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

export function ConferenceTracks() {
  const { tracks } = siteConfig.callForPapers

  return (
    <div className="space-y-10">
      {tracks.map((track, trackIndex) => (
        <motion.div
          key={track.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: trackIndex * 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h3 className="font-serif text-xl text-primary-950 sm:text-2xl">
            {track.title}
          </h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {track.topics.map((topic) => (
              <li
                key={topic}
                className="flex items-start gap-2.5 text-sm text-slate-700"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-justify">{topic}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
