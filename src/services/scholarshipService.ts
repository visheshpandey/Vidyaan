import { loadBundledScholarships } from '@/api/bundledScholarships'
import { scholarshipsApi } from '@/api/scholarshipsApi'
import type { Scholarship } from '@/types/scholarship'

/**
 * All scholarships. Async on purpose: with VITE_API_BASE_URL set this comes from our backend
 * (cached, with a fallback to bundled data). Without it, it returns the bundled data.
 */
export async function listScholarships(): Promise<Scholarship[]> {
  return scholarshipsApi.fetchScholarships()
}

/** One scholarship by id, or undefined if it does not exist. */
export async function getScholarship(id: string): Promise<Scholarship | undefined> {
  const all = await scholarshipsApi.fetchScholarships()
  return all.find((s) => s.id === id)
}

/**
 * Synchronous accessor for derived selectors. Always the bundled data, which is
 * what the UI renders from today. Switch components to `listScholarships` to use a backend.
 */
export function getScholarshipsSync(): Scholarship[] {
  return loadBundledScholarships()
}
