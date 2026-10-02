import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SectionHeadingProps {
  children: ReactNode
  className?: string
  as?: "h1" | "h2" | "h3"
}

export function SectionHeading({
  children,
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tag
        className={`heading-gradient font-serif text-3xl tracking-tight sm:text-4xl ${className}`}
      >
        {children}
      </Tag>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 block h-1 w-20 origin-left rounded-full bg-gradient-to-r from-accent-400 via-bloom-400 to-sun-400"
      />
    </motion.div>
  )
}
