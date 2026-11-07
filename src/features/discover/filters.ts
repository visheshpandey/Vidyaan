import type { Matched, SortKey } from '@/features/matching/rank'
import type { Level } from '@/types/profile'
import type { ProviderType } from '@/types/scholarship'
import type { Verdict } from '@/types/eligibility'

export interface Filters {
  query: string
  level: Level | ''
  providerType: ProviderType | ''
  verdict: Verdict | ''
  /** Only scholarships closing within this many days; 0 means any. */
  closingWithin: 0 | 30 | 60
  sort: SortKey
}

export const DEFAULT_FILTERS: Filters = {
  query: '',
  level: '',
  providerType: '',
  verdict: '',
  closingWithin: 0,
  sort: 'eligibility',
}

/** Applies search and filters (sorting is done by `rank`). Pure and unit-tested. */
export function applyFilters(items: Matched[], f: Filters, now: Date = new Date()): Matched[] {
  const q = f.query.trim().toLowerCase()
  return items.filter(({ scholarship: s, result }) => {
    if (q) {
      const hay = [s.title, s.provider, s.description, ...(s.rules.courses ?? [])].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (f.level && s.rules.levels && !s.rules.levels.includes(f.level)) return false
    if (f.providerType && s.providerType !== f.providerType) return false
    if (f.verdict && result.verdict !== f.verdict) return false
    if (f.closingWithin) {
      if (!s.deadline) return false
      const days = (Date.parse(s.deadline) - now.getTime()) / 86_400_000
      if (days < 0 || days > f.closingWithin) return false
    }
    return true
  })
}

export function activeFilterCount(f: Filters): number {
  return [f.level, f.providerType, f.verdict, f.closingWithin, f.query.trim()].filter(Boolean).length
}
