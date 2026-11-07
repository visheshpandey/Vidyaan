import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApplication } from '@/features/applications/transitions'
import { applicationsToCsv, downloadText } from './exportService'

describe('applicationsToCsv', () => {
  it('writes a header and one row per application', () => {
    const app = { ...createApplication('a', '2026-01-01T00:00:00Z', []), notes: 'call, then email' }
    const csv = applicationsToCsv([app], () => 'Merit "Plus"')
    const lines = csv.split('\n')
    expect(lines[0]).toBe('Scholarship,Status,Created,Updated,Notes')
    expect(lines[1]).toContain('"Merit ""Plus"""')
    expect(lines[1]).toContain('"call, then email"')
  })
  it('neutralises formula injection', () => {
    const app = { ...createApplication('a', '2026-01-01T00:00:00Z', []), notes: '=HYPERLINK("x")' }
    expect(applicationsToCsv([app], () => 't')).toContain("'=HYPERLINK")
  })
})

describe('downloadText', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns true when the download is triggered', () => {
    URL.createObjectURL = vi.fn(() => 'blob:test')
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    expect(downloadText('a.txt', 'hello', 'text/plain')).toBe(true)
    expect(click).toHaveBeenCalled()
  })

  it('returns false instead of throwing when the browser fails', () => {
    URL.createObjectURL = vi.fn(() => {
      throw new Error('blocked')
    })
    expect(downloadText('a.txt', 'hello', 'text/plain')).toBe(false)
  })
})
