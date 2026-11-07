import { describe, expect, it } from 'vitest'
import { applyStatus, createApplication } from './transitions'
import { countByStatus, filterByStatus } from './selectors'

const a = createApplication('a', '2026-01-01T00:00:00Z', [])
const b = applyStatus(
  createApplication('b', '2026-01-01T00:00:00Z', []),
  'submitted',
  '2026-01-02T00:00:00Z',
)
const apps = [a, b]

describe('R3.2 application selectors', () => {
  it('returns everything for "all"', () => {
    expect(filterByStatus(apps, 'all')).toHaveLength(2)
  })
  it('filters by status', () => {
    expect(filterByStatus(apps, 'submitted').map((x) => x.scholarshipId)).toEqual(['b'])
    expect(filterByStatus(apps, 'approved')).toEqual([])
  })
  it('counts by status', () => {
    expect(countByStatus(apps, 'saved')).toBe(1)
    expect(countByStatus(apps, 'disbursed')).toBe(0)
  })
})
