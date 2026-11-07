import { Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { StatusBadge } from '@/features/matching/StatusBadge'
import { useMatches } from '@/hooks/useMatches'
import { useCompareStore } from '@/store/compareStore'
import { formatDeadline } from '@/utils/date'
import { formatRupees, levelLabel } from '@/utils/format'

const PERIOD = { 'one-time': 'one-time', yearly: 'per year', monthly: 'per month' } as const

export default function Compare() {
  const ids = useCompareStore((s) => s.ids)
  const toggle = useCompareStore((s) => s.toggle)
  const clear = useCompareStore((s) => s.clear)
  const matches = useMatches()
  const picked = ids.flatMap((id) => matches.find((m) => m.scholarship.id === id) ?? [])

  if (picked.length === 0) {
    return (
      <>
        <PageHeader title="Compare" subtitle="Put up to three scholarships side by side." />
        <EmptyState
          icon={Scale}
          title="Nothing to compare yet"
          action={
            <Link to={ROUTES.discover} className={buttonClass()}>
              Choose scholarships
            </Link>
          }
        >
          Tick Compare on scholarship cards in Discover, then come back here.
        </EmptyState>
      </>
    )
  }

  const rows: Array<[string, (m: (typeof picked)[number]) => React.ReactNode]> = [
    ['Your result', (m) => <StatusBadge verdict={m.result.verdict} />],
    ['Provider', (m) => m.scholarship.provider],
    ['Amount', (m) => `${formatRupees(m.scholarship.amount.value)} ${PERIOD[m.scholarship.amount.period]}`],
    ['Deadline', (m) => formatDeadline(m.scholarship.deadline)],
    ['Levels', (m) => m.scholarship.rules.levels?.map(levelLabel).join(', ') ?? 'Any'],
    ['Income limit', (m) => (m.scholarship.rules.maxIncome ? formatRupees(m.scholarship.rules.maxIncome) : 'None listed')],
    ['Minimum marks', (m) => (m.scholarship.rules.minPercent ? `${m.scholarship.rules.minPercent}%` : 'None listed')],
    ['Documents', (m) => m.scholarship.requiredDocuments.join(', ')],
    [
      'Not met',
      (m) => {
        const failed = m.result.criteria.filter((c) => c.result === 'not-met')
        return failed.length ? failed.map((c) => c.message).join(' ') : 'Nothing you know of'
      },
    ],
  ]

  return (
    <>
      <PageHeader
        title="Compare"
        subtitle="Differences that matter, side by side."
        actions={
          <Button variant="secondary" size="sm" onClick={clear}>
            Clear all
          </Button>
        }
      />
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Scholarship comparison</caption>
          <thead>
            <tr className="border-b border-line">
              <td className="p-3" />
              {picked.map(({ scholarship: s }) => (
                <th key={s.id} scope="col" className="p-3 align-top">
                  <Link to={ROUTES.scholarship(s.id)} className="font-serif text-lg text-heading hover:underline">
                    {s.title}
                  </Link>
                  <button
                    onClick={() => toggle(s.id)}
                    className="mt-1 block text-xs font-normal text-secondary underline"
                    aria-label={`Remove ${s.title} from comparison`}
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, render]) => (
              <tr key={label} className="border-b border-line last:border-0">
                <th scope="row" className="w-36 p-3 align-top font-medium text-muted">
                  {label}
                </th>
                {picked.map((m) => (
                  <td key={m.scholarship.id} className="p-3 align-top">
                    {render(m)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
