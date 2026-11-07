import { differenceInCalendarDays, parseISO } from 'date-fns'

const DATE = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const DATE_TIME = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** Whole days from today to an ISO date (negative when past). Null when unknown. */
export function daysUntil(iso: string | null | undefined, now: Date = new Date()): number | null {
  if (!iso) return null
  return differenceInCalendarDays(parseISO(iso), now)
}

/** "12 Mar 2027", or an honest fallback when the deadline is unknown. */
export function formatDeadline(iso: string | null): string {
  return iso ? DATE.format(parseISO(iso)) : 'Check official site'
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

/** Formats an ISO timestamp as a readable local date and time. */
export function formatDateTime(iso: string): string {
  return DATE_TIME.format(parseISO(iso))
}
