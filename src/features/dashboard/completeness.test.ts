import { describe, expect, it } from 'vitest'
import { DEMO_PROFILE } from '@/data/demo'
import { profileCompleteness } from './completeness'

describe('profileCompleteness', () => {
  it('is 0 without a profile', () => {
    expect(profileCompleteness(null)).toEqual({ percent: 0, filled: 0, total: 11 })
  })
  it('does not count empty answers', () => {
    expect(profileCompleteness({ name: 'A', preferences: [] }).percent).toBe(0)
  })
  it('counts false as answered', () => {
    expect(
      profileCompleteness({ name: 'A', preferences: [], disability: false, minority: false })
        .filled,
    ).toBe(2)
  })
  it('is 100 for the full demo profile', () => {
    expect(profileCompleteness(DEMO_PROFILE).percent).toBe(100)
  })
})
