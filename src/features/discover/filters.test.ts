import { describe, expect, it } from 'vitest'
import { DEMO_PROFILE } from '@/data/demo'
import { evaluate } from '@/features/matching/engine'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { activeFilterCount, applyFilters, DEFAULT_FILTERS, filtersFromParams, filtersToParams } from './filters'

const items = getScholarshipsSync().map((scholarship) => ({ scholarship, result: evaluate(DEMO_PROFILE, scholarship) }))

describe('applyFilters', () => {
  it('returns everything by default', () => {
    expect(applyFilters(items, DEFAULT_FILTERS)).toHaveLength(items.length)
  })

  it('searches title and provider case-insensitively', () => {
    const r = applyFilters(items, { ...DEFAULT_FILTERS, query: 'AICTE' })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((m) => /aicte/i.test(m.scholarship.title + m.scholarship.provider + m.scholarship.description))).toBe(true)
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
    const f = { ...DEFAULT_FILTERS, query: 'aicte', verdict: 'eligible' as const, closingWithin: 30 as const, sort: 'amount' as const }
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
