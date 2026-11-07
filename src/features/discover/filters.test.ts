import { describe, expect, it } from 'vitest'
import { DEMO_PROFILE } from '@/data/demo'
import { evaluate } from '@/features/matching/engine'
import { getScholarshipsSync } from '@/services/scholarshipService'
import {
  activeFilterCount,
  applyFilters,
  DEFAULT_FILTERS,
  filtersFromParams,
  filtersToParams,
} from './filters'

const items = getScholarshipsSync().map((scholarship) => ({
  scholarship,
  result: evaluate(DEMO_PROFILE, scholarship),
}))

describe('applyFilters', () => {
  it('returns everything by default', () => {
    expect(applyFilters(items, DEFAULT_FILTERS)).toHaveLength(items.length)
  })

  it('searches title and provider case-insensitively', () => {
    const r = applyFilters(items, { ...DEFAULT_FILTERS, query: 'AICTE' })
    expect(r.length).toBeGreaterThan(0)
    expect(
      r.every((m) =>
        /aicte/i.test(m.scholarship.title + m.scholarship.provider + m.scholarship.description),
      ),
    ).toBe(true)
  })

  it('filters by verdict', () => {
    const r = applyFilters(items, { ...DEFAULT_FILTERS, verdict: 'eligible' })
    expect(r.every((m) => m.result.verdict === 'eligible')).toBe(true)
  })

  it('excludes unknown deadlines when filtering by closing date', () => {
    const now = new Date('2026-11-07')
    const r = applyFilters(items, { ...DEFAULT_FILTERS, closingWithin: 60 }, now)
    expect(r.every((m) => m.scholarship.deadline !== null)).toBe(true)
  })

  it('returns an empty list for a nonsense query', () => {
    expect(applyFilters(items, { ...DEFAULT_FILTERS, query: 'zzzzqqq' })).toEqual([])
  })

  it('counts active filters', () => {
    expect(activeFilterCount(DEFAULT_FILTERS)).toBe(0)
    expect(activeFilterCount({ ...DEFAULT_FILTERS, verdict: 'eligible', query: 'x' })).toBe(2)
  })
})

describe('url state', () => {
  it('round-trips filters', () => {
    const f = {
      ...DEFAULT_FILTERS,
      query: 'aicte',
      verdict: 'eligible' as const,
      closingWithin: 30 as const,
      sort: 'amount' as const,
    }
    expect(filtersFromParams(filtersToParams(f))).toEqual(f)
  })
  it('omits defaults and ignores junk values', () => {
    expect(filtersToParams(DEFAULT_FILTERS).toString()).toBe('')
    const f = filtersFromParams(new URLSearchParams('verdict=hacked&within=7&sort=nope&level=ug'))
    expect(f.verdict).toBe('')
    expect(f.closingWithin).toBe(0)
    expect(f.sort).toBe('eligibility')
    expect(f.level).toBe('ug')
  })
})

describe('richer filters', () => {
  it('keeps only scholarships open to the chosen state', () => {
    const r = applyFilters(items, { ...DEFAULT_FILTERS, state: 'Madhya Pradesh' })
    expect(r.length).toBeGreaterThan(0)
    expect(
      r.every(
        (m) => !m.scholarship.rules.states || m.scholarship.rules.states.includes('Madhya Pradesh'),
      ),
    ).toBe(true)
    const kerala = applyFilters(items, { ...DEFAULT_FILTERS, state: 'Kerala' })
    expect(kerala.length).toBeLessThan(r.length + items.length)
    expect(
      kerala.every(
        (m) => !m.scholarship.rules.states || m.scholarship.rules.states.includes('Kerala'),
      ),
    ).toBe(true)
  })

  it('filters by minimum award', () => {
    const r = applyFilters(items, { ...DEFAULT_FILTERS, minAmount: 25000 })
    expect(r.every((m) => m.scholarship.amount.value >= 25000)).toBe(true)
  })

  it('filters by category and course rules', () => {
    const cat = applyFilters(items, { ...DEFAULT_FILTERS, category: 'SC' })
    expect(
      cat.every(
        (m) => !m.scholarship.rules.categories || m.scholarship.rules.categories.includes('SC'),
      ),
    ).toBe(true)
    const course = applyFilters(items, { ...DEFAULT_FILTERS, course: 'B.Tech' })
    expect(
      course.every(
        (m) => !m.scholarship.rules.courses || m.scholarship.rules.courses.includes('B.Tech'),
      ),
    ).toBe(true)
  })

  it('shows only saved scholarships when asked', () => {
    const first = items[0]?.scholarship.id ?? ''
    const r = applyFilters(items, { ...DEFAULT_FILTERS, savedOnly: true }, new Date(), [first])
    expect(r.map((m) => m.scholarship.id)).toEqual([first])
    expect(applyFilters(items, { ...DEFAULT_FILTERS, savedOnly: true })).toEqual([])
  })

  it('round-trips the new filters through the URL and rejects junk', () => {
    const f = {
      ...DEFAULT_FILTERS,
      state: 'Kerala',
      category: 'OBC' as const,
      course: 'B.Tech',
      minAmount: 25000 as const,
      savedOnly: true,
    }
    expect(filtersFromParams(filtersToParams(f))).toEqual(f)
    const junk = filtersFromParams(
      new URLSearchParams('state=Atlantis&category=XX&min=7&saved=yes'),
    )
    expect(junk.state).toBe('')
    expect(junk.category).toBe('')
    expect(junk.minAmount).toBe(0)
    expect(junk.savedOnly).toBe(false)
  })

  it('counts the new filters as active', () => {
    expect(activeFilterCount({ ...DEFAULT_FILTERS, state: 'Kerala', savedOnly: true })).toBe(2)
  })
})
