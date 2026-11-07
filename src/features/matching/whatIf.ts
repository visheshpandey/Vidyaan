import type { StudentProfile } from '@/types/profile'
import type { Scholarship } from '@/types/scholarship'
import { evaluate } from './engine'
import type { Matched } from './rank'

export interface WhatIfResult {
  /** Scholarships the student would newly become eligible for. */
  unlocked: Matched[]
  /** Scholarships the student is eligible for now but would lose. */
  lost: Matched[]
  /** Eligible count with the change applied. */
  eligibleAfter: number
}

/**
 * "What if my answers were different?" Re-runs the real eligibility engine on a changed copy of the
 * profile and reports which scholarships open up or close. Nothing is saved.
 */
export function whatIf(
  profile: StudentProfile,
  scholarships: Scholarship[],
  change: Partial<StudentProfile>,
): WhatIfResult {
  const changed: StudentProfile = { ...profile, ...change }
  const unlocked: Matched[] = []
  const lost: Matched[] = []
  let eligibleAfter = 0
  for (const scholarship of scholarships) {
    const before = evaluate(profile, scholarship).verdict
    const after = evaluate(changed, scholarship)
    if (after.verdict === 'eligible') eligibleAfter += 1
    if (after.verdict === 'eligible' && before !== 'eligible')
      unlocked.push({ scholarship, result: after })
    if (before === 'eligible' && after.verdict !== 'eligible')
      lost.push({ scholarship, result: after })
  }
  return { unlocked, lost, eligibleAfter }
}
