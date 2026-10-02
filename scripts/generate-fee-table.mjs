// Generates the server-side fee table used by the payment Edge Functions from
// the same JSON the website renders, so a price can never be edited in one
// place and left stale in the other.
//
//   npm run generate-fee-table
//
// Run this whenever src/config/paperRegistrationContent.json changes, then
// redeploy the functions.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const source = resolve(root, "src/config/paperRegistrationContent.json")
const target = resolve(root, "supabase/functions/_shared/fees.ts")

const content = JSON.parse(readFileSync(source, "utf-8"))

// The $1 live-payment test entry lives in the form config, not the published fee
// table, so it never appears on the public pricing page. Emitting it from here
// keeps the category string identical on the client and the server — a mismatch
// would make the test entry silently unpriceable.
const formConfig = JSON.parse(
  readFileSync(resolve(root, "src/config/registrationFormContent.json"), "utf-8"),
)
const test = formConfig.testCategory
const testKey = `${test.section} — ${test.name}`

const entries = content.feeSections.flatMap((section) =>
  section.categories.map((category) => ({
    // Must match the value the browser stores in registration_category.
    key: `${section.heading} — ${category.name}`,
    earlyBirdUsd: category.earlyBird.usd,
    earlyBirdNtd: category.earlyBird.ntd,
    lateUsd: category.late.usd,
    lateNtd: category.late.ntd,
  })),
)

const duplicates = entries
  .map((e) => e.key)
  .filter((key, i, all) => all.indexOf(key) !== i)
if (duplicates.length > 0) {
  throw new Error(`Duplicate fee keys would make pricing ambiguous: ${duplicates.join(", ")}`)
}

for (const entry of entries) {
  for (const [field, value] of Object.entries(entry)) {
    if (field === "key") continue
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`Fee ${field} for "${entry.key}" must be a positive integer, got ${value}`)
    }
  }
}

const body = `// GENERATED FILE — do not edit by hand.
// Source: src/config/paperRegistrationContent.json
// Regenerate: npm run generate-fee-table

/** Early bird applies to payments completed on or before this date (UTC). */
export const EARLY_BIRD_DEADLINE = "${content.earlyBirdHeader.subtitle.replace(/^On or before /, "")}"
export const EARLY_BIRD_CUTOFF_ISO = "2026-11-05T23:59:59Z"

export interface Fee {
  earlyBirdUsd: number
  earlyBirdNtd: number
  lateUsd: number
  lateNtd: number
}

export const FEES: Record<string, Fee> = ${JSON.stringify(
  Object.fromEntries(
    entries.map(({ key, ...rest }) => [key, rest]),
  ),
  null,
  2,
)}

/**
 * Live-payment verification entry. Deliberately NOT in FEES — it is only
 * priceable when ALLOW_TEST_CATEGORY is "true", so discovering this string does
 * not let anyone register for ${test.usd} dollar.
 */
export const TEST_CATEGORY = ${JSON.stringify(testKey)}

export const TEST_FEE: Fee = {
  earlyBirdUsd: ${test.usd},
  earlyBirdNtd: ${test.ntd},
  lateUsd: ${test.usd},
  lateNtd: ${test.ntd},
}
`

mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, body, "utf-8")
console.log(`Wrote ${entries.length} fee entries to supabase/functions/_shared/fees.ts`)
