import type { StudentProfile } from './profile'

export type Verdict = 'eligible' | 'needs_info' | 'not_eligible'
export type CriterionResult = 'met' | 'not-met' | 'unknown'

export interface Criterion {
  rule: string
  result: CriterionResult
  message: string
  missingField?: keyof StudentProfile
}

export interface EligibilityResult {
  verdict: Verdict
  criteria: Criterion[]
}
