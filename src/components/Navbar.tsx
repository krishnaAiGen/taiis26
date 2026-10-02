import { useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X } from "lucide-react"
import { siteConfig } from "../config/siteConfig"

function NavItem({
  label,
  path,
  onNavigate,
}: {
  label: string
  path: string
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-accent-400 after:via-sun-400 after:to-bloom-400"
            : "text-primary-100 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()
  const { conference, navigation } = siteConfig

  const isChildActive = (children: readonly { path: string }[]) =>
    children.some((c) => location.pathname === c.path)

  const closeMobile = () => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-primary-950/90 shadow-lg shadow-primary-950/25 backdrop-blur-lg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-400 via-sun-400 to-bloom-400 opacity-80" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex flex-col" onClick={closeMobile}>
          <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-accent-400">
            {conference.shortName}
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-wider text-primary-300 sm:block">
            {conference.datesShort} · {conference.location}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) =>
            "children" in item ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isChildActive(item.children)
                      ? "text-white"
                      : "text-primary-100 hover:text-white"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 min-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-primary-900 py-1 shadow-xl"
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 text-sm transition-colors ${
                              isActive
                                ? "bg-primary-800 text-accent-400"
                                : "text-primary-100 hover:bg-primary-800 hover:text-white"
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavItem key={item.path} label={item.label} path={item.path} />
            ),
          )}
        </nav>

        <button
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? siteConfig.ui.menuClose : siteConfig.ui.menuOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) =>
                "children" in item ? (
                  <div key={item.label}>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label,
                        )
                      }
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-primary-100"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden pl-3"
                        >
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={closeMobile}
                              className={({ isActive }) =>
                                `block rounded-lg px-3 py-2 text-sm ${
                                  isActive
                                    ? "text-accent-400"
                                    : "text-primary-200 hover:text-white"
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavItem
                    key={item.path}
                    label={item.label}
                    path={item.path}
                    onNavigate={closeMobile}
                  />
                ),
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
