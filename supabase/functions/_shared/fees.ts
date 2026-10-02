// GENERATED FILE — do not edit by hand.
// Source: src/config/paperRegistrationContent.json
// Regenerate: npm run generate-fee-table

/** Early bird applies to payments completed on or before this date (UTC). */
export const EARLY_BIRD_DEADLINE = "November 5, 2026"
export const EARLY_BIRD_CUTOFF_ISO = "2026-11-05T23:59:59Z"

export interface Fee {
  earlyBirdUsd: number
  earlyBirdNtd: number
  lateUsd: number
  lateNtd: number
}

export const FEES: Record<string, Fee> = {
  "Main Conference Author Registration — Regular Author (In-Person)": {
    "earlyBirdUsd": 450,
    "earlyBirdNtd": 14000,
    "lateUsd": 550,
    "lateNtd": 17500
  },
  "Main Conference Author Registration — Regular Author (Online)": {
    "earlyBirdUsd": 300,
    "earlyBirdNtd": 9500,
    "lateUsd": 400,
    "lateNtd": 12500
  },
  "Main Conference Author Registration — Regular Author (Online) — SAARC and Low-Income Countries Rate": {
    "earlyBirdUsd": 250,
    "earlyBirdNtd": 7500,
    "lateUsd": 350,
    "lateNtd": 11000
  },
  "Main Conference Author Registration — Additional Paper (Online Presentation)": {
    "earlyBirdUsd": 200,
    "earlyBirdNtd": 6000,
    "lateUsd": 300,
    "lateNtd": 9500
  },
  "Attendee Registration — Without Paper Presentation — In-Person Attendee": {
    "earlyBirdUsd": 250,
    "earlyBirdNtd": 7500,
    "lateUsd": 350,
    "lateNtd": 11000
  },
  "Attendee Registration — Without Paper Presentation — Online Attendee": {
    "earlyBirdUsd": 200,
    "earlyBirdNtd": 6000,
    "lateUsd": 300,
    "lateNtd": 9500
  },
  "Doctoral Symposium — Student Presenter Registration — Doctoral Student Presenter (In-Person)": {
    "earlyBirdUsd": 350,
    "earlyBirdNtd": 11000,
    "lateUsd": 450,
    "lateNtd": 14000
  },
  "Doctoral Symposium — Student Presenter Registration — Doctoral Student Presenter (Online)": {
    "earlyBirdUsd": 200,
    "earlyBirdNtd": 6000,
    "lateUsd": 300,
    "lateNtd": 9500
  }
}

/**
 * Live-payment verification entry. Deliberately NOT in FEES — it is only
 * priceable when ALLOW_TEST_CATEGORY is "true", so discovering this string does
 * not let anyone register for 1 dollar.
 */
export const TEST_CATEGORY = "Live payment verification — TEST — do not use (US$1)"

export const TEST_FEE: Fee = {
  earlyBirdUsd: 1,
  earlyBirdNtd: 30,
  lateUsd: 1,
  lateNtd: 30,
}
