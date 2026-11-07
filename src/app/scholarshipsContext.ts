import { createContext } from 'react'
import { getScholarshipsSync } from '@/services/scholarshipService'
import type { Scholarship } from '@/types/scholarship'

/**
 * `ready`: showing the latest data. `refreshing`: showing saved data while the latest loads.
 * `offline`: the server could not be reached, so saved data is shown.
 */
export type ScholarshipsStatus = 'ready' | 'refreshing' | 'offline'

export interface ScholarshipsState {
  scholarships: Scholarship[]
  status: ScholarshipsStatus
  /** Ask the server again, ignoring the cache. */
  reload: () => void
}

/**
 * Without a provider (for example in a unit test) components still get the bundled data,
 * so they render synchronously and never see an empty list.
 */
export const ScholarshipsContext = createContext<ScholarshipsState>({
  scholarships: getScholarshipsSync(),
  status: 'ready',
  reload: () => undefined,
})
