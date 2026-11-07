import { describe, expect, it } from 'vitest'
import raw from '@/data/scholarships.json'
import { getScholarshipsSync } from './scholarshipService'

describe('R2.6 scholarshipService', () => {
  const list = getScholarshipsSync()

  it('keeps every bundled record (none fail validation)', () => {
    expect(list).toHaveLength(raw.length)
  })

  it('has unique ids', () => {
    const ids = list.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('never claims verification without a date and source', () => {
    for (const s of list) {
      if (s.dataType === 'verified') expect(s.lastVerifiedAt).toBeTruthy()
    }
  })

  it('contains the real schemes the app links to', () => {
    expect(list.find((s) => s.id === 'aicte-pragati')?.provider).toMatch(/AICTE/)
    expect(list.find((s) => s.id === 'nope')).toBeUndefined()
  })
})
