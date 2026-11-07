import { ArrowLeft, ExternalLink, SearchX } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ROUTES } from '@/constants/routes'
import { EligibilityBreakdown } from '@/features/matching/EligibilityBreakdown'
import { StatusBadge } from '@/features/matching/StatusBadge'
import { SaveButton } from '@/features/scholarships/SaveButton'
import { useMatches } from '@/hooks/useMatches'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { formatDeadline } from '@/utils/date'
import { formatRupees } from '@/utils/format'

const PERIOD = { 'one-time': 'one-time', yearly: 'per year', monthly: 'per month' } as const

export default function ScholarshipDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const matches = useMatches()
  const tracked = useTrackerStore((s) => s.applications.find((a) => a.scholarshipId === id))
  const startTracking = useTrackerStore((s) => s.startTracking)
  const notify = useUiStore((s) => s.notify)
  const item = matches.find((m) => m.scholarship.id === id)

  if (!item) {
    return (
      <EmptyState
        icon={SearchX}
        title="Scholarship not found"
        action={
          <Link to={ROUTES.discover} className={buttonClass()}>
            Back to Discover
          </Link>
        }
      >
        We could not find that scholarship.
      </EmptyState>
    )
  }
  const { scholarship: s, result } = item

  return (
    <article className="space-y-6">
      <Link to={ROUTES.discover} className="inline-flex items-center gap-1 text-sm text-secondary underline">
        <ArrowLeft size={16} aria-hidden /> Back to Discover
      </Link>

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge verdict={result.verdict} />
          {s.dataType === 'sample' && <Badge>Demo data</Badge>}
        </div>
        <h1 className="font-serif text-3xl text-primary">{s.title}</h1>
        <p className="text-muted">{s.provider}</p>
        <p className="mt-3 max-w-3xl text-ink">{s.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <SaveButton id={s.id} title={s.title} />
          {tracked ? (
            <Link to={ROUTES.application(tracked.id)} className={buttonClass('primary', 'sm')}>
              Open tracker
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                const app = startTracking(s.id, s.requiredDocuments)
                notify('Added to your tracker')
                navigate(ROUTES.application(app.id))
              }}
            >
              Start tracking
            </Button>
          )}
          <a href={s.applicationUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'sm')}>
            View official application <ExternalLink size={14} aria-hidden />
          </a>
        </div>
        <p className="mt-2 text-xs text-muted">
          Vidyaan never submits applications for you. You apply on the official site.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="font-serif text-xl text-primary">Why this result</h2>
            <EligibilityBreakdown result={result} />
          </Card>
          <Card>
            <h2 className="font-serif text-xl text-primary">How to apply</h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
              {s.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="font-serif text-xl text-primary">At a glance</h2>
            <dl className="mt-2 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Amount</dt>
                <dd className="tabular font-semibold">
                  {formatRupees(s.amount.value)} {PERIOD[s.amount.period]}
                  {s.dataType === 'sample' && <span className="font-normal text-muted"> (reported)</span>}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Deadline</dt>
                <dd className="font-semibold">{formatDeadline(s.deadline)}</dd>
              </div>
            </dl>
            <h3 className="mt-4 text-sm font-medium">Benefits</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {s.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="font-serif text-xl text-primary">Documents you will need</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {s.requiredDocuments.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Card>
          <p className="text-xs text-muted">
            {s.dataType === 'sample'
              ? 'Demo data: details are illustrative. Confirm amounts, rules and dates on the official site.'
              : `Last verified ${s.lastVerifiedAt}.`}{' '}
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Source
            </a>
          </p>
        </div>
      </div>
    </article>
  )
}
