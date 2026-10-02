import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"
import { workshopDetailPath } from "../utils/workshops"

export function WorkshopsPage() {
  const { workshops } = siteConfig

  return (
    <>
      <Breadcrumbs current={workshops.title} />
      <PageHeader title={workshops.title} subtitle={workshops.intro} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {workshops.workshops.map((workshop, i) => (
                <motion.li
                  key={workshop.code}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={workshopDetailPath(workshop.code)}
                    className="group flex items-start gap-4 px-5 py-5 transition-colors hover:bg-primary-50/60 sm:px-6 sm:py-6"
                  >
                    <span className="mt-0.5 shrink-0 text-sm font-bold uppercase tracking-wider text-primary-600">
                      {workshop.code}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-serif text-lg leading-snug text-primary-950 transition-colors group-hover:text-primary-700 sm:text-xl">
                        {workshop.title}
                      </span>
                    </span>
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-primary-500" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
