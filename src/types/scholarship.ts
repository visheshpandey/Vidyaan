import type { Category, Gender, Level } from './profile'

export interface EligibilityRules {
  levels?: Level[]
  courses?: string[]
  states?: string[]
  categories?: Category[]
  genders?: Gender[]
  maxIncome?: number
  minPercent?: number
  disabilityRequired?: boolean
  minorityRequired?: boolean
}

export type ProviderType = 'government' | 'private' | 'university' | 'ngo'
export type ScholarshipType = 'merit' | 'need' | 'special'
export type AmountPeriod = 'one-time' | 'yearly' | 'monthly'

export interface Scholarship {
  id: string
  title: string
  provider: string
  providerType: ProviderType
  type: ScholarshipType
  description: string
  benefits: string[]
  amount: { value: number; period: AmountPeriod }
  /** ISO date, or null when the official deadline is unknown ("Check official site"). */
  deadline: string | null
  rules: EligibilityRules
  requiredDocuments: string[]
  steps: string[]
  applicationUrl: string
  sourceUrl: string
  lastVerifiedAt?: string
  dataType: 'sample' | 'verified'
}
