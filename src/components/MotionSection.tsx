import { motion } from "framer-motion"
import { fadeUpVariants } from "../utils/animations"

export function MotionSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUpVariants}
      custom={delay}
      className={className}
    >
      {children}
    </motion.section>
  )
}
