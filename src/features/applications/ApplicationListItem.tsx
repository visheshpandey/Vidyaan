import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/constants/routes'
import type { Application } from '@/types/tracker'
import type { Scholarship } from '@/types/scholarship'
import { deadlineLabel, formatDeadline } from '@/utils/date'
import { StatusMenu } from './StatusMenu'
import { StatusPill } from './StatusPill'

/** One application in the list view: status, title, provider, deadline and the "Move to" menu. */
export function ApplicationListItem({
  app,
  scholarship,
}: {
  app: Application
  scholarship?: Scholarship
}) {
  const title = scholarship?.title ?? 'Scholarship'
  const deadline = scholarship?.deadline ?? null
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <StatusPill status={app.status} />
        <h2 className="mt-1 font-serif text-lg text-heading">
          <Link to={ROUTES.application(app.id)} className="hover:underline">
            {title}
          </Link>
        </h2>
        <p className="text-sm text-muted">
          {scholarship?.provider} · Deadline: {formatDeadline(deadline)}
          {deadline && ` (${deadlineLabel(deadline)})`}
        </p>
      </div>
      <StatusMenu app={app} title={title} />
    </Card>
  )
}
