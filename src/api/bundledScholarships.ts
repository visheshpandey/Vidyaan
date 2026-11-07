import { z } from 'zod'
import raw from '@/data/scholarships.json'
import { scholarshipSchema } from '@/data/schemas'
import type { Scholarship } from '@/types/scholarship'

let cache: Scholarship[] | null = null

/**
 * The scholarships that ship inside the app. Invalid records are dropped.
 * Used as the data source when no backend is configured, and as the fallback when the backend fails.
 */
export function loadBundledScholarships(): Scholarship[] {
  if (cache) return cache
  const parsed = z.array(z.unknown()).parse(raw)
  cache = parsed.flatMap((item) => {
    const result = scholarshipSchema.safeParse(item)
    return result.success ? [result.data] : []
  })
  return cache
}
