import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { buildDashboard } from '@/features/dashboard/selectors'
import { rank } from '@/features/matching/rank'
import { ScholarshipBrief } from '@/features/scholarships/ScholarshipBrief'
import { useMatches } from '@/hooks/useMatches'
import { useDocumentStore } from '@/store/documentStore'
import { useProfileStore } from '@/store/profileStore'
import { useTrackerStore } from '@/store/trackerStore'
import { formatDateTime } from '@/utils/date'

function Metric({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="block rounded-card border border-line bg-surface p-5 hover:border-secondary">
      <p className="tabular font-serif text-4xl text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Link>
  )
}

export default function Dashboard() {
  const name = useProfileStore((s) => s.profile?.name)
  const matches = useMatches()
  const saved = useTrackerStore((s) => s.saved)
  const applications = useTrackerStore((s) => s.applications)
  const documents = useDocumentStore((s) => s.documents)
  const data = useMemo(
    () => buildDashboard({ matches, saved, applications, documents }),
    [matches, saved, applications, documents],
  )
  const top = useMemo(
    () => rank(matches.filter((m) => m.result.verdict !== 'not_eligible')).slice(0, 3),
    [matches],
  )

  return (
    <>
      <PageHeader title={`Welcome${name ? `, ${name}` : ''}`} subtitle="Here is where you stand today." />
      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Eligible scholarships" value={data.eligibleCount} to={ROUTES.discover} />
        <Metric label="Need more information" value={data.needsInfoCount} to={ROUTES.discover} />
        <Metric label="Active applications" value={data.activeCount} to={ROUTES.applications} />
        <Metric label="Deadlines in 30 days" value={data.deadlinesSoon.length} to={ROUTES.deadlines} />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="next-steps" className="lg:col-span-2">
          <h2 id="next-steps" className="mb-3 font-serif text-2xl text-primary">
            Your next steps
          </h2>
          {data.nextSteps.length === 0 ? (
            <Card className="text-sm text-muted">You are all caught up. Browse Discover to find more.</Card>
          ) : (
            <ul className="space-y-2">
              {data.nextSteps.map((s) => (
                <li key={s.id}>
                  <Link
                    to={s.to}
                    className="flex min-h-12 items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3 text-sm hover:border-secondary"
                  >
                    {s.text}
                    <ArrowRight size={16} aria-hidden className="shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="activity">
          <h2 id="activity" className="mb-3 font-serif text-2xl text-primary">
            Recent activity
          </h2>
          <Card>
            {data.activity.length === 0 ? (
              <p className="text-sm text-muted">Activity appears here once you start tracking.</p>
            ) : (
              <ul className="space-y-3">
                {data.activity.map((a) => (
                  <li key={a.id} className="text-sm">
                    {a.text}
                    <time dateTime={a.at} className="block text-xs text-muted">
                      {formatDateTime(a.at)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      <section aria-labelledby="top" className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="top" className="font-serif text-2xl text-primary">
            Best matches for you
          </h2>
          <Link to={ROUTES.discover} className="text-sm font-medium text-secondary underline">
            See all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {top.map((m) => (
            <ScholarshipBrief key={m.scholarship.id} item={m} as="h3" />
          ))}
        </div>
      </section>
    </>
  )
}
