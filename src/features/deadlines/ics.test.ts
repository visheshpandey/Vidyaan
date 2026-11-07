import { describe, expect, it } from 'vitest'
import { buildIcs } from './ics'

describe('R4.4 buildIcs', () => {
  const ics = buildIcs(
    [{ id: 'a', title: 'Merit, 2027; apply', date: '2027-03-01' }],
    new Date('2026-11-07T10:00:00Z'),
  )

  it('wraps events in a calendar', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR')).toBe(true)
  })
  it('writes an all-day date and escapes special characters', () => {
    expect(ics).toContain('DTSTART;VALUE=DATE:20270301')
    expect(ics).toContain('SUMMARY:Merit\\, 2027\\; apply')
  })
  it('handles no events', () => {
    expect(buildIcs([])).toContain('VERSION:2.0')
  })
})
