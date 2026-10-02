import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface TopicListProps {
  topics: readonly string[]
  columns?: 2 | 3
}

const iconColors = [
  "text-accent-500",
  "text-bloom-500",
  "text-primary-500",
  "text-lime-500",
  "text-sun-500",
]

export function TopicList({ topics, columns = 2 }: TopicListProps) {
  const gridClass =
    columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2"

  return (
    <ul className={`grid gap-3 ${gridClass}`}>
      {topics.map((topic, i) => (
        <motion.li
          key={topic}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: (i % 12) * 0.04,
            type: "spring",
            stiffness: 300,
            damping: 24,
          }}
          whileHover={{ x: 6, scale: 1.01 }}
          className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-primary-50/50 p-3.5 text-sm text-slate-700 shadow-sm transition-shadow hover:border-accent-300/60 hover:shadow-md hover:shadow-accent-500/10"
        >
          <CheckCircle2
            className={`mt-0.5 h-4 w-4 shrink-0 ${iconColors[i % iconColors.length]}`}
          />
          <span className="text-justify">{topic}</span>
        </motion.li>
      ))}
    </ul>
  )
}
