import { STATUS_LABELS, isActive } from '@/features/applications/transitions'
import type { Matched } from '@/features/matching/rank'
import { ROUTES } from '@/constants/routes'
import { DEADLINE_SOON_DAYS } from '@/constants/limits'
import type { DocumentItem } from '@/types/document'
import type { StudentProfile } from '@/types/profile'
import type { Application } from '@/types/tracker'
import { daysUntil } from '@/utils/date'

export interface NextStep {
  id: string
  text: string
  to: string
}

export interface ActivityItem {
  id: string
  text: string
  at: string
}

export interface DashboardData {
  eligibleCount: number
  needsInfoCount: number
  savedCount: number
  activeCount: number
  deadlinesSoon: Matched[]
  nextSteps: NextStep[]
  activity: ActivityItem[]
}

const FIELD_LABELS: Partial<Record<keyof StudentProfile, string>> = {
  educationLevel: 'education level',
  course: 'course',
  state: 'state',
  category: 'category',
  gender: 'gender',
  annualFamilyIncome: 'family income',
  lastExamPercent: 'last exam percentage',
}

interface Input {
  matches: Matched[]
  saved: string[]
  applications: Application[]
  documents: DocumentItem[]
  now?: Date
}

/** Derives every dashboard number from real data. Nothing here is hard-coded. */
export function buildDashboard({
  matches,
  saved,
  applications,
  documents,
  now = new Date(),
}: Input): DashboardData {
  const byId = new Map(matches.map((m) => [m.scholarship.id, m]))
  const tracked = new Set([...saved, ...applications.map((a) => a.scholarshipId)])

  const deadlinesSoon = matches
    .filter((m) => tracked.has(m.scholarship.id))
    .filter((m) => {
      const d = daysUntil(m.scholarship.deadline, now)
      return d !== null && d >= 0 && d <= DEADLINE_SOON_DAYS
    })
    .sort((a, b) => (a.scholarship.deadline ?? '').localeCompare(b.scholarship.deadline ?? ''))

  const nextSteps: NextStep[] = []

  const missingFields = new Map<string, number>()
  for (const m of matches) {
    for (const c of m.result.criteria) {
      const label = c.missingField && FIELD_LABELS[c.missingField]
      if (c.result === 'unknown' && label)
        missingFields.set(label, (missingFields.get(label) ?? 0) + 1)
    }
  }
  for (const [label, count] of [...missingFields].sort((a, b) => b[1] - a[1]).slice(0, 2)) {
    nextSteps.push({
      id: `field-${label}`,
      text: `Add your ${label} to check ${count} more scholarship${count === 1 ? '' : 's'}`,
      to: ROUTES.profile,
    })
  }

  const activeApps = applications.filter((a) => a.status === 'preparing' || a.status === 'saved')
  for (const doc of documents.filter((d) => d.status === 'missing')) {
    const needed = activeApps.filter((a) => a.documentChecklist.includes(doc.name)).length
    if (needed > 0) {
      nextSteps.push({
        id: `doc-${doc.id}`,
        text: `Get your ${doc.name}: needed for ${needed} application${needed === 1 ? '' : 's'}`,
        to: ROUTES.documents,
      })
    }
  }

  for (const doc of documents) {
    const d = daysUntil(doc.expiry, now)
    if (d !== null && d >= 0 && d <= DEADLINE_SOON_DAYS) {
      nextSteps.push({
        id: `exp-${doc.id}`,
        text: `${doc.name} expires in ${d} day${d === 1 ? '' : 's'}`,
        to: ROUTES.documents,
      })
    }
  }

  for (const m of deadlinesSoon.slice(0, 2)) {
    const d = daysUntil(m.scholarship.deadline, now)
    nextSteps.push({
      id: `dl-${m.scholarship.id}`,
      text: `${m.scholarship.title} closes in ${d} day${d === 1 ? '' : 's'}`,
      to: ROUTES.scholarship(m.scholarship.id),
    })
  }

  const activity = applications
    .flatMap((a) =>
      a.history.map((h, i) => ({
        id: `${a.id}-${i}`,
        at: h.at,
        text: `${byId.get(a.scholarshipId)?.scholarship.title ?? 'Scholarship'}: ${i === 0 ? 'added as' : 'moved to'} ${STATUS_LABELS[h.status]}`,
      })),
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6)

  return {
    eligibleCount: matches.filter((m) => m.result.verdict === 'eligible').length,
    needsInfoCount: matches.filter((m) => m.result.verdict === 'needs_info').length,
    savedCount: saved.length,
    activeCount: applications.filter(isActive).length,
    deadlinesSoon,
    nextSteps: nextSteps.slice(0, 5),
    activity,
  }
}
