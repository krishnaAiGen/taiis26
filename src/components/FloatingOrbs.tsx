import { motion } from "framer-motion"

const orbs = [
  {
    className: "left-[8%] top-[15%] h-56 w-56 bg-accent-400/35",
    duration: 14,
    delay: 0,
  },
  {
    className: "right-[10%] top-[25%] h-44 w-44 bg-bloom-400/30",
    duration: 11,
    delay: 1,
  },
  {
    className: "bottom-[20%] left-[35%] h-36 w-36 bg-sun-400/25",
    duration: 9,
    delay: 0.5,
  },
]

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb) => (
        <motion.div
          key={orb.className}
          className={`absolute rounded-full blur-3xl ${orb.className}`}
          animate={{
            y: [0, -28, 12, 0],
            x: [0, 18, -12, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
