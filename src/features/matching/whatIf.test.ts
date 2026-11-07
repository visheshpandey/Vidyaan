import { describe, expect, it } from 'vitest'
import { DEMO_PROFILE } from '@/data/demo'
import { getScholarshipsSync } from '@/services/scholarshipService'
import type { Scholarship } from '@/types/scholarship'
import { whatIf } from './whatIf'

const base: Omit<Scholarship, 'id' | 'rules'> = {
  title: 'T',
  provider: 'P',
  providerType: 'government',
  type: 'need',
  description: 'd',
  benefits: [],
  amount: { value: 1000, period: 'yearly' },
  deadline: null,
  requiredDocuments: [],
  steps: [],
  applicationUrl: 'https://example.org',
  sourceUrl: 'https://example.org',
  dataType: 'sample',
}
const incomeCapped: Scholarship = { ...base, id: 'cap', rules: { maxIncome: 200000 } }

describe('R2.3 whatIf', () => {
  const profile = { name: 'A', preferences: [], annualFamilyIncome: 240000 }

  it('unlocks a scholarship when income drops under its limit', () => {
    const r = whatIf(profile, [incomeCapped], { annualFamilyIncome: 150000 })
    expect(r.unlocked.map((m) => m.scholarship.id)).toEqual(['cap'])
    expect(r.lost).toEqual([])
    expect(r.eligibleAfter).toBe(1)
  })

  it('reports scholarships that would be lost', () => {
    const r = whatIf({ ...profile, annualFamilyIncome: 100000 }, [incomeCapped], {
      annualFamilyIncome: 500000,
    })
    expect(r.lost.map((m) => m.scholarship.id)).toEqual(['cap'])
    expect(r.unlocked).toEqual([])
  })

  it('does nothing when the change does not matter', () => {
    const r = whatIf(profile, [incomeCapped], { lastExamPercent: 90 })
    expect(r.unlocked).toEqual([])
    expect(r.lost).toEqual([])
  })

  it('never mutates the original profile', () => {
    whatIf(profile, [incomeCapped], { annualFamilyIncome: 1 })
    expect(profile.annualFamilyIncome).toBe(240000)
  })

  it('works on the bundled scholarships with the demo student', () => {
    const r = whatIf(DEMO_PROFILE, getScholarshipsSync(), { annualFamilyIncome: 1_000_000 })
    expect(r.eligibleAfter).toBeLessThanOrEqual(getScholarshipsSync().length)
  })
})
