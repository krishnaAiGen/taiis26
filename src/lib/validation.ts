/**
 * Form field rules, mirrored by CHECK constraints in
 * supabase/migrations/0005_field_validation.sql.
 *
 * The constraints are the real guarantee. RLS grants anon INSERT, so anyone can
 * POST straight to PostgREST and skip this file entirely; what is here exists to
 * give a helpful error before submitting, not to protect the data.
 */

/** Longest value each field may store, also used as the input maxLength. */
export const LIMITS = {
  name: 80,
  email: 254, // RFC 5321 maximum path length
  phone: 24, // generous for formatted input; normalised before storing
  organization: 120,
  citizenship: 100,
  paperId: 10,
  paperTitle: 300,
  dietaryComments: 500,
} as const

/**
 * Names are matched Unicode-aware on purpose. Restricting to A-Z would reject
 * 李雷, José, Müller, O'Brien and Anne-Marie — all legitimate registrants at an
 * international conference. Digits and symbols are still refused, so "abcd1234"
 * and markup do not get through.
 */
const NAME_CHARS = /^[\p{L}\p{M}\s'’.-]+$/u
const HAS_LETTER = /\p{L}/u

/** Citizenship additionally allows separators, for dual citizenship. */
const CITIZENSHIP_CHARS = /^[\p{L}\p{M}\s'’.,/-]+$/u

/** E.164: "+", a country code starting 1-9, then 7–15 digits in total. */
const E164 = /^\+[1-9]\d{6,14}$/

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Control characters, which have no place in any of these fields. */
const CONTROL = /[\p{Cc}\p{Cf}]/u

/** Collapses runs of whitespace and normalises accents to a single form. */
export function normaliseText(value: string): string {
  return value.normalize("NFC").trim().replace(/\s+/g, " ")
}

export function normaliseEmail(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Strips the punctuation people type in phone numbers so "+886 (912) 345-678"
 * is stored as "+886912345678".
 */
export function normalisePhone(value: string): string {
  return value.replace(/[\s()./-]/g, "")
}

export interface Rule {
  (value: string): string | null
}

export const validateName = (label: string): Rule => (value) => {
  const v = normaliseText(value)
  if (!v) return `${label} is required.`
  if (v.length > LIMITS.name) return `${label} must be ${LIMITS.name} characters or fewer.`
  if (!HAS_LETTER.test(v)) return `${label} must contain at least one letter.`
  if (!NAME_CHARS.test(v)) {
    return `${label} may only contain letters, spaces, hyphens, apostrophes and periods.`
  }
  return null
}

export const validatePhone: Rule = (value) => {
  const v = normalisePhone(value)
  if (!v) return "Mobile phone is required."
  if (!v.startsWith("+")) {
    return "Include the country code, starting with + (for example +886912345678)."
  }
  if (!E164.test(v)) {
    return "Enter a valid international number: + followed by 7 to 15 digits."
  }
  return null
}

export const validateEmail: Rule = (value) => {
  const v = normaliseEmail(value)
  if (!v) return "Email address is required."
  if (v.length > LIMITS.email) return "Email address is too long."
  if (!EMAIL.test(v)) return "Enter a valid e-mail address."
  return null
}

export const validateOrganization: Rule = (value) => {
  const v = normaliseText(value)
  if (!v) return "Institution / company name is required."
  if (v.length < 2) return "Institution / company name is too short."
  if (v.length > LIMITS.organization) {
    return `Institution / company name must be ${LIMITS.organization} characters or fewer.`
  }
  if (CONTROL.test(v)) return "Institution / company name contains invalid characters."
  return null
}

export const validateCitizenship: Rule = (value) => {
  const v = normaliseText(value)
  if (!v) return "Citizenship is required."
  if (v.length < 2) return "Citizenship is too short."
  if (v.length > LIMITS.citizenship) {
    return `Citizenship must be ${LIMITS.citizenship} characters or fewer.`
  }
  if (!HAS_LETTER.test(v)) return "Citizenship must contain at least one letter."
  if (!CITIZENSHIP_CHARS.test(v)) {
    return "Citizenship may only contain letters, spaces, commas and slashes."
  }
  return null
}

/** CMT submission numbers are numeric. */
export const validatePaperId: Rule = (value) => {
  const v = value.trim()
  if (!v) return "Paper ID is required."
  if (!/^\d{1,10}$/.test(v)) return "Paper ID must be the numeric CMT submission number."
  return null
}

export const validatePaperTitle: Rule = (value) => {
  const v = normaliseText(value)
  if (!v) return "Paper title is required."
  if (v.length < 3) return "Paper title is too short."
  if (v.length > LIMITS.paperTitle) {
    return `Paper title must be ${LIMITS.paperTitle} characters or fewer.`
  }
  return null
}

export const validateDietaryComments: Rule = (value) => {
  const v = value.trim()
  if (v.length > LIMITS.dietaryComments) {
    return `Please keep comments to ${LIMITS.dietaryComments} characters or fewer.`
  }
  return null
}
