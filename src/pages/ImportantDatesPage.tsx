import { motion } from "framer-motion"
import { CalendarDays } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { EventDateDisplay } from "../components/EventDateDisplay"
import { siteConfig } from "../config/siteConfig"

export function ImportantDatesPage() {
  const { importantDates } = siteConfig

  return (
    <>
      <Breadcrumbs current={importantDates.title} />
      <PageHeader title={importantDates.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="space-y-4">
              {importantDates.dates.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-md ${
                    "highlight" in item && item.highlight
                      ? "border-primary-300 bg-primary-50 shadow-sm"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        "highlight" in item && item.highlight
                          ? "bg-primary-600 text-white"
                          : "bg-primary-100 text-primary-600"
                      }`}
                    >
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-slate-800">{item.label}</span>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-semibold sm:text-base ${
                      "highlight" in item && item.highlight
                        ? "text-primary-700"
                        : "text-slate-600"
                    }`}
                  >
                    <EventDateDisplay
                      date={item.date}
                      supersededDate={
                        "supersededDate" in item ? item.supersededDate : undefined
                      }
                    />
                  </span>
                </motion.div>
              ))}
            </div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
