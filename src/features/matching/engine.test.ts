import { describe, expect, it } from 'vitest'
import type { StudentProfile } from '@/types/profile'
import type { EligibilityRules, Scholarship } from '@/types/scholarship'
import { evaluate } from './engine'
import { rank, type Matched } from './rank'

const make = (rules: EligibilityRules, over: Partial<Scholarship> = {}): Scholarship => ({
  id: 's',
  title: 'T',
  provider: 'P',
  providerType: 'government',
  type: 'need',
  description: '',
  benefits: [],
  amount: { value: 10000, period: 'yearly' },
  deadline: '2026-12-01',
  rules,
  requiredDocuments: [],
  steps: [],
  applicationUrl: 'https://example.org',
  sourceUrl: 'https://example.org',
  dataType: 'sample',
  ...over,
})

const profile: StudentProfile = {
  name: 'Priya',
  educationLevel: 'ug',
  course: 'B.Tech',
  state: 'Madhya Pradesh',
  category: 'OBC',
  gender: 'female',
  annualFamilyIncome: 240000,
  lastExamPercent: 78,
  disability: false,
  minority: false,
  preferences: [],
}

const empty: StudentProfile = { name: 'X', preferences: [] }

describe('R2.1 R2.2 R2.3 evaluate', () => {
  it('is eligible for everyone when there are no rules', () => {
    expect(evaluate(empty, make({})).verdict).toBe('eligible')
  })

  it.each<[string, EligibilityRules, EligibilityRules]>([
    ['level', { levels: ['ug'] }, { levels: ['pg'] }],
    ['course', { courses: ['B.Tech'] }, { courses: ['MBBS'] }],
    ['state', { states: ['madhya pradesh'] }, { states: ['Kerala'] }],
    ['category', { categories: ['OBC', 'SC'] }, { categories: ['ST'] }],
    ['gender', { genders: ['female'] }, { genders: ['male'] }],
    ['income', { maxIncome: 250000 }, { maxIncome: 200000 }],
    ['marks', { minPercent: 75 }, { minPercent: 80 }],
  ])('%s rule: met and not-met', (_name, pass, fail) => {
    expect(evaluate(profile, make(pass)).verdict).toBe('eligible')
    expect(evaluate(profile, make(fail)).verdict).toBe('not_eligible')
  })

  it('handles disability and minority flags', () => {
    expect(evaluate(profile, make({ disabilityRequired: true })).verdict).toBe('not_eligible')
    expect(evaluate(profile, make({ minorityRequired: true })).verdict).toBe('not_eligible')
    expect(
      evaluate({ ...profile, disability: true }, make({ disabilityRequired: true })).verdict,
    ).toBe('eligible')
  })

  it('treats a missing answer as needs_info, never not_eligible', () => {
    const r = evaluate(empty, make({ maxIncome: 250000 }))
    expect(r.verdict).toBe('needs_info')
    expect(r.criteria[0]?.missingField).toBe('annualFamilyIncome')
    expect(r.criteria[0]?.message).toMatch(/Add your family income/)
  })

  it('lets one known failure beat any unknowns', () => {
    const r = evaluate({ ...empty, category: 'GEN' }, make({ categories: ['SC'], maxIncome: 1 }))
    expect(r.verdict).toBe('not_eligible')
  })

  it('writes plain-language income messages', () => {
    const r = evaluate(profile, make({ maxIncome: 250000 }))
    expect(r.criteria[0]?.message).toBe('Your income ₹2.4L is within the ₹2.5L limit')
  })

  it('does not use tolerance margins', () => {
    const r = evaluate({ ...profile, lastExamPercent: 79 }, make({ minPercent: 80 }))
    expect(r.verdict).toBe('not_eligible')
  })
})

describe('R1.2 R1.4 rank', () => {
  const m = (
    id: string,
    verdict: Matched['result']['verdict'],
    deadline: string | null,
    amount: number,
  ): Matched => ({
    scholarship: make({}, { id, deadline, amount: { value: amount, period: 'yearly' } }),
    result: { verdict, criteria: [] },
  })
  const items = [
    m('late-ok', 'eligible', '2026-12-30', 1000),
    m('info', 'needs_info', '2026-11-20', 9000),
    m('early-ok', 'eligible', '2026-11-25', 500),
    m('no', 'not_eligible', '2026-11-10', 99999),
    m('open-ok', 'eligible', null, 7000),
  ]
  const ids = (k: Parameters<typeof rank>[1]) => rank(items, k).map((x) => x.scholarship.id)

  it('orders by verdict, then deadline soonest (unknown last), then amount', () => {
    expect(ids('eligibility')).toEqual(['early-ok', 'late-ok', 'open-ok', 'info', 'no'])
  })
  it('sorts by amount', () => expect(ids('amount')[0]).toBe('no'))
  it('sorts by deadline', () =>
    expect(ids('deadline')).toEqual(['no', 'info', 'early-ok', 'late-ok', 'open-ok']))
  it('does not mutate input', () => {
    rank(items)
    expect(items[0]?.scholarship.id).toBe('late-ok')
  })
})
