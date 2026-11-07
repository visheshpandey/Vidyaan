import { z } from 'zod'
import { MAX_NOTES_LENGTH } from '@/constants/limits'
import { isIsoDate, isSafeHttpUrl, TEXT_LIMITS } from '@/utils/sanitize'
import { APPLICATION_STATUSES } from '@/types/tracker'
import type { Application } from '@/types/tracker'
import type { DocumentItem } from '@/types/document'
import type { StudentProfile } from '@/types/profile'
import type { Scholarship } from '@/types/scholarship'

/** Numeric bounds shared by schemas, validation and the profile store. */
export const LIMITS = {
  maxIncome: 100_000_000,
  maxPercent: 100,
  minYear: 1,
  maxYear: 8,
} as const

const level = z.enum(['school', 'diploma', 'ug', 'pg', 'phd'])
const category = z.enum(['GEN', 'OBC', 'SC', 'ST', 'EWS'])
const gender = z.enum(['male', 'female', 'other'])

/** A YYYY-MM-DD calendar date. */
const isoDate = z.string().refine(isIsoDate, 'must be a date written as YYYY-MM-DD')
/** A full ISO timestamp as written by `Date.toISOString()`. */
const timestamp = z.string().max(40)
/** An http(s) URL. Blocks javascript:, data: and other schemes that could run code when clicked. */
const httpUrl = z.string().max(2048).refine(isSafeHttpUrl, 'must be an http(s) URL')
const shortId = z.string().min(1).max(100)

export const profileSchema: z.ZodType<StudentProfile> = z.object({
  name: z.string().trim().min(1).max(TEXT_LIMITS.name),
  educationLevel: level.optional(),
  course: z.string().max(80).optional(),
  academicYear: z.number().int().min(LIMITS.minYear).max(LIMITS.maxYear).optional(),
  state: z.string().max(60).optional(),
  institutionType: z.enum(['government', 'private', 'aided']).optional(),
  gender: gender.optional(),
  category: category.optional(),
  annualFamilyIncome: z.number().min(0).max(LIMITS.maxIncome).optional(),
  lastExamPercent: z.number().min(0).max(LIMITS.maxPercent).optional(),
  disability: z.boolean().optional(),
  minority: z.boolean().optional(),
  preferences: z.array(z.string().max(60)).max(20),
})

export const applicationSchema: z.ZodType<Application> = z.object({
  id: shortId,
  scholarshipId: shortId,
  status: z.enum(APPLICATION_STATUSES),
  notes: z.string().max(MAX_NOTES_LENGTH),
  documentChecklist: z.array(z.string().max(TEXT_LIMITS.documentName)).max(50),
  createdAt: timestamp,
  updatedAt: timestamp,
  history: z.array(z.object({ status: z.enum(APPLICATION_STATUSES), at: timestamp })).max(200),
})

export const documentSchema: z.ZodType<DocumentItem> = z.object({
  id: shortId,
  name: z.string().trim().min(1).max(TEXT_LIMITS.documentName),
  status: z.enum(['available', 'missing']),
  expiry: isoDate.optional(),
})

const rulesSchema = z.object({
  levels: z.array(level).max(5).optional(),
  courses: z.array(z.string().max(80)).max(50).optional(),
  states: z.array(z.string().max(60)).max(40).optional(),
  categories: z.array(category).max(5).optional(),
  genders: z.array(gender).max(3).optional(),
  maxIncome: z.number().min(0).max(LIMITS.maxIncome).optional(),
  minPercent: z.number().min(0).max(LIMITS.maxPercent).optional(),
  disabilityRequired: z.boolean().optional(),
  minorityRequired: z.boolean().optional(),
})

export const scholarshipSchema: z.ZodType<Scholarship> = z.object({
  id: shortId,
  title: z.string().min(1).max(200),
  provider: z.string().min(1).max(200),
  providerType: z.enum(['government', 'private', 'university', 'ngo']),
  type: z.enum(['merit', 'need', 'special']),
  description: z.string().max(2000),
  benefits: z.array(z.string().max(300)).max(20),
  amount: z.object({
    value: z.number().min(0).max(LIMITS.maxIncome),
    period: z.enum(['one-time', 'yearly', 'monthly']),
  }),
  deadline: isoDate.nullable(),
  rules: rulesSchema,
  requiredDocuments: z.array(z.string().max(TEXT_LIMITS.documentName)).max(30),
  steps: z.array(z.string().max(500)).max(20),
  applicationUrl: httpUrl,
  sourceUrl: httpUrl,
  lastVerifiedAt: z.string().max(40).optional(),
  dataType: z.enum(['sample', 'verified']),
})

export const settingsSchema = z.object({
  remindersEnabled: z.boolean().catch(true),
  theme: z.enum(['light', 'dark']).catch('light'),
  language: z.enum(['en', 'hi']).catch('en'),
  /** ISO date of the last day a browser reminder was shown. */
  lastNotifiedOn: isoDate.optional().catch(undefined),
})
export type Settings = z.infer<typeof settingsSchema>
export const DEFAULT_SETTINGS: Settings = { remindersEnabled: true, theme: 'light', language: 'en' }
