import type { StudentProfile } from '@/types/profile'

export type Errors = Partial<Record<keyof StudentProfile, string>>

/** Per-step validation. Optional answers may stay empty: "unknown" is allowed, never "failed". */
export function validateStep(step: number, p: StudentProfile): Errors {
  const e: Errors = {}
  if (step === 0 && !p.name.trim()) e.name = 'Tell us what to call you'
  if (step === 1) {
    if (p.academicYear !== undefined && (p.academicYear < 1 || p.academicYear > 8)) {
      e.academicYear = 'Enter a year between 1 and 8'
    }
  }
  if (step === 2) {
    if (p.annualFamilyIncome !== undefined && p.annualFamilyIncome < 0) {
      e.annualFamilyIncome = 'Income cannot be negative'
    }
    if (p.lastExamPercent !== undefined && (p.lastExamPercent < 0 || p.lastExamPercent > 100)) {
      e.lastExamPercent = 'Enter a percentage between 0 and 100'
    }
  }
  return e
}
