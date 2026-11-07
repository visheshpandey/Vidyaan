import { useState } from 'react'
import { ArrowLeft, ClipboardList, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/Modal'
import { MAX_NOTES_LENGTH } from '@/constants/limits'
import { ROUTES } from '@/constants/routes'
import { StatusMenu } from '@/features/applications/StatusMenu'
import { StatusPill } from '@/features/applications/StatusPill'
import { STATUS_LABELS } from '@/features/applications/transitions'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useDocumentStore } from '@/store/documentStore'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { formatDateTime, formatDeadline } from '@/utils/date'

export default function ApplicationDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const app = useTrackerStore((s) => s.applications.find((a) => a.id === id))
  const setNotes = useTrackerStore((s) => s.setNotes)
  const remove = useTrackerStore((s) => s.removeApplication)
  const documents = useDocumentStore((s) => s.documents)
  const notify = useUiStore((s) => s.notify)
  const [confirm, setConfirm] = useState(false)

  if (!app) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Application not found"
        action={
          <Link to={ROUTES.applications} className={buttonClass()}>
            Back to applications
          </Link>
        }
      >
        It may have been removed.
      </EmptyState>
    )
  }
  const s = getScholarshipsSync().find((x) => x.id === app.scholarshipId)
  const title = s?.title ?? 'Scholarship'
  const have = (name: string) => documents.some((d) => d.name === name && d.status === 'available')

  return (
    <div className="space-y-6">
      <Link to={ROUTES.applications} className="inline-flex items-center gap-1 text-sm text-secondary underline">
        <ArrowLeft size={16} aria-hidden /> All applications
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StatusPill status={app.status} />
          <h1 className="mt-1 font-serif text-3xl text-primary">{title}</h1>
          <p className="text-sm text-muted">
            {s?.provider} · Deadline: {formatDeadline(s?.deadline ?? null)}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusMenu app={app} title={title} />
          {s && (
            <Link to={ROUTES.scholarship(s.id)} className={buttonClass('secondary', 'sm')}>
              View scholarship
            </Link>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-serif text-xl text-primary">Notes</h2>
          <label htmlFor="notes" className="sr-only">
            Notes for {title}
          </label>
          <textarea
            id="notes"
            value={app.notes}
            maxLength={MAX_NOTES_LENGTH}
            onChange={(e) => setNotes(app.id, e.target.value)}
            rows={6}
            placeholder="Login details location, reference numbers, who to call…"
            className="mt-2 w-full rounded-control border border-line bg-surface p-3 text-sm"
          />
          <p className="mt-1 text-right text-xs text-muted tabular">
            {app.notes.length}/{MAX_NOTES_LENGTH}
          </p>
        </Card>
        <div className="space-y-6">
          <Card>
            <h2 className="font-serif text-xl text-primary">Document checklist</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {app.documentChecklist.map((name) => (
                <li key={name} className="flex justify-between gap-2">
                  {name}
                  <span className={have(name) ? 'text-success' : 'text-warning'}>
                    {have(name) ? 'Ready' : 'Missing'}
                  </span>
                </li>
              ))}
            </ul>
            <Link to={ROUTES.documents} className="mt-3 inline-block text-sm font-medium text-secondary underline">
              Manage documents
            </Link>
          </Card>
          <Card>
            <h2 className="font-serif text-xl text-primary">History</h2>
            <ol className="mt-2 space-y-2 text-sm">
              {[...app.history].reverse().map((h, i) => (
                <li key={i}>
                  {STATUS_LABELS[h.status]}
                  <time dateTime={h.at} className="block text-xs text-muted">
                    {formatDateTime(h.at)}
                  </time>
                </li>
              ))}
            </ol>
          </Card>
          <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
            <Trash2 size={16} aria-hidden /> Stop tracking
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Stop tracking?"
        description={`${title} will be removed from your tracker. Your notes for it will be deleted.`}
        confirmLabel="Stop tracking"
        danger
        onConfirm={() => {
          remove(app.id)
          notify('Removed from tracker', 'info')
          navigate(ROUTES.applications)
        }}
      />
    </div>
  )
}
