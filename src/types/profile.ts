export type Category = 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS'
export type Level = 'school' | 'diploma' | 'ug' | 'pg' | 'phd'
export type Gender = 'male' | 'female' | 'other'
export type InstitutionType = 'government' | 'private' | 'aided'

export interface StudentProfile {
  name: string
  educationLevel?: Level
  course?: string
  academicYear?: number
  state?: string
  institutionType?: InstitutionType
  gender?: Gender
  category?: Category
  annualFamilyIncome?: number
  lastExamPercent?: number
  disability?: boolean
  minority?: boolean
  preferences: string[]
}
