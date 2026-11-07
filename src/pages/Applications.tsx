import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { Board } from '@/features/applications/Board'
import { ApplicationListItem } from '@/features/applications/ApplicationListItem'
import { countByStatus, filterByStatus, type StatusFilter } from '@/features/applications/selectors'
import { STATUS_LABELS } from '@/features/applications/transitions'
import { useScholarships } from '@/hooks/useScholarships'
import { useTrackerStore } from '@/store/trackerStore'
import { APPLICATION_STATUSES } from '@/types/tracker'

/** Tracker with a list and a drag-and-drop board of applications by status. */
export default function Applications() {
  const { scholarships } = useScholarships()
  const applications = useTrackerStore((s) => s.applications)
  const [view, setView] = useState<'list' | 'board'>('board')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const byId = new Map(scholarships.map((s) => [s.id, s]))
  const shown = filterByStatus(applications, filter)

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Track every application from saved to disbursed."
      />
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
          <div role="group" aria-label="View" className="mb-4 hidden gap-2 lg:flex">
            {(['list', 'board'] as const).map((v) => (
              <button
                key={v}
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`min-h-10 rounded-control border px-4 text-sm capitalize ${
                  view === v
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-surface hover:bg-canvas'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {view === 'board' && (
            <div className="hidden lg:block">
              <Board applications={applications} />
            </div>
          )}
          <div className={view === 'board' ? 'lg:hidden' : ''}>
            <div
              role="group"
              aria-label="Filter by status"
              className="mb-4 flex gap-2 overflow-x-auto pb-1"
            >
              {(['all', ...APPLICATION_STATUSES] as const).map((st) => (
                <button
                  key={st}
                  aria-pressed={filter === st}
                  onClick={() => setFilter(st)}
                  className={`min-h-10 shrink-0 rounded-full border px-4 text-sm ${
                    filter === st
                      ? 'border-primary bg-primary text-white'
                      : 'border-line bg-surface hover:bg-canvas'
                  }`}
                >
                  {st === 'all'
                    ? `All (${applications.length})`
                    : `${STATUS_LABELS[st]} (${countByStatus(applications, st)})`}
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
                {shown.map((a) => (
                  <li key={a.id}>
                    <ApplicationListItem app={a} scholarship={byId.get(a.scholarshipId)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  )
}
