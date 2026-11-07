import { describe, expect, it } from 'vitest'
import { createApplication } from '@/features/applications/transitions'
import { applicationsToCsv } from './exportService'

function csvWithNote(note: string): string {
  const app = { ...createApplication('a', '2026-01-01T00:00:00Z', []), notes: note }
  return applicationsToCsv([app], () => 'Title')
}

describe('R6.2 R4.7 CSV formula-injection guard', () => {
  it.each([
    ['=', '=HYPERLINK("http://evil")'],
    ['+', '+1+1'],
    ['-', '-2+3'],
    ['@', '@SUM(A1)'],
    ['tab', '\tcmd'],
    ['carriage return', '\rcmd'],
  ])('neutralises a note that starts with %s', (_name, note) => {
    const row = csvWithNote(note).split('\n').slice(1).join('\n')
    expect(row).toContain("'" + note.replace(/"/g, '""'))
  })

  it('leaves ordinary notes unchanged', () => {
    expect(csvWithNote('call on Monday')).toContain(',call on Monday')
  })
})
