import { Link } from "react-router-dom"
import { CalendarDays, Mail, MapPin } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

function flattenNavLinks(): Array<{ label: string; path: string }> {
  const links: Array<{ label: string; path: string }> = []
  for (const item of siteConfig.navigation) {
    if ("children" in item) {
      for (const child of item.children) {
        links.push({ label: child.label, path: child.path })
      }
    } else {
      links.push({ label: item.label, path: item.path })
    }
  }
  return links
}

export function Footer() {
  const { conference, footer } = siteConfig
  const links = flattenNavLinks()

  return (
    <footer className="border-t border-primary-800 bg-primary-950 text-primary-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold text-white">{conference.shortName}</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary-300">
              {footer.tagline}
            </p>
            <p className="mt-4 text-xs text-primary-400">{footer.poweredBy}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {footer.quickLinksTitle}
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-300 transition-colors hover:text-accent-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {footer.conferenceInfoTitle}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-300">
              <li className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                {conference.dates}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                {conference.locationFull}
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <a
                  href={`mailto:${conference.email}`}
                  className="transition-colors hover:text-accent-400"
                >
                  {conference.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-800 pt-8 text-center text-xs text-primary-400">
          {footer.copyright}
        </div>
      </div>
    </footer>
  )
}
