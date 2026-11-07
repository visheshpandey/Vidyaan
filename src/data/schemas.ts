import { z } from 'zod'
import { APPLICATION_STATUSES } from '@/types/tracker'
import type { Application } from '@/types/tracker'
import type { DocumentItem } from '@/types/document'
import type { StudentProfile } from '@/types/profile'
import type { Scholarship } from '@/types/scholarship'

const level = z.enum(['school', 'diploma', 'ug', 'pg', 'phd'])
const category = z.enum(['GEN', 'OBC', 'SC', 'ST', 'EWS'])
const gender = z.enum(['male', 'female', 'other'])

export const profileSchema: z.ZodType<StudentProfile> = z.object({
  name: z.string().trim().min(1).max(80),
  educationLevel: level.optional(),
  course: z.string().max(80).optional(),
  academicYear: z.number().int().min(1).max(8).optional(),
  state: z.string().max(60).optional(),
  institutionType: z.enum(['government', 'private', 'aided']).optional(),
  gender: gender.optional(),
  category: category.optional(),
  annualFamilyIncome: z.number().min(0).max(1_000_000_000).optional(),
  lastExamPercent: z.number().min(0).max(100).optional(),
  disability: z.boolean().optional(),
  minority: z.boolean().optional(),
  preferences: z.array(z.string().max(60)).max(20),
})

export const applicationSchema: z.ZodType<Application> = z.object({
  id: z.string(),
  scholarshipId: z.string(),
  status: z.enum(APPLICATION_STATUSES),
  notes: z.string().max(2000),
  documentChecklist: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  history: z.array(z.object({ status: z.enum(APPLICATION_STATUSES), at: z.string() })),
})

export const documentSchema: z.ZodType<DocumentItem> = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(100),
  status: z.enum(['available', 'missing']),
  expiry: z.string().optional(),
})

const rulesSchema = z.object({
  levels: z.array(level).optional(),
  courses: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),
  categories: z.array(category).optional(),
  genders: z.array(gender).optional(),
  maxIncome: z.number().optional(),
  minPercent: z.number().optional(),
  disabilityRequired: z.boolean().optional(),
  minorityRequired: z.boolean().optional(),
})

export const scholarshipSchema: z.ZodType<Scholarship> = z.object({
  id: z.string(),
  title: z.string(),
  provider: z.string(),
  providerType: z.enum(['government', 'private', 'university', 'ngo']),
  type: z.enum(['merit', 'need', 'special']),
  description: z.string(),
  benefits: z.array(z.string()),
  amount: z.object({ value: z.number(), period: z.enum(['one-time', 'yearly', 'monthly']) }),
  deadline: z.string().nullable(),
  rules: rulesSchema,
  requiredDocuments: z.array(z.string()),
  steps: z.array(z.string()),
  applicationUrl: z.string().url(),
  sourceUrl: z.string().url(),
  lastVerifiedAt: z.string().optional(),
  dataType: z.enum(['sample', 'verified']),
})

export const settingsSchema = z.object({
  remindersEnabled: z.boolean().catch(true),
  theme: z.enum(['light', 'dark']).catch('light'),
  language: z.enum(['en', 'hi']).catch('en'),
  /** ISO date of the last day a browser reminder was shown. */
  lastNotifiedOn: z.string().optional().catch(undefined),
})
export type Settings = z.infer<typeof settingsSchema>
export const DEFAULT_SETTINGS: Settings = { remindersEnabled: true, theme: 'light', language: 'en' }
