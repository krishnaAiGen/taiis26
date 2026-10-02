import type { Session } from "@supabase/supabase-js"
import { getSupabase } from "./supabase"
import { registrationTable } from "./registrations"

/**
 * Admin access is enforced by Row Level Security, not by this module and not by
 * the /admin route being unlisted. A signed-in user who is absent from
 * admin_users receives an empty result set from the same query, so there is no
 * client-side check that could be bypassed to reveal data.
 */

export interface AdminRegistration {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  organization: string
  country: string
  registration_category: string
  attendance_mode: string
  paper_id: string | null
  attending_dinner: boolean
  dietary_requirement: string | null
  payment_status: string
  payment_method: string
  payment_amount: number | null
  payment_currency: string | null
  payment_reference: string | null
  paid_at: string | null
}

export interface AdminStats {
  total: number
  paid: number
  pending: number
  failed: number
  refunded: number
  revenueUsd: number
  revenueTwd: number
  awaitingNtd: number
}

export async function signIn(email: string, password: string) {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password })
  return error ? { ok: false as const, message: error.message } : { ok: true as const }
}

export async function signOut() {
  await getSupabase().auth.signOut()
}

export async function currentSession(): Promise<Session | null> {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

export function onAuthChange(cb: (session: Session | null) => void) {
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => cb(session))
  return () => data.subscription.unsubscribe()
}

export type RegistrationsResult =
  | { ok: true; rows: AdminRegistration[] }
  | { ok: false; message: string }

export async function fetchRegistrations(): Promise<RegistrationsResult> {
  const { data, error } = await getSupabase()
    .from(registrationTable)
    .select(
      "id, created_at, first_name, last_name, email, organization, country, " +
        "registration_category, attendance_mode, paper_id, attending_dinner, " +
        "dietary_requirement, payment_status, payment_method, payment_amount, " +
        "payment_currency, payment_reference, paid_at",
    )
    .order("created_at", { ascending: false })

  if (error) {
    return {
      ok: false,
      message:
        error.code === "42501"
          ? "This account does not have admin access."
          : error.message,
    }
  }

  // The table name is dynamic, so supabase-js cannot infer the row shape and
  // falls back to a generic type; the column list above is the contract.
  return { ok: true, rows: (data ?? []) as unknown as AdminRegistration[] }
}

/** Revenue counts settled money only — pending rows are not income. */
export function summarise(rows: AdminRegistration[]): AdminStats {
  const stats: AdminStats = {
    total: rows.length,
    paid: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    revenueUsd: 0,
    revenueTwd: 0,
    awaitingNtd: 0,
  }

  for (const r of rows) {
    if (r.payment_status === "paid") {
      stats.paid++
      const amount = Number(r.payment_amount ?? 0)
      if (r.payment_currency === "TWD") stats.revenueTwd += amount
      else stats.revenueUsd += amount
    } else if (r.payment_status === "failed") stats.failed++
    else if (r.payment_status === "refunded") stats.refunded++
    else {
      stats.pending++
      // NT$ has no automated provider, so these need chasing by hand.
      if (r.payment_method === "ntd") stats.awaitingNtd++
    }
  }

  return stats
}

export function toCsv(rows: AdminRegistration[]): string {
  const headers = [
    "Registered", "First name", "Last name", "Email", "Organization", "Country",
    "Category", "Mode", "Paper ID", "Dinner", "Dietary",
    "Status", "Method", "Amount", "Currency", "Reference", "Paid at",
  ]
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v)
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
  }
  const lines = rows.map((r) =>
    [
      r.created_at, r.first_name, r.last_name, r.email, r.organization, r.country,
      r.registration_category, r.attendance_mode, r.paper_id,
      r.attending_dinner ? "Yes" : "No", r.dietary_requirement,
      r.payment_status, r.payment_method, r.payment_amount, r.payment_currency,
      r.payment_reference, r.paid_at,
    ].map(escape).join(","),
  )
  return [headers.join(","), ...lines].join("\n")
}
