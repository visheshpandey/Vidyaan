import { describe, expect, it } from 'vitest'
import bundled from '../src/data/scholarships.json'
import served from '../public/data/scholarships.json'

/**
 * The scholarship list exists twice on purpose: `src/data` is the offline fallback bundled into the app,
 * and `public/data` is what the app fetches at runtime. This test stops the two copies drifting apart.
 */
describe('scholarship data copies', () => {
  it('bundled fallback and runtime file are identical', () => {
    expect(served).toEqual(bundled)
  })
})
