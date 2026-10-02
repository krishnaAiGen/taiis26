import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Calendar,
  FileText,
  Layers,
  Mail,
  MapPin,
  Wrench,
} from "lucide-react"
import { Hero } from "../components/Hero"
import { CountdownTimer } from "../components/CountdownTimer"
import { SectionDivider } from "../components/SectionDivider"
import { TopicList } from "../components/TopicList"
import { PublicationNoticeCard } from "../components/PublicationNotice"
import { PublicationPartners } from "../components/PublicationPartners"
import { MotionSection } from "../components/MotionSection"
import { SectionHeading } from "../components/SectionHeading"
import { StatHighlights } from "../components/StatHighlights"
import { siteConfig } from "../config/siteConfig"
import { SiteImage } from "../components/SiteImage"
import { NearbyAttractionsMarquee } from "../components/NearbyAttractionsMarquee"

const iconMap = {
  "file-text": FileText,
  calendar: Calendar,
  layers: Layers,
  wrench: Wrench,
  "map-pin": MapPin,
  mail: Mail,
} as const

type HomePartner =
  | (typeof siteConfig)["home"]["industryPartner"]["partners"][number]
  | (typeof siteConfig)["home"]["knowledgePartner"]["partners"][number]

function PartnerLogoCards({
  partners,
  singleRow = false,
}: {
  partners: readonly HomePartner[]
  singleRow?: boolean
}) {
  return (
    <div
      className={
        singleRow
          ? "mt-10 flex flex-nowrap items-stretch justify-center gap-1.5 sm:gap-4"
          : "mt-10 flex flex-wrap items-center justify-center gap-8"
      }
    >
      {partners.map((partner) => {
        const card = (
          <SiteImage
            src={partner.logo}
            alt={partner.alt}
            className={
              singleRow
                ? "mx-auto h-10 w-full max-w-full object-contain sm:h-16 lg:h-[4.5rem]"
                : "h-20 w-auto max-w-xs object-contain sm:h-24"
            }
          />
        )
        return (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className={`flex min-w-0 items-center justify-center rounded-2xl border shadow-sm transition-shadow ${
              singleRow
                ? "min-w-0 flex-1 basis-0 px-1.5 py-4 sm:px-3 sm:py-6 lg:max-w-[12rem]"
                : "px-10 py-8"
            } ${
              "cardClass" in partner && partner.cardClass
                ? partner.cardClass
                : "border-slate-200 bg-white hover:border-primary-200 hover:shadow-md"
            }`}
          >
            {"url" in partner && partner.url ? (
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
              >
                {card}
              </a>
            ) : (
              card
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

const quickLinkIconStyles = [
  "bg-gradient-to-br from-accent-400/30 to-primary-500/20 text-primary-700 group-hover:from-accent-400 group-hover:to-primary-500 group-hover:text-white",
  "bg-gradient-to-br from-sun-400/30 to-bloom-400/20 text-bloom-600 group-hover:from-sun-400 group-hover:to-bloom-500 group-hover:text-white",
  "bg-gradient-to-br from-lime-400/30 to-accent-400/20 text-lime-600 group-hover:from-lime-400 group-hover:to-accent-500 group-hover:text-white",
  "bg-gradient-to-br from-bloom-400/30 to-primary-500/20 text-primary-600 group-hover:from-bloom-400 group-hover:to-primary-600 group-hover:text-white",
]

export function HomePage() {
  const { home, topics, nearbyAttractions } = siteConfig
  const previewTopics = topics.slice(0, 12)
  const { aimAndScope } = home

  return (
    <>
      <Hero />
      <SectionDivider variant="slant" />
      <StatHighlights />

      <section className="relative py-16 sm:py-20">
        <div className="page-mesh pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PublicationPartners />
        </div>
      </section>

      <SectionDivider bright />

      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading>{nearbyAttractions.title}</SectionHeading>
              <Link
                to="/nearby-attractions"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-800"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <NearbyAttractionsMarquee />
          </MotionSection>

          <MotionSection className="mt-16 sm:mt-20">
            <div className="mx-auto max-w-3xl">
              <SectionHeading>{aimAndScope.title}</SectionHeading>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                {aimAndScope.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>
          </MotionSection>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <SectionHeading>{home.publicationPreview.title}</SectionHeading>
            <div className="mt-8">
              <PublicationNoticeCard showReadMore />
            </div>
          </MotionSection>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <SectionHeading>{home.quickLinks.title}</SectionHeading>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {home.quickLinks.items.map((item, i) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.08,
                      type: "spring",
                      stiffness: 400,
                      damping: 22,
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Link
                      to={item.path}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-primary-50/40 p-6 shadow-sm transition-all hover:border-accent-300/60 hover:shadow-lg hover:shadow-accent-500/10"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${quickLinkIconStyles[i % quickLinkIconStyles.length]}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-slate-500">
                        {item.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-all group-hover:gap-2">
                        {siteConfig.ui.learnMore}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </MotionSection>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionSection>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionHeading>{home.topicsPreview.title}</SectionHeading>
                <p className="mt-3 max-w-2xl text-slate-600">
                  {home.topicsPreview.subtitle}
                </p>
              </div>
              <Link
                to={home.topicsPreview.viewAllPath}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 via-accent-500 to-bloom-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-500/25 transition-all hover:brightness-110 hover:shadow-lg"
              >
                {home.topicsPreview.viewAllLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10">
              <TopicList topics={previewTopics} columns={3} />
            </div>
          </MotionSection>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          <MotionSection>
            <SectionHeading>{home.knowledgePartner.title}</SectionHeading>
            <PartnerLogoCards partners={home.knowledgePartner.partners} singleRow />
          </MotionSection>
          <MotionSection>
            <SectionHeading>{home.industryPartner.title}</SectionHeading>
            <PartnerLogoCards partners={home.industryPartner.partners} />
          </MotionSection>
        </div>
      </section>

      <CountdownTimer />
    </>
  )
}
