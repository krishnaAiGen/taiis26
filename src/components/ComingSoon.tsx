import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

export function ComingSoon({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
        <Clock className="h-8 w-8 text-primary-600" />
      </div>
      <p className="mt-6 text-lg font-medium text-slate-700">{message}</p>
      <span className="mt-2 text-sm text-slate-500">{siteConfig.ui.comingSoon}</span>
    </motion.div>
  )
}
