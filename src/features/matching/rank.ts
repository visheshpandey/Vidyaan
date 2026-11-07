import type { EligibilityResult, Verdict } from '@/types/eligibility'
import type { Scholarship } from '@/types/scholarship'

export interface Matched {
  scholarship: Scholarship
  result: EligibilityResult
}

export type SortKey = 'eligibility' | 'amount' | 'deadline'

const VERDICT_ORDER: Record<Verdict, number> = { eligible: 0, needs_info: 1, not_eligible: 2 }

const deadlineMs = (s: Scholarship) => (s.deadline ? Date.parse(s.deadline) : Number.POSITIVE_INFINITY)

const byDeadline = (a: Matched, b: Matched) => {
  const x = deadlineMs(a.scholarship)
  const y = deadlineMs(b.scholarship)
  return x === y ? 0 : x < y ? -1 : 1
}
const byAmount = (a: Matched, b: Matched) => b.scholarship.amount.value - a.scholarship.amount.value
const byVerdict = (a: Matched, b: Matched) =>
  VERDICT_ORDER[a.result.verdict] - VERDICT_ORDER[b.result.verdict]

const COMPARATORS: Record<SortKey, (a: Matched, b: Matched) => number> = {
  eligibility: (a, b) => byVerdict(a, b) || byDeadline(a, b) || byAmount(a, b),
  amount: (a, b) => byAmount(a, b) || byVerdict(a, b),
  deadline: (a, b) => byDeadline(a, b) || byVerdict(a, b),
}

/** Returns a new array sorted by the chosen key. No percentage scores are used. */
export function rank(items: Matched[], key: SortKey = 'eligibility'): Matched[] {
  return [...items].sort(COMPARATORS[key])
}
