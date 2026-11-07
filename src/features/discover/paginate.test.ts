import { describe, expect, it } from 'vitest'
import { PAGE_SIZE, paginate, parsePage } from './paginate'

const list = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

describe('paginate', () => {
  it('handles an empty list', () => {
    const p = paginate([], 1)
    expect(p).toMatchObject({ page: 1, totalPages: 1, items: [], first: 0, last: 0, total: 0 })
  })

  it('returns everything when there is exactly one page', () => {
    const p = paginate(list(PAGE_SIZE), 1)
    expect(p.totalPages).toBe(1)
    expect(p.items).toHaveLength(PAGE_SIZE)
    expect([p.first, p.last]).toEqual([1, 10])
  })

  it('slices the middle page', () => {
    const p = paginate(list(43), 2)
    expect(p.items).toEqual(list(20).slice(10))
    expect([p.first, p.last, p.totalPages]).toEqual([11, 20, 5])
  })

  it('returns a partial last page', () => {
    const p = paginate(list(43), 5)
    expect(p.items).toEqual([41, 42, 43])
    expect([p.first, p.last]).toEqual([41, 43])
  })

  it('clamps page 0, negatives, fractions and NaN to the first page', () => {
    for (const bad of [0, -3, Number.NaN, -Infinity]) {
      expect(paginate(list(25), bad).page).toBe(1)
    }
    expect(paginate(list(25), 2.9).page).toBe(2)
  })

  it('clamps a huge page to the last page', () => {
    const p = paginate(list(25), 9999)
    expect(p.page).toBe(3)
    expect(p.items).toEqual([21, 22, 23, 24, 25])
  })

  it('honours a custom page size', () => {
    expect(paginate(list(7), 2, 3).items).toEqual([4, 5, 6])
  })
})

describe('parsePage', () => {
  it('accepts positive whole numbers and rejects junk', () => {
    expect(parsePage('4')).toBe(4)
    for (const junk of [null, '', '0', '-2', '1.5', 'abc', 'NaN']) {
      expect(parsePage(junk)).toBe(1)
    }
  })
})
