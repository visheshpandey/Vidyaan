import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/types/tracker'

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: 'Saved',
  preparing: 'Preparing',
  submitted: 'Submitted',
  under_review: 'Under review',
  approved: 'Approved',
  disbursed: 'Disbursed',
  not_selected: 'Not selected',
}

/** Creates a new application in the Saved stage. */
export function createApplication(
  scholarshipId: string,
  now: string,
  checklist: string[],
): Application {
  return {
    id: `app-${scholarshipId}`,
    scholarshipId,
    status: 'saved',
    notes: '',
    documentChecklist: checklist,
    createdAt: now,
    updatedAt: now,
    history: [{ status: 'saved', at: now }],
    stepsDone: [],
  }
}

/** Moves an application to a new status, recording history and updatedAt. */
export function applyStatus(app: Application, status: ApplicationStatus, now: string): Application {
  if (app.status === status || !APPLICATION_STATUSES.includes(status)) return app
  return { ...app, status, updatedAt: now, history: [...app.history, { status, at: now }] }
}

/** Applications that are still in progress (not finished either way). */
export function isActive(app: Application): boolean {
  return app.status !== 'disbursed' && app.status !== 'not_selected' && app.status !== 'saved'
}
