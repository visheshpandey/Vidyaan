import { describe, expect, it } from 'vitest'
import raw from '@/data/scholarships.json'
import { getScholarship, listScholarships } from './scholarshipService'

describe('scholarshipService', () => {
  it('keeps every bundled record (none fail validation)', async () => {
    const list = await listScholarships()
    expect(list).toHaveLength(raw.length)
  })

  it('has unique ids', async () => {
    const ids = (await listScholarships()).map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('never claims verification without a date and source', async () => {
    for (const s of await listScholarships()) {
      if (s.dataType === 'verified') expect(s.lastVerifiedAt).toBeTruthy()
    }
  })

  it('finds a record by id and returns undefined for unknown ids', async () => {
    expect((await getScholarship('aicte-pragati'))?.provider).toMatch(/AICTE/)
    expect(await getScholarship('nope')).toBeUndefined()
  })
})
