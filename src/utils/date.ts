import { differenceInCalendarDays, format, parseISO } from 'date-fns'

/** Whole days from today to an ISO date (negative when past). Null when unknown. */
export function daysUntil(iso: string | null | undefined, now: Date = new Date()): number | null {
  if (!iso) return null
  return differenceInCalendarDays(parseISO(iso), now)
}

/** "12 Mar 2027", or an honest fallback when the deadline is unknown. */
export function formatDeadline(iso: string | null): string {
  return iso ? format(parseISO(iso), 'd MMM yyyy') : 'Check official site'
}

/** Short relative label: "Today", "In 5 days", "Closed". */
export function deadlineLabel(iso: string | null, now: Date = new Date()): string {
  const d = daysUntil(iso, now)
  if (d === null) return 'Check official site'
  if (d < 0) return 'Closed'
  if (d === 0) return 'Due today'
  if (d === 1) return 'Due tomorrow'
  return `In ${d} days`
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy, h:mm a')
}
