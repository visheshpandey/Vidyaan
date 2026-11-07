import { CalendarClock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/constants/routes'
import { StatusBadge } from '@/features/matching/StatusBadge'
import type { Matched } from '@/features/matching/rank'
import { deadlineLabel, formatDeadline } from '@/utils/date'
import { formatRupees } from '@/utils/format'
import { SaveButton } from './SaveButton'

const PERIOD = { 'one-time': 'one-time', yearly: 'per year', monthly: 'per month' } as const

/** The signature card: used on Discover, Dashboard and Saved. */
export function ScholarshipBrief({ item, as: Heading = 'h2' }: { item: Matched; as?: 'h2' | 'h3' }) {
  const { scholarship: s, result } = item
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge verdict={result.verdict} />
        {s.dataType === 'sample' && <Badge>Demo data</Badge>}
      </div>
      <div>
        <Heading className="font-serif text-xl leading-snug text-primary">
          <Link to={ROUTES.scholarship(s.id)} className="hover:underline">
            {s.title}
          </Link>
        </Heading>
        <p className="text-sm text-muted">{s.provider}</p>
      </div>
      <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div>
          <dt className="sr-only">Amount</dt>
          <dd className="tabular font-semibold text-ink">
            {formatRupees(s.amount.value)} <span className="font-normal text-muted">{PERIOD[s.amount.period]}</span>
          </dd>
        </div>
        <div className="flex items-center gap-1 text-muted">
          <CalendarClock size={14} aria-hidden />
          <dt className="sr-only">Deadline</dt>
          <dd>
            {formatDeadline(s.deadline)}
            {s.deadline && ` · ${deadlineLabel(s.deadline)}`}
          </dd>
        </div>
      </dl>
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <Link to={ROUTES.scholarship(s.id)} className="text-sm font-medium text-secondary underline">
          See why
        </Link>
        <SaveButton id={s.id} title={s.title} />
      </div>
    </Card>
  )
}
