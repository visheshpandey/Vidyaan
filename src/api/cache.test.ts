import { describe, expect, it } from 'vitest'
import { TtlCache } from './cache'

describe('R6.3 TtlCache', () => {
  it('returns a value until it expires', () => {
    let t = 1000
    const cache = new TtlCache<string>(500, () => t)
    cache.set('a', 'x')
    expect(cache.get('a')).toBe('x')
    t = 1499
    expect(cache.get('a')).toBe('x')
    t = 1500
    expect(cache.get('a')).toBeUndefined()
  })

  it('returns undefined for unknown keys', () => {
    expect(new TtlCache<number>(1000).get('nope')).toBeUndefined()
  })

  it('does not store anything when ttl is 0', () => {
    const cache = new TtlCache<number>(0)
    cache.set('a', 1)
    expect(cache.get('a')).toBeUndefined()
  })

  it('clears all entries', () => {
    const cache = new TtlCache<number>(1000)
    cache.set('a', 1)
    cache.clear()
    expect(cache.get('a')).toBeUndefined()
  })
})
