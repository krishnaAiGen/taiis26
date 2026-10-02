export type RegistrationFeeCategory = {
  name: string
  earlyBird: { usd: number; ntd: number }
  late: { usd: number; ntd: number }
}

function formatFee(usd: number, ntd: number) {
  return `US$${usd.toLocaleString("en-US")} / NT$${ntd.toLocaleString("en-US")}`
}

export function RegistrationFeeTable({
  categories,
  earlyBirdHeader,
  lateHeader,
}: {
  categories: readonly RegistrationFeeCategory[]
  earlyBirdHeader: { title: string; subtitle: string }
  lateHeader: { title: string; subtitle: string }
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 font-semibold text-slate-800 sm:px-5">
                Registration Category
              </th>
              <th className="px-4 py-3 font-semibold text-primary-800 sm:px-5">
                <span className="block">{earlyBirdHeader.title}</span>
                <span className="mt-0.5 block text-xs font-medium text-primary-700/90">
                  {earlyBirdHeader.subtitle}
                </span>
              </th>
              <th className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                <span className="block">{lateHeader.title}</span>
                <span className="mt-0.5 block text-xs font-medium text-slate-500">
                  {lateHeader.subtitle}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((row, i) => (
              <tr
                key={row.name}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/80"}
              >
                <td className="px-4 py-3.5 font-medium text-slate-800 sm:px-5">
                  {row.name}
                </td>
                <td className="px-4 py-3.5 text-slate-700 sm:px-5">
                  {formatFee(row.earlyBird.usd, row.earlyBird.ntd)}
                </td>
                <td className="px-4 py-3.5 text-slate-700 sm:px-5">
                  {formatFee(row.late.usd, row.late.ntd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
