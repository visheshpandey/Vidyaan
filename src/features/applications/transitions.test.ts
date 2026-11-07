import { describe, expect, it } from 'vitest'
import { applyStatus, createApplication, isActive } from './transitions'

describe('R3.2 transitions', () => {
  const app = createApplication('s1', '2026-11-01T00:00:00Z', ['Marksheet'])

  it('starts in saved with one history entry', () => {
    expect(app.status).toBe('saved')
    expect(app.history).toHaveLength(1)
  })

  it('moves status, updates updatedAt and appends history', () => {
    const next = applyStatus(app, 'preparing', '2026-11-02T00:00:00Z')
    expect(next.status).toBe('preparing')
    expect(next.updatedAt).toBe('2026-11-02T00:00:00Z')
    expect(next.history).toHaveLength(2)
    expect(app.status).toBe('saved')
  })

  it('ignores a move to the same status', () => {
    expect(applyStatus(app, 'saved', '2026-11-02T00:00:00Z')).toBe(app)
  })

  it('knows which statuses are active', () => {
    expect(isActive(applyStatus(app, 'submitted', 'x'))).toBe(true)
    expect(isActive(app)).toBe(false)
    expect(isActive(applyStatus(app, 'not_selected', 'x'))).toBe(false)
  })
})
