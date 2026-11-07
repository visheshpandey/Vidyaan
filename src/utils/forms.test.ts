import { describe, expect, it } from 'vitest'
import { parseNumber, toOptions } from './forms'

describe('forms helpers', () => {
  it('builds select options', () => {
    expect(toOptions(['A', 'B'])).toEqual([
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
    ])
  })
  it('treats an empty input as unanswered', () => {
    expect(parseNumber('')).toBeUndefined()
  })
  it('parses numbers and rejects non-numbers', () => {
    expect(parseNumber('240000')).toBe(240000)
    expect(parseNumber('78.5')).toBe(78.5)
    expect(parseNumber('abc')).toBeUndefined()
  })
})
