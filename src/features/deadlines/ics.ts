export interface CalendarEvent {
  id: string
  title: string
  /** ISO date (YYYY-MM-DD). */
  date: string
}

const escape = (t: string) =>
  t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
const compact = (iso: string) => iso.replaceAll('-', '').slice(0, 8)

/** Builds an all-day-event iCalendar file, importable into Google, Apple or Outlook calendars. */
export function buildIcs(events: CalendarEvent[], now: Date = new Date()): string {
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
  const body = events.flatMap((e) => [
    'BEGIN:VEVENT',
    `UID:${e.id}@grantly`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(e.date)}`,
    `SUMMARY:${escape(e.title)}`,
    'END:VEVENT',
  ])
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GRANTLY//Deadlines//EN',
    ...body,
    'END:VCALENDAR',
  ].join('\r\n')
}
