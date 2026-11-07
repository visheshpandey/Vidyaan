import { useContext } from 'react'
import { ScholarshipsContext, type ScholarshipsState } from '@/app/scholarshipsContext'

/**
 * The scholarship list, how fresh it is, and a way to reload it.
 * Always returns data: the bundled list at first, then the latest list from the server.
 */
export function useScholarships(): ScholarshipsState {
  return useContext(ScholarshipsContext)
}
