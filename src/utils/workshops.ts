import { siteConfig } from "../config/siteConfig"

export type Workshop = (typeof siteConfig.workshops.workshops)[number]

export function workshopSlug(code: string) {
  return code.trim().toLowerCase()
}

export function findWorkshopBySlug(slug: string | undefined): Workshop | undefined {
  if (!slug) return undefined
  const normalized = slug.trim().toLowerCase()
  return siteConfig.workshops.workshops.find(
    (workshop) => workshopSlug(workshop.code) === normalized,
  )
}

export function workshopDetailPath(code: string) {
  return `/workshops/${workshopSlug(code)}`
}
