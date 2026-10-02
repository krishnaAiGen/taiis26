const HARD_DEADLINE = "(Hard Deadline)"

function DateText({ date, className = "" }: { date: string; className?: string }) {
  if (!date.includes(HARD_DEADLINE)) {
    return <span className={className}>{date}</span>
  }

  const main = date.replace(HARD_DEADLINE, "").trim()

  return (
    <span className={className}>
      {main}{" "}
      <span className="font-semibold text-red-600">{HARD_DEADLINE}</span>
    </span>
  )
}

export function EventDateDisplay({
  date,
  supersededDate,
  className = "",
}: {
  date: string
  supersededDate?: string
  className?: string
}) {
  if (!supersededDate) {
    return <DateText date={date} className={className} />
  }

  return (
    <span className={className}>
      <span className="line-through opacity-60">{supersededDate}</span>
      <span className="ml-1.5 inline whitespace-nowrap">
        <DateText date={date} />
      </span>
    </span>
  )
}
