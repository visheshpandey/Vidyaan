import type { Criterion } from '@/types/eligibility'
import type { StudentProfile } from '@/types/profile'
import type { EligibilityRules } from '@/types/scholarship'
import { formatLakh, levelLabel } from '@/utils/format'

type RuleCheck = (profile: StudentProfile, rules: EligibilityRules) => Criterion | null

const unknown = (rule: string, field: keyof StudentProfile, ask: string): Criterion => ({
  rule,
  result: 'unknown',
  message: ask,
  missingField: field,
})

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

const checkLevel: RuleCheck = (p, r) => {
  if (!r.levels?.length) return null
  const rule = 'Education level'
  if (!p.educationLevel) return unknown(rule, 'educationLevel', 'Add your education level to check this')
  const ok = r.levels.includes(p.educationLevel)
  return {
    rule,
    result: ok ? 'met' : 'not-met',
    message: ok
      ? `Your level (${levelLabel(p.educationLevel)}) is accepted`
      : `Open to ${r.levels.map(levelLabel).join(' / ')} students; you selected ${levelLabel(p.educationLevel)}`,
  }
}

const checkCourse: RuleCheck = (p, r) => {
  if (!r.courses?.length) return null
  const rule = 'Course'
  if (!p.course) return unknown(rule, 'course', 'Add your course to check this')
  const course = p.course
  const ok = r.courses.some((c) => same(c, course) || course.toLowerCase().includes(c.toLowerCase()))
  return {
    rule,
    result: ok ? 'met' : 'not-met',
    message: ok ? `Your course (${course}) is covered` : `Limited to ${r.courses.join(', ')}`,
  }
}

const checkState: RuleCheck = (p, r) => {
  if (!r.states?.length) return null
  const rule = 'State of residence'
  if (!p.state) return unknown(rule, 'state', 'Add your state to check this')
  const state = p.state
  const ok = r.states.some((s) => same(s, state))
  return {
    rule,
    result: ok ? 'met' : 'not-met',
    message: ok ? `${state} is eligible` : `Only for residents of ${r.states.join(', ')}`,
  }
}

const checkCategory: RuleCheck = (p, r) => {
  if (!r.categories?.length) return null
  const rule = 'Category'
  if (!p.category) return unknown(rule, 'category', 'Add your category to check this')
  const ok = r.categories.includes(p.category)
  return {
    rule,
    result: ok ? 'met' : 'not-met',
    message: ok ? `Category ${p.category} is eligible` : `Reserved for ${r.categories.join(', ')}`,
  }
}

const checkGender: RuleCheck = (p, r) => {
  if (!r.genders?.length) return null
  const rule = 'Gender'
  if (!p.gender) return unknown(rule, 'gender', 'Add your gender to check this')
  const ok = r.genders.includes(p.gender)
  return {
    rule,
    result: ok ? 'met' : 'not-met',
    message: ok ? 'Your gender criterion is met' : `Open to ${r.genders.join(', ')} applicants`,
  }
}

const checkIncome: RuleCheck = (p, r) => {
  if (r.maxIncome === undefined) return null
  const rule = 'Family income'
  if (p.annualFamilyIncome === undefined)
    return unknown(rule, 'annualFamilyIncome', 'Add your family income to check this condition')
  const ok = p.annualFamilyIncome <= r.maxIncome
  return {
    rule,
    result: ok ? 'met' : 'not-met',
    message: ok
      ? `Your income ${formatLakh(p.annualFamilyIncome)} is within the ${formatLakh(r.maxIncome)} limit`
      : `Your income ${formatLakh(p.annualFamilyIncome)} is above the ${formatLakh(r.maxIncome)} limit`,
  }
}

const checkPercent: RuleCheck = (p, r) => {
  if (r.minPercent === undefined) return null
  const rule = 'Minimum marks'
  if (p.lastExamPercent === undefined)
    return unknown(rule, 'lastExamPercent', 'Add your last exam percentage to check this')
  const ok = p.lastExamPercent >= r.minPercent
  return {
    rule,
    result: ok ? 'met' : 'not-met',
    message: ok
      ? `Your ${p.lastExamPercent}% meets the ${r.minPercent}% requirement`
      : `Needs ${r.minPercent}% or more; you entered ${p.lastExamPercent}%`,
  }
}

const checkDisability: RuleCheck = (p, r) => {
  if (!r.disabilityRequired) return null
  const rule = 'Disability'
  if (p.disability === undefined) return unknown(rule, 'disability', 'Tell us if this applies to you')
  return {
    rule,
    result: p.disability ? 'met' : 'not-met',
    message: p.disability ? 'You indicated this applies' : 'Only for students with a disability',
  }
}

const checkMinority: RuleCheck = (p, r) => {
  if (!r.minorityRequired) return null
  const rule = 'Minority community'
  if (p.minority === undefined) return unknown(rule, 'minority', 'Tell us if this applies to you')
  return {
    rule,
    result: p.minority ? 'met' : 'not-met',
    message: p.minority ? 'You indicated this applies' : 'Only for notified minority communities',
  }
}

export const RULE_CHECKS: readonly RuleCheck[] = [
  checkLevel,
  checkCourse,
  checkState,
  checkCategory,
  checkGender,
  checkIncome,
  checkPercent,
  checkDisability,
  checkMinority,
]
