import { daysUntil } from '@/utils/date'
import type { DeadlineEvent } from './events'

const REMINDER_WINDOW_DAYS = 3

/** Events happening today or within the next few days. */
export function dueReminders(events: DeadlineEvent[], now: Date = new Date()): DeadlineEvent[] {
  return events.filter((e) => {
    const d = daysUntil(e.date, now)
    return d !== null && d >= 0 && d <= REMINDER_WINDOW_DAYS
  })
}

/** One short line for a browser notification body. */
export function reminderSummary(due: DeadlineEvent[]): string {
  const first = due[0]
  if (!first) return ''
  return due.length === 1 ? first.title : `${first.title} and ${due.length - 1} more coming up`
}
