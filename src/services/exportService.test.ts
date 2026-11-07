import { describe, expect, it } from 'vitest'
import { createApplication } from '@/features/applications/transitions'
import { applicationsToCsv } from './exportService'

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
