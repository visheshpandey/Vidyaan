import type { DocumentItem } from '@/types/document'
import type { Scholarship } from '@/types/scholarship'
import type { Application } from '@/types/tracker'
import type { CalendarEvent } from './ics'

export interface DeadlineEvent extends CalendarEvent {
  kind: 'scholarship' | 'document'
  /** Route to open for this event. */
  scholarshipId?: string
}

/** Deadlines for scholarships the student saved or tracks, plus document expiries. Unknown deadlines are skipped. */
export function collectEvents(
  scholarships: Scholarship[],
  saved: string[],
  applications: Application[],
  documents: DocumentItem[],
): DeadlineEvent[] {
  const wanted = new Set([...saved, ...applications.map((a) => a.scholarshipId)])
  const fromScholarships = scholarships
    .filter((s) => wanted.has(s.id) && s.deadline)
    .map<DeadlineEvent>((s) => ({
      id: `sch-${s.id}`,
      title: `${s.title} deadline`,
      date: s.deadline as string,
      kind: 'scholarship',
      scholarshipId: s.id,
    }))
  const fromDocs = documents
    .filter((d) => d.expiry)
    .map<DeadlineEvent>((d) => ({ id: `doc-${d.id}`, title: `${d.name} expires`, date: d.expiry as string, kind: 'document' }))
  return [...fromScholarships, ...fromDocs].sort((a, b) => a.date.localeCompare(b.date))
}
