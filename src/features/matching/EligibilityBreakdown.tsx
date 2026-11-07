import { CircleAlert, CircleCheck, CircleX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import type { Criterion, EligibilityResult } from '@/types/eligibility'

const ICONS = {
  met: { Icon: CircleCheck, cls: 'text-success', label: 'Met' },
  'not-met': { Icon: CircleX, cls: 'text-danger', label: 'Not met' },
  unknown: { Icon: CircleAlert, cls: 'text-warning', label: 'Needs information' },
} as const

function Row({ c }: { c: Criterion }) {
  const { Icon, cls, label } = ICONS[c.result]
  return (
    <li className="flex gap-3 py-3">
      <Icon className={`mt-0.5 shrink-0 ${cls}`} size={20} aria-hidden />
      <div>
        <p className="text-sm text-ink">
          <span className="sr-only">{label}: </span>
          {c.message}
        </p>
        {c.result === 'unknown' && (
          <Link to={ROUTES.profile} className="text-sm font-medium text-secondary underline">
            Add this to your profile
          </Link>
        )}
      </div>
    </li>
  )
}

/** Plain-language list of every rule and whether the student meets it. */
export function EligibilityBreakdown({ result }: { result: EligibilityResult }) {
  if (result.criteria.length === 0) {
    return <p className="text-sm text-muted">No specific eligibility rules are listed for this scholarship.</p>
  }
  return (
    <ul className="divide-y divide-line">
      {result.criteria.map((c) => (
        <Row key={c.rule} c={c} />
      ))}
    </ul>
  )
}
