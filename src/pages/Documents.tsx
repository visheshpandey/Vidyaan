import { useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Progress } from '@/components/ui/Progress'
import { readiness } from '@/features/documents/readiness'
import { isActive } from '@/features/applications/transitions'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useDocumentStore } from '@/store/documentStore'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { daysUntil, formatDeadline } from '@/utils/date'

export default function Documents() {
  const { documents, addDocument, setStatus, setExpiry, removeDocument } = useDocumentStore()
  const applications = useTrackerStore((s) => s.applications)
  const notify = useUiStore((s) => s.notify)
  const [name, setName] = useState('')
  const [toRemove, setToRemove] = useState<{ id: string; name: string } | null>(null)
  const titles = new Map(getScholarshipsSync().map((s) => [s.id, s.title]))
  const have = documents.filter((d) => d.status === 'available').length
  const overall = documents.length === 0 ? 0 : Math.round((have / documents.length) * 100)
  const open = applications.filter((a) => isActive(a) || a.status === 'saved')

  const onAdd = (e: FormEvent) => {
    e.preventDefault()
    addDocument(name)
    setName('')
  }

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Track which documents you have. Files are never uploaded; only names and dates are kept in this browser."
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <section aria-labelledby="my-docs">
          <h2 id="my-docs" className="mb-3 font-serif text-2xl text-heading">
            Your documents
          </h2>
          <Card className="space-y-4">
            <form onSubmit={onAdd} className="flex gap-2">
              <label htmlFor="new-doc" className="sr-only">
                New document name
              </label>
              <input
                id="new-doc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Caste certificate…"
                autoComplete="off"
                spellCheck={false}
                maxLength={60}
                className="h-11 min-w-0 flex-1 rounded-control border border-line px-3 text-sm"
              />
              <Button type="submit" disabled={!name.trim()}>
                <Plus size={16} aria-hidden /> Add
              </Button>
            </form>
            {documents.length === 0 ? (
              <p className="text-sm text-muted">No documents yet. Add the ones you usually need.</p>
            ) : (
              <ul className="divide-y divide-line">
                {documents.map((d) => {
                  const days = daysUntil(d.expiry)
                  const expiring = days !== null && days <= 30
                  return (
                    <li
                      key={d.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{d.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge tone={d.status === 'available' ? 'success' : 'warning'}>
                            {d.status === 'available' ? 'Available' : 'Missing'}
                          </Badge>
                          {expiring && days !== null && (
                            <Badge tone="danger">
                              {days < 0 ? 'Expired' : `Expires in ${days} days`}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="text-xs text-muted">
                          <span className="sr-only">Expiry date for {d.name}</span>
                          <input
                            type="date"
                            value={d.expiry ?? ''}
                            onChange={(e) => setExpiry(d.id, e.target.value || undefined)}
                            className="h-11 rounded-control border border-line px-2 text-xs"
                          />
                        </label>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setStatus(d.id, d.status === 'available' ? 'missing' : 'available')
                          }
                        >
                          Mark {d.status === 'available' ? 'missing' : 'available'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Remove ${d.name}`}
                          onClick={() => setToRemove({ id: d.id, name: d.name })}
                        >
                          <Trash2 size={16} aria-hidden />
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </section>

        <section aria-labelledby="readiness">
          <Card className="mb-4">
            <p className="text-sm text-muted">Your readiness</p>
            <p className="tabular font-serif text-5xl text-heading">{overall}%</p>
            <div className="mt-2">
              <Progress
                value={overall}
                label={`${have} of ${documents.length} documents available`}
              />
            </div>
            <p className="mt-2 text-sm text-muted">
              {overall === 100
                ? 'Everything on your list is ready.'
                : 'Add the missing documents to raise your readiness.'}
            </p>
          </Card>
          <h2 id="readiness" className="mb-3 font-serif text-2xl text-heading">
            Application readiness
          </h2>
          {open.length === 0 ? (
            <Card className="text-sm text-muted">
              Start tracking a scholarship to see which documents it needs.
            </Card>
          ) : (
            <ul className="space-y-3">
              {open.map((a) => {
                const r = readiness(a, documents)
                const s = getScholarshipsSync().find((x) => x.id === a.scholarshipId)
                return (
                  <li key={a.id}>
                    <Card>
                      <p className="mb-2 text-sm font-medium">
                        {titles.get(a.scholarshipId) ?? 'Scholarship'}
                      </p>
                      <Progress
                        value={r.percent}
                        label={`${r.ready} of ${r.total} documents ready`}
                      />
                      {r.missing.length > 0 && (
                        <p className="mt-2 text-xs text-muted">Missing: {r.missing.join(', ')}</p>
                      )}
                      {s && (
                        <p className="mt-1 text-xs text-muted">
                          Deadline: {formatDeadline(s.deadline)}
                        </p>
                      )}
                    </Card>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
      <ConfirmDialog
        open={toRemove !== null}
        onOpenChange={(o) => !o && setToRemove(null)}
        title="Remove document?"
        description={`${toRemove?.name ?? 'This document'} will be removed from your list. Applications that need it will show it as missing.`}
        confirmLabel="Remove"
        danger
        onConfirm={() => {
          if (!toRemove) return
          removeDocument(toRemove.id)
          notify(`${toRemove.name} removed`, 'info')
        }}
      />
    </>
  )
}
