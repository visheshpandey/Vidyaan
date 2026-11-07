import {
  Building2,
  CalendarClock,
  GraduationCap,
  HeartHandshake,
  Landmark,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { buttonClass } from '@/components/ui/buttonStyles'
import { ROUTES } from '@/constants/routes'
import { CompareToggle } from '@/features/compare/CompareToggle'
import { StatusBadge } from '@/features/matching/StatusBadge'
import type { Matched } from '@/features/matching/rank'
import { useT } from '@/i18n/useT'
import type { Level } from '@/types/profile'
import type { ProviderType } from '@/types/scholarship'
import { deadlineLabel, formatDeadline } from '@/utils/date'
import { formatRupees, periodLabel } from '@/utils/format'
import { SaveButton } from './SaveButton'

const PROVIDER_ICON: Record<ProviderType, LucideIcon> = {
  government: Landmark,
  private: Building2,
  university: GraduationCap,
  ngo: HeartHandshake,
}
const LEVEL_SHORT: Record<Level, string> = {
  school: 'School',
  diploma: 'Diploma',
  ug: 'UG',
  pg: 'PG',
  phd: 'PhD',
}
/** Horizontal result row: the main list item on Discover, Saved and the dashboard. */
export function ScholarshipRow({ item, as: Heading = 'h2' }: { item: Matched; as?: 'h2' | 'h3' }) {
  const { scholarship: s, result } = item
  const t = useT()
  const Icon = PROVIDER_ICON[s.providerType]
  const levels = s.rules.levels?.map((l) => LEVEL_SHORT[l]).join(', ') ?? 'All levels'
  return (
    <article className="flex gap-4 rounded-card border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(24,59,50,0.05)]">
      <span
        aria-hidden
        className="hidden size-14 shrink-0 place-items-center rounded-card bg-secondary/10 text-secondary sm:grid"
      >
        <Icon size={26} />
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <Heading className="font-serif text-xl leading-snug text-heading">
            <Link to={ROUTES.scholarship(s.id)} className="hover:underline">
              {s.title}
            </Link>
          </Heading>
          <p className="text-sm text-muted">{s.provider}</p>
        </div>
        <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <div>
            <dt className="sr-only">Amount</dt>
            <dd className="tabular font-semibold text-ink">
              {formatRupees(s.amount.value)}{' '}
              <span className="font-normal text-muted">{periodLabel(s.amount.period)}</span>
            </dd>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <CalendarClock size={14} aria-hidden />
            <dt className="sr-only">Deadline</dt>
            <dd>
              {formatDeadline(s.deadline)}
              {s.deadline && ` (${deadlineLabel(s.deadline)})`}
            </dd>
          </div>
          <div className="text-muted">
            <dt className="sr-only">Level</dt>
            <dd>{levels}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge verdict={result.verdict} />
          {s.dataType === 'sample' && <Badge>{t('common.demoData')}</Badge>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <SaveButton id={s.id} title={s.title} compact />
        <div className="flex flex-col items-end gap-1">
          <CompareToggle id={s.id} title={s.title} />
          <Link to={ROUTES.scholarship(s.id)} className={buttonClass('primary', 'sm')}>
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}
