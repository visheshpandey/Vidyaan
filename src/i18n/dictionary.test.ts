import { describe, expect, it } from 'vitest'
import { DICTIONARIES, translate } from './dictionary'

describe('dictionary', () => {
  it('has a Hindi entry for every English key', () => {
    expect(Object.keys(DICTIONARIES.hi).sort()).toEqual(Object.keys(DICTIONARIES.en).sort())
  })
  it('has no empty translations', () => {
    for (const v of Object.values(DICTIONARIES.hi)) expect(v.trim()).not.toBe('')
  })
  it('translates', () => {
    expect(translate('hi', 'verdict.eligible')).toBe('पात्र')
    expect(translate('en', 'verdict.eligible')).toBe('Eligible')
  })
})
