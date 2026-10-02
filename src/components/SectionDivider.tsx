import { motion } from "framer-motion"

export function SectionDivider({
  variant = "wave",
  bright = false,
}: {
  variant?: "wave" | "slant"
  bright?: boolean
}) {
  if (variant === "slant") {
    return (
      <div className="relative h-16 overflow-hidden bg-transparent">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path d="M0 64L1440 0V64H0Z" className="fill-white" />
        </svg>
      </div>
    )
  }

  const gradId = bright ? "wave-bright" : "wave-soft"

  return (
    <div className="relative h-14 overflow-hidden bg-white">
      <motion.svg
        viewBox="0 0 2880 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-[200%] animate-divider-wave"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="2880" y2="0">
            <stop offset="0%" stopColor="#2563ff" stopOpacity="0.15" />
            <stop offset="25%" stopColor="#00d4ff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="0.2" />
            <stop offset="75%" stopColor="#facc15" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563ff" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M0 28C360 56 720 0 1080 28C1440 56 1800 0 2160 28C2520 56 2880 0 2880 28V56H0V28Z"
          fill={`url(#${gradId})`}
        />
      </motion.svg>
    </div>
  )
}
