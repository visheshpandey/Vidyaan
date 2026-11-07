import { loadBundledScholarships } from '@/api/bundledScholarships'
import { scholarshipsApi } from '@/api/scholarshipsApi'
import type { Scholarship } from '@/types/scholarship'

interface RefreshOptions {
  /** Cancels the request, for example when a component unmounts. */
  signal?: AbortSignal
  /** Skip the cache and ask the server again. */
  force?: boolean
}

/**
 * All scholarships. Read from the server (cached for 10 minutes, validated per record),
 * with a fallback to the bundled data if the server cannot be reached.
 */
export async function listScholarships(): Promise<Scholarship[]> {
  return scholarshipsApi.fetchScholarships()
}

/**
 * Like `listScholarships`, but also says whether the data came from the network or from the offline fallback.
 * This is what the app's scholarship provider uses to show an offline notice.
 */
export async function refreshScholarships(
  options: RefreshOptions = {},
): Promise<{ scholarships: Scholarship[]; source: 'network' | 'fallback' }> {
  return scholarshipsApi.fetchScholarshipsWithSource(options)
}

/** One scholarship by id, or undefined if it does not exist. */
export async function getScholarship(id: string): Promise<Scholarship | undefined> {
  const all = await scholarshipsApi.fetchScholarships()
  return all.find((s) => s.id === id)
}

/**
 * The bundled data, available instantly. The scholarship provider renders from this on first paint,
 * then refreshes through `refreshScholarships`. UI components should use `useScholarships()` instead.
 */
export function getScholarshipsSync(): Scholarship[] {
  return loadBundledScholarships()
}
