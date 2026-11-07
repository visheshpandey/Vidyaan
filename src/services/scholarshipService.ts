import { z } from 'zod'
import raw from '@/data/scholarships.json'
import { scholarshipSchema } from '@/data/schemas'
import type { Scholarship } from '@/types/scholarship'

let cache: Scholarship[] | null = null

/** Parses and validates the bundled scholarship records (invalid records are dropped). */
function load(): Scholarship[] {
  if (cache) return cache
  const parsed = z.array(z.unknown()).parse(raw)
  cache = parsed.flatMap((item) => {
    const r = scholarshipSchema.safeParse(item)
    return r.success ? [r.data] : []
  })
  return cache
}

/** Async on purpose: mirrors a real API so a backend can replace it later. */
export async function listScholarships(): Promise<Scholarship[]> {
  return load()
}

export async function getScholarship(id: string): Promise<Scholarship | undefined> {
  return load().find((s) => s.id === id)
}

/** Synchronous accessor for derived selectors (data is bundled, so this is safe). */
export function getScholarshipsSync(): Scholarship[] {
  return load()
}
