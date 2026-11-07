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
 * All scholarships, read from the server (cached for 10 minutes, validated per record) with a fallback to the
 * bundled data. Also says whether the data came from the network or the offline fallback, which the
 * scholarship provider uses to show an offline notice.
 */
export async function refreshScholarships(
  options: RefreshOptions = {},
): Promise<{ scholarships: Scholarship[]; source: 'network' | 'fallback' }> {
  return scholarshipsApi.fetchScholarshipsWithSource(options)
}

/**
 * The bundled data, available instantly. The scholarship provider renders from this on first paint,
 * then refreshes through `refreshScholarships`. UI components should use `useScholarships()` instead.
 */
export function getScholarshipsSync(): Scholarship[] {
  return loadBundledScholarships()
}
