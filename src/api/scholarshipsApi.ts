import { z } from 'zod'
import { env } from '@/config/env'
import { scholarshipSchema } from '@/data/schemas'
import type { Scholarship } from '@/types/scholarship'
import { loadBundledScholarships } from './bundledScholarships'
import { TtlCache } from './cache'
import { getJson } from './httpClient'

const CACHE_KEY = 'scholarships'
/** Where the scholarship list is served from when no backend is configured (same origin as the app). */
const STATIC_PATH = '/data/scholarships.json'

interface ScholarshipsApiConfig {
  baseUrl: string | undefined
  timeoutMs: number
  cacheMs: number
  /** Clock for the cache, injectable for tests. */
  now?: () => number
}

/** Where a list of scholarships came from. `fallback` means the network failed and bundled data was used. */
type ScholarshipsSource = 'network' | 'fallback'

interface FetchOptions {
  /** Cancels the request, for example when a component unmounts. */
  signal?: AbortSignal
  /** Skip the cache and ask the server again. */
  force?: boolean
}

interface ScholarshipsResult {
  scholarships: Scholarship[]
  source: ScholarshipsSource
}

interface ScholarshipsApi {
  /** Scholarships plus where they came from, so the UI can say when it is showing saved data. */
  fetchScholarshipsWithSource: (options?: FetchOptions) => Promise<ScholarshipsResult>
  /** Scholarships only. Falls back to bundled data on any failure. */
  fetchScholarships: (options?: FetchOptions) => Promise<Scholarship[]>
  /** Forgets cached results. Used by tests and by "try again" flows. */
  clearCache: () => void
}

/** Keeps the records that pass validation and drops the rest, so one bad record never hides the others. */
function keepValidRecords(records: unknown[]): Scholarship[] {
  return records.flatMap((record) => {
    const parsed = scholarshipSchema.safeParse(record)
    return parsed.success ? [parsed.data] : []
  })
}

/**
 * Builds the scholarships data source.
 * With a base URL it calls `GET {base}/scholarships`; without one it reads `/data/scholarships.json`
 * from the same origin. Either way: validated per record, cached, and bundled data on any failure.
 */
export function createScholarshipsApi(config: ScholarshipsApiConfig): ScholarshipsApi {
  const cache = new TtlCache<Scholarship[]>(config.cacheMs, config.now)

  async function fetchScholarshipsWithSource(
    options: FetchOptions = {},
  ): Promise<ScholarshipsResult> {
    if (options.force) cache.clear()
    const cached = cache.get(CACHE_KEY)
    if (cached) return { scholarships: cached, source: 'network' }

    try {
      const records = await getJson(
        config.baseUrl ? '/scholarships' : STATIC_PATH,
        z.array(z.unknown()),
        { baseUrl: config.baseUrl ?? '', timeoutMs: config.timeoutMs, signal: options.signal },
      )
      const valid = keepValidRecords(records)
      if (valid.length === 0) throw new Error('No valid scholarships in the response')
      cache.set(CACHE_KEY, valid)
      return { scholarships: valid, source: 'network' }
    } catch {
      // The app must keep working offline or when the server is down.
      return { scholarships: loadBundledScholarships(), source: 'fallback' }
    }
  }

  return {
    fetchScholarshipsWithSource,
    async fetchScholarships(options) {
      return (await fetchScholarshipsWithSource(options)).scholarships
    },
    clearCache() {
      cache.clear()
    },
  }
}

/** The app-wide instance, configured from environment variables. */
export const scholarshipsApi: ScholarshipsApi = createScholarshipsApi({
  baseUrl: env.apiBaseUrl,
  timeoutMs: env.apiTimeoutMs,
  cacheMs: env.apiCacheMs,
})
