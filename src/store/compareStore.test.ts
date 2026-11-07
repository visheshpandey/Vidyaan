import { beforeEach, describe, expect, it } from 'vitest'
import { MAX_COMPARE, useCompareStore } from './compareStore'

describe('compareStore', () => {
  beforeEach(() => useCompareStore.getState().clear())

  it('adds and removes', () => {
    expect(useCompareStore.getState().toggle('a')).toBe(true)
    expect(useCompareStore.getState().ids).toEqual(['a'])
    useCompareStore.getState().toggle('a')
    expect(useCompareStore.getState().ids).toEqual([])
  })

  it(`refuses a ${MAX_COMPARE + 1}th item`, () => {
    for (const id of ['a', 'b', 'c']) useCompareStore.getState().toggle(id)
    expect(useCompareStore.getState().toggle('d')).toBe(false)
    expect(useCompareStore.getState().ids).toHaveLength(MAX_COMPARE)
  })
})
