import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

interface BreadcrumbsProps {
  current: string
  parent?: { label: string; path: string }
}

export function Breadcrumbs({ current, parent }: BreadcrumbsProps) {
  const location = useLocation()

  if (location.pathname === "/") return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-slate-500 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-1 transition-colors hover:text-primary-600"
        >
          <Home className="h-3.5 w-3.5" />
          {siteConfig.breadcrumbs.home}
        </Link>
        {parent ? (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            <Link
              to={parent.path}
              className="transition-colors hover:text-primary-600"
            >
              {parent.label}
            </Link>
          </>
        ) : null}
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
        <span className="font-medium text-primary-700">{current}</span>
      </div>
    </nav>
  )
}
