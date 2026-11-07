import { describe, expect, it } from 'vitest'
import { createApplication } from '@/features/applications/transitions'
import { readiness } from './readiness'

const app = createApplication('x', '2026-01-01T00:00:00Z', ['Marksheet', 'Domicile certificate'])

describe('readiness', () => {
  it('counts available documents by name', () => {
    const r = readiness(app, [
      { id: '1', name: 'Marksheet', status: 'available' },
      { id: '2', name: 'Domicile certificate', status: 'missing' },
    ])
    expect(r).toEqual({ ready: 1, total: 2, percent: 50, missing: ['Domicile certificate'] })
  })
  it('treats a missing document entry as missing', () => {
    expect(readiness(app, []).percent).toBe(0)
  })
  it('is 100% when nothing is required', () => {
    expect(readiness({ ...app, documentChecklist: [] }, []).percent).toBe(100)
  })
})
