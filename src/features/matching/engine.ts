import type { Criterion, EligibilityResult, Verdict } from '@/types/eligibility'
import type { StudentProfile } from '@/types/profile'
import type { Scholarship } from '@/types/scholarship'
import { RULE_CHECKS } from './rules'

/**
 * Evaluates one scholarship against a profile. Deterministic and explainable:
 * a known failed rule means not eligible; a missing answer only means "needs info".
 */
export function evaluate(profile: StudentProfile, scholarship: Scholarship): EligibilityResult {
  const criteria = RULE_CHECKS.map((check) => check(profile, scholarship.rules)).filter(
    (c): c is Criterion => c !== null,
  )
  return { verdict: toVerdict(criteria), criteria }
}

function toVerdict(criteria: Criterion[]): Verdict {
  if (criteria.some((c) => c.result === 'not-met')) return 'not_eligible'
  if (criteria.some((c) => c.result === 'unknown')) return 'needs_info'
  return 'eligible'
}
