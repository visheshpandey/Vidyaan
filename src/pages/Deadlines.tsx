import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { CalendarClock, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { collectEvents } from '@/features/deadlines/events'
import { buildIcs } from '@/features/deadlines/ics'
import { downloadText } from '@/services/exportService'
import { useScholarships } from '@/hooks/useScholarships'
import { useDocumentStore } from '@/store/documentStore'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { deadlineLabel, formatDeadline } from '@/utils/date'

export default function Deadlines() {
  const { scholarships } = useScholarships()
  const saved = useTrackerStore((s) => s.saved)
  const applications = useTrackerStore((s) => s.applications)
  const documents = useDocumentStore((s) => s.documents)
  const notify = useUiStore((s) => s.notify)
  const [month, setMonth] = useState(() => startOfMonth(new Date()))

  const events = useMemo(
    () => collectEvents(scholarships, saved, applications, documents),
    [scholarships, saved, applications, documents],
  )
  const days = eachDayOfInterval({ start: startOfWeek(month), end: endOfWeek(endOfMonth(month)) })
  const [todayKey] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const upcoming = events.filter((e) => e.date >= todayKey)
  const unknown = scholarships.filter((s) => saved.includes(s.id) && !s.deadline)

  return (
    <>
      <PageHeader
        title="Deadlines"
        subtitle="Dates for scholarships you saved or track, and documents that expire."
        actions={
          <Button
            variant="secondary"
            size="sm"
            disabled={upcoming.length === 0}
            onClick={() => {
              const ok = downloadText('grantly-deadlines.ics', buildIcs(upcoming), 'text/calendar')
              notify(
                ok
                  ? 'Calendar file downloaded'
                  : 'Could not download the calendar file. Please try again.',
                ok ? 'success' : 'error',
              )
            }}
          >
            <Download size={16} aria-hidden /> Add to calendar (.ics)
          </Button>
        }
      />
      {events.length === 0 && unknown.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No deadlines yet"
          action={
            <Link to={ROUTES.discover} className="text-sm font-medium text-secondary underline">
              Save a scholarship to see its date here
            </Link>
          }
        >
          Deadlines for saved and tracked scholarships appear here.
        </EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Previous month"
                onClick={() => setMonth(addMonths(month, -1))}
              >
                <ChevronLeft size={18} aria-hidden />
              </Button>
              <h2 className="font-serif text-xl text-heading" aria-live="polite">
                {format(month, 'MMMM yyyy')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Next month"
                onClick={() => setMonth(addMonths(month, 1))}
              >
                <ChevronRight size={18} aria-hidden />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted" aria-hidden>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>
            <ul className="mt-1 grid grid-cols-7 gap-1">
              {days.map((d) => {
                const key = format(d, 'yyyy-MM-dd')
                const here = events.filter((e) => e.date === key)
                return (
                  <li
                    key={key}
                    className={`min-h-12 rounded-control border p-1 text-xs ${
                      isSameMonth(d, month) ? 'border-line' : 'border-transparent text-muted'
                    } ${key === todayKey ? 'bg-accent/30' : ''}`}
                  >
                    <span aria-label={format(d, 'd MMMM')}>{format(d, 'd')}</span>
                    {here.length > 0 && (
                      <span className="mt-1 block rounded bg-primary px-1 text-white">
                        {here.length}
                        <span className="sr-only">
                          {' '}
                          event{here.length === 1 ? '' : 's'}: {here.map((e) => e.title).join(', ')}
                        </span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>

          <section aria-labelledby="upcoming">
            <h2 id="upcoming" className="mb-3 font-serif text-2xl text-heading">
              Upcoming
            </h2>
            <ul className="space-y-2">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <Card className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-medium">
                        {e.scholarshipId ? (
                          <Link
                            to={ROUTES.scholarship(e.scholarshipId)}
                            className="hover:underline"
                          >
                            {e.title}
                          </Link>
                        ) : (
                          e.title
                        )}
                      </p>
                      <p className="text-xs text-muted">{formatDeadline(e.date)}</p>
                    </div>
                    <span className="text-xs font-medium text-secondary">
                      {deadlineLabel(e.date)}
                    </span>
                  </Card>
                </li>
              ))}
              {unknown.map((s) => (
                <li key={s.id}>
                  <Card className="p-4">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted">Deadline: Check official site</p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </>
  )
}
