import { createApplication, applyStatus } from '@/features/applications/transitions'
import type { DocumentItem } from '@/types/document'
import type { StudentProfile } from '@/types/profile'
import type { Application } from '@/types/tracker'

/** Persona from the demo script: Priya, OBC, B.Tech 2nd year, Madhya Pradesh. */
export const DEMO_PROFILE: StudentProfile = {
  name: 'Priya',
  educationLevel: 'ug',
  course: 'B.Tech',
  academicYear: 2,
  state: 'Madhya Pradesh',
  institutionType: 'government',
  gender: 'female',
  category: 'OBC',
  annualFamilyIncome: 240000,
  lastExamPercent: 78,
  disability: false,
  minority: false,
  preferences: ['Merit-based', 'Government'],
}

const DAY = 86_400_000
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString()

/** Applications at different stages so the tracker and dashboard look real. */
export function buildDemoApplications(): Application[] {
  const make = (id: string, docs: string[], steps: Array<[Application['status'], number]>) =>
    steps.reduce(
      (app, [status, daysAgo]) => applyStatus(app, status, ago(daysAgo)),
      createApplication(id, ago(12), docs),
    )
  return [
    make('demo-need-ug', ['Income certificate', 'Marksheet', 'Bank passbook'], [['preparing', 6]]),
    make(
      'demo-mp-state',
      ['Domicile certificate', 'Income certificate', 'Marksheet'],
      [['preparing', 4]],
    ),
    make(
      'central-sector-college',
      ['Class 12 marksheet', 'Income certificate'],
      [
        ['preparing', 9],
        ['submitted', 3],
      ],
    ),
    make(
      'demo-open-merit',
      ['Marksheet', 'College ID'],
      [
        ['preparing', 10],
        ['submitted', 7],
        ['under_review', 2],
      ],
    ),
    createApplication('demo-women-stem', ago(1), [
      'Marksheet',
      'Statement of purpose',
      'College ID',
    ]),
  ]
}

const inDays = (d: number) => new Date(Date.now() + d * DAY).toISOString().slice(0, 10)

/** Sample documents for the demo student, with dates relative to today. */
export function buildDemoDocuments(): DocumentItem[] {
  return [
    { id: 'doc-marksheet', name: 'Marksheet', status: 'available' },
    { id: 'doc-income', name: 'Income certificate', status: 'available', expiry: inDays(20) },
    { id: 'doc-bank', name: 'Bank passbook', status: 'available' },
    { id: 'doc-domicile', name: 'Domicile certificate', status: 'missing' },
    { id: 'doc-college-id', name: 'College ID', status: 'available' },
    { id: 'doc-sop', name: 'Statement of purpose', status: 'missing' },
  ]
}
