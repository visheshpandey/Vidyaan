import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { StatusMenu } from '@/features/applications/StatusMenu'
import { StatusPill } from '@/features/applications/StatusPill'
import { STATUS_LABELS } from '@/features/applications/transitions'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useTrackerStore } from '@/store/trackerStore'
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/types/tracker'
import { deadlineLabel, formatDeadline } from '@/utils/date'

export default function Applications() {
  const applications = useTrackerStore((s) => s.applications)
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const byId = new Map(getScholarshipsSync().map((s) => [s.id, s]))
  const shown = applications.filter((a) => filter === 'all' || a.status === filter)
  const count = (st: ApplicationStatus) => applications.filter((a) => a.status === st).length

  return (
    <>
      <PageHeader title="Applications" subtitle="Track every application from saved to disbursed." />
      {applications.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          action={
            <Link to={ROUTES.discover} className={buttonClass()}>
              Find a scholarship
            </Link>
          }
        >
          Open a scholarship and choose Start tracking to add it here.
        </EmptyState>
      ) : (
        <>
          <div role="group" aria-label="Filter by status" className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {(['all', ...APPLICATION_STATUSES] as const).map((st) => (
              <button
                key={st}
                aria-pressed={filter === st}
                onClick={() => setFilter(st)}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm ${
                  filter === st ? 'border-primary bg-primary text-white' : 'border-line bg-surface hover:bg-canvas'
                }`}
              >
                {st === 'all' ? `All (${applications.length})` : `${STATUS_LABELS[st]} (${count(st)})`}
              </button>
            ))}
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {shown.length} applications shown
          </p>
          {shown.length === 0 ? (
            <Card className="text-sm text-muted">No applications in this stage.</Card>
          ) : (
            <ul className="space-y-3">
              {shown.map((a) => {
                const s = byId.get(a.scholarshipId)
                const title = s?.title ?? 'Scholarship'
                return (
                  <li key={a.id}>
                    <Card className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <StatusPill status={a.status} />
                        <h2 className="mt-1 font-serif text-lg text-primary">
                          <Link to={ROUTES.application(a.id)} className="hover:underline">
                            {title}
                          </Link>
                        </h2>
                        <p className="text-sm text-muted">
                          {s?.provider} · Deadline: {formatDeadline(s?.deadline ?? null)}
                          {s?.deadline && ` (${deadlineLabel(s.deadline)})`}
                        </p>
                      </div>
                      <StatusMenu app={a} title={title} />
                    </Card>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </>
  )
}
