import { ExternalLink, SearchX } from 'lucide-react'
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
import { CompareToggle } from '@/features/compare/CompareToggle'
import { useMatches } from '@/hooks/useMatches'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { daysUntil, deadlineLabel, formatDeadline } from '@/utils/date'
import { formatRupees, periodLabel } from '@/utils/format'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'documents', label: 'Documents' },
  { id: 'apply', label: 'How to apply' },
]

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
  const days = daysUntil(s.deadline)

  return (
    <article className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to={ROUTES.dashboard} className="underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to={ROUTES.discover} className="underline">
              Discover
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {s.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <header>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge verdict={result.verdict} />
              {s.dataType === 'sample' && <Badge>Demo data</Badge>}
            </div>
            <h1 className="font-serif text-3xl text-heading">{s.title}</h1>
            <p className="text-muted">{s.provider}</p>
          </header>

          <nav aria-label="On this page" className="-mx-1 overflow-x-auto border-b border-line">
            <ul className="flex gap-1 px-1">
              {SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-muted hover:text-heading"
                  >
                    {sec.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section id="about" aria-labelledby="about-h" className="scroll-mt-24">
            <h2 id="about-h" className="font-serif text-xl text-heading">
              About
            </h2>
            <p className="mt-2 max-w-3xl text-ink">{s.description}</p>
          </section>

          <section id="eligibility" aria-labelledby="elig-h" className="scroll-mt-24">
            <Card>
              <h2 id="elig-h" className="font-serif text-xl text-heading">
                Why this result
              </h2>
              <EligibilityBreakdown result={result} />
            </Card>
          </section>

          <section id="benefits" aria-labelledby="ben-h" className="scroll-mt-24">
            <h2 id="ben-h" className="font-serif text-xl text-heading">
              Benefits
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {s.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>

          <section id="documents" aria-labelledby="doc-h" className="scroll-mt-24">
            <h2 id="doc-h" className="font-serif text-xl text-heading">
              Documents you will need
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {s.requiredDocuments.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>

          <section id="apply" aria-labelledby="apply-h" className="scroll-mt-24">
            <h2 id="apply-h" className="font-serif text-xl text-heading">
              How to apply
            </h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
              {s.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <p className="text-xs text-muted">
            {s.dataType === 'sample'
              ? 'Demo data: details are illustrative. Confirm amounts, rules and dates on the official site.'
              : `Last verified ${s.lastVerifiedAt}.`}{' '}
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Source
            </a>
          </p>
        </div>

        <aside aria-label="Summary" className="lg:sticky lg:top-6 lg:self-start">
          <Card className="space-y-4">
            <div>
              <p className="text-sm text-muted">Award amount</p>
              <p className="tabular font-serif text-3xl text-heading">
                {formatRupees(s.amount.value)}
              </p>
              <p className="text-sm text-muted">
                {periodLabel(s.amount.period)}
                {s.dataType === 'sample' && ' (reported)'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Deadline</p>
              <p className="font-serif text-xl text-heading">{formatDeadline(s.deadline)}</p>
              {days !== null && (
                <p
                  className={
                    days >= 0 && days <= 30
                      ? 'text-sm font-medium text-warning'
                      : 'text-sm text-muted'
                  }
                >
                  {deadlineLabel(s.deadline)}
                </p>
              )}
            </div>
            {tracked ? (
              <Link
                to={ROUTES.application(tracked.id)}
                className={buttonClass('primary', 'md', 'w-full')}
              >
                Open tracker
              </Link>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  const app = startTracking(s.id, s.requiredDocuments)
                  notify('Added to your tracker')
                  void navigate(ROUTES.application(app.id))
                }}
              >
                Start tracking
              </Button>
            )}
            <a
              href={s.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('secondary', 'md', 'w-full')}
            >
              Visit official website <ExternalLink size={14} aria-hidden />
            </a>
            <div className="flex items-center justify-between">
              <SaveButton id={s.id} title={s.title} />
              <CompareToggle id={s.id} title={s.title} />
            </div>
            <p className="text-xs text-muted">
              Vidyaan never submits applications for you. You apply on the official site.
            </p>
          </Card>
        </aside>
      </div>
    </article>
  )
}
