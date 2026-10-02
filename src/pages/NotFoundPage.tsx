import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

export function NotFoundPage() {
  const { notFound } = siteConfig

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-serif text-8xl font-normal text-primary-200 sm:text-9xl">
          {notFound.title}
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          {notFound.heading}
        </h1>
        <p className="mt-3 max-w-md text-slate-600">{notFound.message}</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Home className="h-4 w-4" />
          {notFound.backHome}
        </Link>
        <button
          onClick={() => window.history.back()}
          className="mt-4 ml-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {siteConfig.ui.goBack}
        </button>
      </motion.div>
    </section>
  )
}
