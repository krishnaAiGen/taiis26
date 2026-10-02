import { siteConfig } from "../config/siteConfig"

export type SpecialSession = (typeof siteConfig.specialSessions.sessions)[number]

export function specialSessionSlug(code: string) {
  return code.trim().toLowerCase()
}

export function findSpecialSessionBySlug(slug: string | undefined): SpecialSession | undefined {
  if (!slug) return undefined
  const normalized = slug.trim().toLowerCase()
  return siteConfig.specialSessions.sessions.find(
    (session) => specialSessionSlug(session.code) === normalized,
  )
}

export function specialSessionDetailPath(code: string) {
  return `/special-sessions/${specialSessionSlug(code)}`
}
