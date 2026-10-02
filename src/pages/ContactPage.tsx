import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { PageHeader } from "../components/PageHeader"
import { MotionSection } from "../components/MotionSection"
import { siteConfig } from "../config/siteConfig"

export function ContactPage() {
  const { contact, conference } = siteConfig

  return (
    <>
      <Breadcrumbs current={contact.title} />
      <PageHeader title={contact.title} />
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
              <p className="mt-6 text-lg text-slate-600">{contact.message}</p>
              <a
                href={`mailto:${conference.email}`}
                className="mt-4 inline-block text-xl font-semibold text-primary-700 transition-colors hover:text-primary-500"
              >
                {conference.email}
              </a>
            </motion.div>
          </MotionSection>
        </div>
      </section>
    </>
  )
}
