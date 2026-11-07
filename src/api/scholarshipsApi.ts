import { z } from 'zod'
import { env } from '@/config/env'
import { scholarshipSchema } from '@/data/schemas'
import type { Scholarship } from '@/types/scholarship'
import { loadBundledScholarships } from './bundledScholarships'
import { TtlCache } from './cache'
import { getJson } from './httpClient'

const responseSchema = z.array(scholarshipSchema)
const CACHE_KEY = 'scholarships'

interface ScholarshipsApiConfig {
  baseUrl: string | undefined
  timeoutMs: number
  cacheMs: number
  /** Clock for the cache, injectable for tests. */
  now?: () => number
}

interface ScholarshipsApi {
  /** Returns scholarships from the backend (cached), or the bundled data if there is no backend or it fails. */
  fetchScholarships: () => Promise<Scholarship[]>
}

/**
 * Builds the scholarships data source.
 * No base URL: bundled data. With a base URL: GET /scholarships, cached, falling back to bundled data on any failure.
 */
export function createScholarshipsApi(config: ScholarshipsApiConfig): ScholarshipsApi {
  const cache = new TtlCache<Scholarship[]>(config.cacheMs, config.now)

  return {
    async fetchScholarships() {
      if (!config.baseUrl) return loadBundledScholarships()

      const cached = cache.get(CACHE_KEY)
      if (cached) return cached

      try {
        const fresh = await getJson('/scholarships', responseSchema, {
          baseUrl: config.baseUrl,
          timeoutMs: config.timeoutMs,
        })
        cache.set(CACHE_KEY, fresh)
        return fresh
      } catch {
        // The app must keep working offline or when the backend is down.
        return loadBundledScholarships()
      }
    },
  }
}

/** The app-wide instance, configured from environment variables. */
export const scholarshipsApi: ScholarshipsApi = createScholarshipsApi({
  baseUrl: env.apiBaseUrl,
  timeoutMs: env.apiTimeoutMs,
  cacheMs: env.apiCacheMs,
})
