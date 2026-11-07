export const APPLICATION_STATUSES = [
  'saved',
  'preparing',
  'submitted',
  'under_review',
  'approved',
  'disbursed',
  'not_selected',
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

interface StatusChange {
  status: ApplicationStatus
  at: string
}

export interface Application {
  id: string
  scholarshipId: string
  status: ApplicationStatus
  notes: string
  documentChecklist: string[]
  createdAt: string
  updatedAt: string
  history: StatusChange[]
  /** Indexes of the application guide steps the student has ticked off. */
  stepsDone: number[]
}
