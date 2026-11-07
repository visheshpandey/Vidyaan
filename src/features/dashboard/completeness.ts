import type { StudentProfile } from '@/types/profile'

const FIELDS: Array<keyof StudentProfile> = [
  'educationLevel',
  'course',
  'academicYear',
  'state',
  'institutionType',
  'gender',
  'category',
  'annualFamilyIncome',
  'lastExamPercent',
  'disability',
  'minority',
]

export interface Completeness {
  percent: number
  filled: number
  total: number
}

/** Share of matching questions the student has answered. `false` counts as answered. */
export function profileCompleteness(profile: StudentProfile | null): Completeness {
  const total = FIELDS.length
  const filled = profile
    ? FIELDS.filter((k) => profile[k] !== undefined && profile[k] !== '').length
    : 0
  return { percent: Math.round((filled / total) * 100), filled, total }
}
