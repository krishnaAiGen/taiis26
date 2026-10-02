import { useCallback, useEffect, useMemo, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import {
  AlertCircle,
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { siteConfig } from "../config/siteConfig"
import { registrationConfigured, registrationTable } from "../lib/registrations"
import {
  currentSession,
  fetchRegistrations,
  onAuthChange,
  signIn,
  signOut,
  summarise,
  toCsv,
  type AdminRegistration,
} from "../lib/admin"

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-lime-500/15 text-lime-700",
  pending: "bg-amber-500/15 text-amber-700",
  failed: "bg-rose-500/15 text-rose-700",
  refunded: "bg-slate-400/20 text-slate-600",
  cancelled: "bg-slate-400/20 text-slate-600",
}

const controlClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-800 shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none"

function money(amount: number, currency: "USD" | "TWD") {
  const n = currency === "TWD"
    ? Math.round(amount).toLocaleString("en-US")
    : amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return currency === "TWD" ? `NT$${n}` : `US$${n}`
}

function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string
  value: string
  hint?: string
  tone?: "default" | "good" | "warn" | "bad"
}) {
  const toneClass = {
    default: "text-primary-950",
    good: "text-lime-600",
    warn: "text-amber-600",
    bad: "text-rose-600",
  }[tone]
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {label}
      </p>
      <p className={`mt-1.5 font-serif text-2xl ${toneClass}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const result = await signIn(email.trim(), password)
    setPending(false)
    if (result.ok) onSignedIn()
    else setError(result.message)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-primary-600" />
          <h1 className="font-serif text-xl text-primary-950 sm:text-2xl">
            {siteConfig.conference.acronym} Admin
          </h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Sign in with your organizing-committee account to review registrations.
        </p>

        <form onSubmit={handle} className="mt-6">
          <label className="block text-sm font-medium text-primary-950" htmlFor="admin-email">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={controlClass}
          />

          <label
            className="mt-4 block text-sm font-medium text-primary-950"
            htmlFor="admin-password"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={controlClass}
          />

          {error ? (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <p className="text-sm text-rose-800">{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

function Dashboard({ session }: { session: Session }) {
  const [rows, setRows] = useState<AdminRegistration[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    const result = await fetchRegistrations()
    setLoading(false)
    if (result.ok) {
      setRows(result.rows)
      setError(null)
    } else {
      setRows([])
      setError(result.message)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = useMemo(() => summarise(rows ?? []), [rows])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (rows ?? []).filter((r) => {
      if (filter !== "all" && r.payment_status !== filter) return false
      if (!q) return true
      return `${r.first_name} ${r.last_name} ${r.email} ${r.organization} ${r.registration_category}`
        .toLowerCase()
        .includes(q)
    })
  }, [rows, filter, query])

  function download() {
    const blob = new Blob([toCsv(visible)], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taiis2026-registrations-${registrationTable}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-primary-600" />
            <h1 className="font-serif text-2xl text-primary-950 sm:text-3xl">
              Registrations
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            {session.user.email} · table{" "}
            <span className="font-mono">{registrationTable}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={download}
            disabled={visible.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <p className="font-medium text-rose-900">Could not load registrations</p>
            <p className="mt-1 text-sm text-rose-800">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total registrations" value={String(stats.total)} />
        <StatCard label="Paid" value={String(stats.paid)} tone="good" />
        <StatCard
          label="Awaiting payment"
          value={String(stats.pending)}
          tone="warn"
          hint={stats.awaitingNtd > 0 ? `${stats.awaitingNtd} awaiting NT$ transfer` : undefined}
        />
        <StatCard
          label="Failed / refunded"
          value={`${stats.failed} / ${stats.refunded}`}
          tone={stats.failed > 0 ? "bad" : "default"}
        />
        <StatCard
          label="Collected (USD)"
          value={money(stats.revenueUsd, "USD")}
          hint="Settled payments only"
          tone="good"
        />
        <StatCard
          label="Collected (NT$)"
          value={money(stats.revenueTwd, "TWD")}
          hint="Settled payments only"
          tone="good"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search name, e-mail, organization…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none sm:w-80"
        />
        <div className="flex flex-wrap gap-1.5">
          {["all", "paid", "pending", "failed", "refunded"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-sm text-slate-500">{visible.length} shown</span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr>
              {["Registered", "Name", "Organization", "Category", "Amount", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && rows === null ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No registrations match.
                </td>
              </tr>
            ) : (
              visible.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {new Date(r.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary-950">
                      {r.first_name} {r.last_name}
                    </div>
                    <div className="text-xs text-slate-500">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{r.organization}</div>
                    <div className="text-xs text-slate-500">{r.country}</div>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-600">
                    <div className="truncate" title={r.registration_category}>
                      {r.registration_category}
                    </div>
                    <div className="text-xs text-slate-500">
                      {r.attendance_mode}
                      {r.paper_id ? ` · paper ${r.paper_id}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                    {r.payment_amount !== null && r.payment_currency
                      ? money(Number(r.payment_amount), r.payment_currency as "USD" | "TWD")
                      : "—"}
                    <div className="text-xs text-slate-500">
                      {r.payment_method === "ntd" ? "NT$ provider" : "PayPal"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${
                        STATUS_STYLES[r.payment_status] ?? STATUS_STYLES.pending
                      }`}
                    >
                      {r.payment_status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Read-only. Payment status is set by the payment provider's webhook; this
        panel cannot change it, and the database rejects the attempt.
      </p>
    </div>
  )
}

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Keep the admin panel out of search results even though it holds no data
    // without a session.
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [])

  useEffect(() => {
    if (!registrationConfigured) {
      setChecking(false)
      return
    }
    void currentSession().then((s) => {
      setSession(s)
      setChecking(false)
    })
    return onAuthChange(setSession)
  }, [])

  if (!registrationConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
        <p className="mt-4 text-base text-slate-600">
          Supabase is not configured for this deployment, so the admin panel is
          unavailable.
        </p>
      </div>
    )
  }

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
      </div>
    )
  }

  return session ? (
    <Dashboard session={session} />
  ) : (
    <LoginForm onSignedIn={() => void currentSession().then(setSession)} />
  )
}
