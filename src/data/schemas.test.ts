import { describe, expect, it } from 'vitest'
import { MAX_NOTES_LENGTH } from '@/constants/limits'
import { createApplication } from '@/features/applications/transitions'
import { getScholarshipsSync } from '@/services/scholarshipService'
import {
  applicationSchema,
  documentSchema,
  profileSchema,
  scholarshipSchema,
  settingsSchema,
} from './schemas'

const baseScholarship = getScholarshipsSync()[0]
if (!baseScholarship) throw new Error('bundled scholarships are empty')

describe('R2.6 scholarshipSchema', () => {
  it('accepts the bundled records', () => {
    expect(scholarshipSchema.safeParse(baseScholarship).success).toBe(true)
  })

  it.each(['javascript:alert(1)', 'data:text/html,<b>x</b>', 'vbscript:run', 'file:///etc/passwd'])(
    'drops a record whose application URL is %s',
    (url) => {
      expect(scholarshipSchema.safeParse({ ...baseScholarship, applicationUrl: url }).success).toBe(
        false,
      )
      expect(scholarshipSchema.safeParse({ ...baseScholarship, sourceUrl: url }).success).toBe(
        false,
      )
    },
  )

  it('rejects oversize text and bad dates', () => {
    expect(
      scholarshipSchema.safeParse({ ...baseScholarship, title: 'x'.repeat(201) }).success,
    ).toBe(false)
    expect(
      scholarshipSchema.safeParse({ ...baseScholarship, description: 'x'.repeat(2001) }).success,
    ).toBe(false)
    expect(scholarshipSchema.safeParse({ ...baseScholarship, deadline: 'tomorrow' }).success).toBe(
      false,
    )
  })

  it('rejects a negative amount', () => {
    expect(
      scholarshipSchema.safeParse({
        ...baseScholarship,
        amount: { value: -1, period: 'yearly' },
      }).success,
    ).toBe(false)
  })
})

describe('R6.3 profileSchema', () => {
  const ok = { name: 'Priya', preferences: [] }

  it('accepts a minimal profile', () => {
    expect(profileSchema.safeParse(ok).success).toBe(true)
  })
  it('rejects an oversize name or empty name', () => {
    expect(profileSchema.safeParse({ ...ok, name: 'a'.repeat(61) }).success).toBe(false)
    expect(profileSchema.safeParse({ ...ok, name: '   ' }).success).toBe(false)
  })
  it('bounds numbers', () => {
    expect(profileSchema.safeParse({ ...ok, annualFamilyIncome: 100_000_001 }).success).toBe(false)
    expect(profileSchema.safeParse({ ...ok, annualFamilyIncome: -1 }).success).toBe(false)
    expect(profileSchema.safeParse({ ...ok, lastExamPercent: 101 }).success).toBe(false)
    expect(profileSchema.safeParse({ ...ok, academicYear: 0 }).success).toBe(false)
    expect(profileSchema.safeParse({ ...ok, academicYear: 9 }).success).toBe(false)
    expect(profileSchema.safeParse({ ...ok, academicYear: 2.5 }).success).toBe(false)
  })
  it('limits preferences', () => {
    expect(profileSchema.safeParse({ ...ok, preferences: Array(21).fill('a') }).success).toBe(false)
    expect(profileSchema.safeParse({ ...ok, preferences: ['a'.repeat(61)] }).success).toBe(false)
  })
})

describe('R6.3 applicationSchema and documentSchema', () => {
  const app = createApplication('a', '2026-01-01T00:00:00.000Z', ['Marksheet'])

  it('accepts a normal application', () => {
    expect(applicationSchema.safeParse(app).success).toBe(true)
  })
  it('rejects notes over the limit', () => {
    expect(
      applicationSchema.safeParse({ ...app, notes: 'x'.repeat(MAX_NOTES_LENGTH + 1) }).success,
    ).toBe(false)
  })
  it('rejects an oversize id', () => {
    expect(applicationSchema.safeParse({ ...app, id: 'x'.repeat(101) }).success).toBe(false)
  })
  it('rejects an oversize document name and a bad expiry', () => {
    const doc = { id: 'd1', name: 'Marksheet', status: 'available' as const }
    expect(documentSchema.safeParse(doc).success).toBe(true)
    expect(documentSchema.safeParse({ ...doc, name: 'x'.repeat(61) }).success).toBe(false)
    expect(documentSchema.safeParse({ ...doc, expiry: 'soon' }).success).toBe(false)
    expect(documentSchema.safeParse({ ...doc, expiry: '2027-01-31' }).success).toBe(true)
  })
})

describe('R6.3 settingsSchema', () => {
  it('falls back to defaults for junk values instead of failing', () => {
    const r = settingsSchema.parse({ remindersEnabled: 'yes', theme: 'neon', language: 'xx' })
    expect(r).toMatchObject({ remindersEnabled: true, theme: 'light', language: 'en' })
  })
})
