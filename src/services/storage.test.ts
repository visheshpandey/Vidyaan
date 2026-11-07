import { beforeEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { clearAllData, loadJSON, MAX_STORED_CHARS, saveJSON } from './storage'

const schema = z.object({ n: z.number() })
const fallback = { n: 0 }

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips valid data', () => {
    saveJSON(STORAGE_KEYS.settings, { n: 5 })
    expect(loadJSON(STORAGE_KEYS.settings, schema, fallback)).toEqual({ n: 5 })
  })

  it('returns fallback when nothing is stored', () => {
    expect(loadJSON(STORAGE_KEYS.settings, schema, fallback)).toBe(fallback)
  })

  it('returns fallback for corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEYS.settings, '{not json')
    expect(loadJSON(STORAGE_KEYS.settings, schema, fallback)).toBe(fallback)
  })

  it('returns fallback for data that fails the schema (old version)', () => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ n: 'oops' }))
    expect(loadJSON(STORAGE_KEYS.settings, schema, fallback)).toBe(fallback)
  })

  it('clears all app keys', () => {
    saveJSON(STORAGE_KEYS.profile, { n: 1 })
    saveJSON(STORAGE_KEYS.saved, [])
    clearAllData()
    expect(localStorage.length).toBe(0)
  })

  it('ignores an oversize stored value without parsing it', () => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ n: 'x'.repeat(MAX_STORED_CHARS) }))
    expect(loadJSON(STORAGE_KEYS.settings, schema, fallback)).toBe(fallback)
  })
})
