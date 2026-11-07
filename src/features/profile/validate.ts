import { LIMITS } from '@/data/schemas'
import type { StudentProfile } from '@/types/profile'
import { sanitizeText, TEXT_LIMITS } from '@/utils/sanitize'

export type ProfileErrors = Partial<Record<keyof StudentProfile, string>>

/**
 * Validates profile fields and returns error messages for invalid values.
 */
export function validateProfile(p: StudentProfile): ProfileErrors {
  const e: ProfileErrors = {}
  if (p.name !== undefined) {
    if (sanitizeText(p.name, TEXT_LIMITS.name) === '') {
      e.name = 'Tell us what to call you'
    } else if (p.name.length > TEXT_LIMITS.name) {
      e.name = `Use ${TEXT_LIMITS.name} characters or fewer`
    }
  }
  const y = p.academicYear
  if (y !== undefined && (!Number.isInteger(y) || y < LIMITS.minYear || y > LIMITS.maxYear)) {
    e.academicYear = `Enter a whole year between ${LIMITS.minYear} and ${LIMITS.maxYear}`
  }
  const income = p.annualFamilyIncome
  if (income !== undefined && (income < 0 || income > LIMITS.maxIncome)) {
    e.annualFamilyIncome =
      income < 0 ? 'Income cannot be negative' : 'Enter the yearly income in rupees'
  }
  const pct = p.lastExamPercent
  if (pct !== undefined && (pct < 0 || pct > LIMITS.maxPercent)) {
    e.lastExamPercent = 'Enter a percentage between 0 and 100'
  }
  return e
}

