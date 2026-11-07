import { describe, expect, it } from 'vitest'
import { validateStep } from './validate'

const base = { name: 'Priya', preferences: [] }

describe('R5.1 validateStep', () => {
  it('requires a name on step 0', () => {
    expect(validateStep(0, { ...base, name: '  ' }).name).toBeTruthy()
    expect(validateStep(0, base)).toEqual({})
  })
  it('allows empty optional answers', () => {
    expect(validateStep(2, base)).toEqual({})
  })
  it('rejects out-of-range numbers', () => {
    expect(validateStep(2, { ...base, lastExamPercent: 120 }).lastExamPercent).toBeTruthy()
    expect(validateStep(2, { ...base, annualFamilyIncome: -1 }).annualFamilyIncome).toBeTruthy()
    expect(validateStep(1, { ...base, academicYear: 9 }).academicYear).toBeTruthy()
  })
})
