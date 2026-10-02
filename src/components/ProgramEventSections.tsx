import { CalendarDays, ExternalLink, Send, Users } from "lucide-react"
import { EventDateDisplay } from "./EventDateDisplay"

type SectionTitles = {
  aimAndScope: string
  topics: string
  committees: string
  submissionDates: string
  submission?: string
}

type DateRow = { label: string; date: string; supersededDate?: string }

type CommitteeMember = { name: string; affiliation: string }

interface ProgramEventSectionsProps {
  aimAndScope: readonly string[]
  topics: readonly string[]
  sectionTitles: SectionTitles
  committeesNote: string
  submissionDates: readonly DateRow[]
  focus?: string
  focusLabel?: string
  chairs?: readonly CommitteeMember[]
  submissionIntro?: string
  submissionCmtUrl?: string
  submissionButtonLabel?: string
}

export function ProgramEventSections({
  aimAndScope,
  topics,
  sectionTitles,
  committeesNote,
  submissionDates,
  focus,
  focusLabel,
  chairs,
  submissionIntro,
  submissionCmtUrl,
  submissionButtonLabel = "Submit Paper",
}: ProgramEventSectionsProps) {
  return (
    <div className="mt-6 space-y-8 border-t border-slate-100 pt-6">
      {focus && focusLabel ? (
        <p className="rounded-xl bg-primary-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
          <span className="font-semibold text-primary-800">{focusLabel}</span> {focus}
        </p>
      ) : null}

      <section>
        <h3 className="font-serif text-lg text-primary-900 sm:text-xl">
          {sectionTitles.aimAndScope}
        </h3>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {aimAndScope.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-serif text-lg text-primary-900 sm:text-xl">
          {sectionTitles.topics}
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {topics.map((topic) => (
            <li
              key={topic}
              className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="flex items-center gap-2 font-serif text-lg text-primary-900 sm:text-xl">
          <Users className="h-5 w-5 text-primary-500" />
          {sectionTitles.committees}
        </h3>
        {chairs && chairs.length > 0 ? (
          <div className="mt-3">
            <ul className="space-y-2">
              {chairs.map((person) => (
                <li
                  key={`${person.name}-${person.affiliation}`}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700"
                >
                  <span className="font-medium text-slate-900">{person.name}</span>
                  {person.affiliation ? (
                    <span className="text-slate-600">, {person.affiliation}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {committeesNote}
          </p>
        )}
      </section>

      <section>
        <h3 className="flex items-center gap-2 font-serif text-lg text-primary-900 sm:text-xl">
          <CalendarDays className="h-5 w-5 text-primary-500" />
          {sectionTitles.submissionDates}
        </h3>
        <ul className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          {submissionDates.map((row, i) => (
            <li
              key={row.label}
              className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <span className="font-medium text-slate-800">{row.label}</span>
              <EventDateDisplay
                date={row.date}
                supersededDate={row.supersededDate}
                className="text-slate-600"
              />
            </li>
          ))}
        </ul>
      </section>

      {submissionIntro && submissionCmtUrl && sectionTitles.submission ? (
        <section>
          <h3 className="flex items-center gap-2 font-serif text-lg text-primary-900 sm:text-xl">
            <Send className="h-5 w-5 text-primary-500" />
            {sectionTitles.submission}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {submissionIntro}
          </p>
          <a
            href={submissionCmtUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-400 via-accent-500 to-lime-400 px-6 py-3 text-sm font-semibold text-primary-950 shadow-lg shadow-accent-500/30 transition-all hover:brightness-110 hover:shadow-accent-400/40"
          >
            {submissionButtonLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      ) : null}
    </div>
  )
}
