import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import clsx from 'clsx'
import { GripVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useT } from '@/i18n/useT'
import { useScholarships } from '@/hooks/useScholarships'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/types/tracker'
import { formatDeadline } from '@/utils/date'
import { StatusMenu } from './StatusMenu'

function Card({ app, title, deadline }: { app: Application; title: string; deadline: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app.id })
  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined}
      className={clsx(
        'rounded-control border border-line bg-surface p-3 text-sm shadow-sm',
        isDragging && 'relative z-20 shadow-lg',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          aria-label={`Drag ${title}. Press space to pick up, arrow keys to move, space to drop.`}
          className="grid size-10 shrink-0 cursor-grab touch-none place-items-center rounded text-muted hover:bg-canvas"
        >
          <GripVertical size={16} aria-hidden />
        </button>
        <div className="min-w-0">
          <Link
            to={ROUTES.application(app.id)}
            className="font-medium text-heading hover:underline"
          >
            {title}
          </Link>
          <p className="text-xs text-muted">{deadline}</p>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <StatusMenu app={app} title={title} />
      </div>
    </div>
  )
}

const COLUMN_ACCENT: Record<ApplicationStatus, string> = {
  saved: 'border-t-muted',
  preparing: 'border-t-warning',
  submitted: 'border-t-secondary',
  under_review: 'border-t-accent',
  approved: 'border-t-success',
  disbursed: 'border-t-success',
  not_selected: 'border-t-danger',
}

function Column({
  status,
  children,
  count,
}: {
  status: ApplicationStatus
  children: React.ReactNode
  count: number
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const t = useT()
  return (
    <section
      ref={setNodeRef}
      aria-label={`${t(`status.${status}`)}, ${count} applications`}
      className={clsx(
        'flex min-h-40 w-60 shrink-0 flex-col gap-2 rounded-card border-t-4 bg-canvas p-2',
        COLUMN_ACCENT[status],
        isOver && 'ring-2 ring-secondary',
      )}
    >
      <h2 className="px-1 text-sm font-medium text-ink">
        {t(`status.${status}`)} <span className="tabular text-muted">({count})</span>
      </h2>
      {children}
    </section>
  )
}

/** Kanban view. Drag with mouse, touch or keyboard; the "Move to" menu on each card works without dragging. */
export function Board({ applications }: { applications: Application[] }) {
  const { scholarships } = useScholarships()
  const setStatus = useTrackerStore((s) => s.setStatus)
  const notify = useUiStore((s) => s.notify)
  const t = useT()
  const byId = new Map(scholarships.map((s) => [s.id, s]))
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return
    const app = applications.find((a) => a.id === active.id)
    const status = over.id as ApplicationStatus
    if (!app || app.status === status || !APPLICATION_STATUSES.includes(status)) return
    setStatus(app.id, status)
    notify(
      `${byId.get(app.scholarshipId)?.title ?? 'Application'} moved to ${t(`status.${status}`)}`,
    )
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {APPLICATION_STATUSES.map((status) => {
          const items = applications.filter((a) => a.status === status)
          return (
            <Column key={status} status={status} count={items.length}>
              {items.map((a) => {
                const s = byId.get(a.scholarshipId)
                return (
                  <Card
                    key={a.id}
                    app={a}
                    title={s?.title ?? 'Scholarship'}
                    deadline={formatDeadline(s?.deadline ?? null)}
                  />
                )
              })}
            </Column>
          )
        })}
      </div>
    </DndContext>
  )
}
