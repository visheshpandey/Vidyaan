import { describe, expect, it } from 'vitest'
import { stepProgress, toggleStep } from './steps'

describe('R3.1 toggleStep', () => {
  it('ticks and unticks a step', () => {
    expect(toggleStep([], 1, 3)).toEqual([1])
    expect(toggleStep([1], 1, 3)).toEqual([])
  })
  it('keeps the list sorted and unique', () => {
    expect(toggleStep([2], 0, 3)).toEqual([0, 2])
  })
  it('ignores indexes outside the guide', () => {
    expect(toggleStep([0], 5, 3)).toEqual([0])
    expect(toggleStep([0], -1, 3)).toEqual([0])
    expect(toggleStep([0], 1.5, 3)).toEqual([0])
  })
})

describe('R3.1 stepProgress', () => {
  it('reports progress and the next step', () => {
    expect(stepProgress([0, 1], 4)).toEqual({ done: 2, total: 4, percent: 50, nextIndex: 2 })
  })
  it('finds the first gap, not the last step', () => {
    expect(stepProgress([0, 2], 3).nextIndex).toBe(1)
  })
  it('is complete when every step is done', () => {
    expect(stepProgress([0, 1], 2)).toEqual({ done: 2, total: 2, percent: 100, nextIndex: null })
  })
  it('ignores stale indexes and handles an empty guide', () => {
    expect(stepProgress([0, 9], 2).done).toBe(1)
    expect(stepProgress([], 0)).toEqual({ done: 0, total: 0, percent: 0, nextIndex: null })
  })
})
