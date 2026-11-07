import { describe, expect, it } from 'vitest'
import type { DeadlineEvent } from './events'
import { dueReminders, reminderSummary } from './reminders'

const ev = (id: string, date: string): DeadlineEvent => ({
  id,
  title: `T-${id}`,
  date,
  kind: 'scholarship',
})
const now = new Date('2026-11-07T09:00:00')

describe('R4.4 reminders', () => {
  const events = [
    ev('past', '2026-11-01'),
    ev('today', '2026-11-07'),
    ev('soon', '2026-11-10'),
    ev('far', '2026-12-30'),
  ]

  it('keeps only events today through the window', () => {
    expect(dueReminders(events, now).map((e) => e.id)).toEqual(['today', 'soon'])
  })
  it('summarises', () => {
    expect(reminderSummary([])).toBe('')
    expect(reminderSummary([ev('a', '2026-11-08')])).toBe('T-a')
    expect(reminderSummary([ev('a', '2026-11-08'), ev('b', '2026-11-09')])).toBe(
      'T-a and 1 more coming up',
    )
  })
})
