import type { Application, ApplicationStatus } from '@/types/tracker'

export type StatusFilter = ApplicationStatus | 'all'

/** Applications in one status, or all of them. */
export function filterByStatus(apps: Application[], filter: StatusFilter): Application[] {
  return filter === 'all' ? apps : apps.filter((a) => a.status === filter)
}

/** How many applications are in the given status. */
export function countByStatus(apps: Application[], status: ApplicationStatus): number {
  return apps.filter((a) => a.status === status).length
}
