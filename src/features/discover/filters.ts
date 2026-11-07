import type { Matched, SortKey } from '@/features/matching/rank'
import { COURSES, STATES } from '@/constants/options'
import { sanitizeSearch } from '@/utils/sanitize'
import type { Category, Level } from '@/types/profile'
import type { ProviderType } from '@/types/scholarship'
import type { Verdict } from '@/types/eligibility'

export interface Filters {
  query: string
  level: Level | ''
  providerType: ProviderType | ''
  verdict: Verdict | ''
  /** Only scholarships closing within this many days; 0 means any. */
  closingWithin: 0 | 30 | 60
  /** Only scholarships open to this state (scholarships with no state rule always match). */
  state: string
  category: Category | ''
  course: string
  /** Minimum award in rupees; 0 means any amount. */
  minAmount: 0 | 10000 | 25000 | 50000
  /** Show only scholarships the student has saved. */
  savedOnly: boolean
  sort: SortKey
}

export const DEFAULT_FILTERS: Filters = {
  query: '',
  level: '',
  providerType: '',
  verdict: '',
  closingWithin: 0,
  state: '',
  category: '',
  course: '',
  minAmount: 0,
  savedOnly: false,
  sort: 'eligibility',
}

/** Applies search and filters (sorting is done by `rank`). Pure and unit-tested. */
export function applyFilters(
  items: Matched[],
  f: Filters,
  now: Date = new Date(),
  saved: string[] = [],
): Matched[] {
  const q = f.query.trim().toLowerCase()
  return items.filter(({ scholarship: s, result }) => {
    if (q) {
      const hay = [s.title, s.provider, s.description, ...(s.rules.courses ?? [])]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (f.level && s.rules.levels && !s.rules.levels.includes(f.level)) return false
    if (f.providerType && s.providerType !== f.providerType) return false
    if (f.verdict && result.verdict !== f.verdict) return false
    if (f.state && s.rules.states && !s.rules.states.includes(f.state)) return false
    if (f.category && s.rules.categories && !s.rules.categories.includes(f.category)) return false
    if (f.course && s.rules.courses && !s.rules.courses.includes(f.course)) return false
    if (f.minAmount && s.amount.value < f.minAmount) return false
    if (f.savedOnly && !saved.includes(s.id)) return false
    if (f.closingWithin) {
      if (!s.deadline) return false
      const days = (Date.parse(s.deadline) - now.getTime()) / 86_400_000
      if (days < 0 || days > f.closingWithin) return false
    }
    return true
  })
}

export function activeFilterCount(f: Filters): number {
  return [
    f.level,
    f.providerType,
    f.verdict,
    f.closingWithin,
    f.state,
    f.category,
    f.course,
    f.minAmount,
    f.savedOnly,
    f.query.trim(),
  ].filter(Boolean).length
}

const LEVELS = ['school', 'diploma', 'ug', 'pg', 'phd']
const PROVIDERS = ['government', 'private', 'university', 'ngo']
const VERDICTS = ['eligible', 'needs_info', 'not_eligible']
const SORTS = ['eligibility', 'amount', 'deadline']
const CATEGORIES = ['GEN', 'OBC', 'SC', 'ST', 'EWS']
export const AMOUNT_STEPS = [10000, 25000, 50000] as const
const pick = <T extends string>(
  value: string | null,
  allowed: string[],
  fallback: T | '',
): T | '' => (value && allowed.includes(value) ? (value as T) : fallback)

/** Reads filters from the URL. Unknown values are ignored, never trusted. */
export function filtersFromParams(p: URLSearchParams): Filters {
  const within = Number(p.get('within'))
  const amount = Number(p.get('min'))
  return {
    query: sanitizeSearch(p.get('q') ?? ''),
    level: pick<Level>(p.get('level'), LEVELS, ''),
    providerType: pick<ProviderType>(p.get('provider'), PROVIDERS, ''),
    verdict: pick<Verdict>(p.get('verdict'), VERDICTS, ''),
    closingWithin: within === 30 || within === 60 ? within : 0,
    state: pick<string>(p.get('state'), STATES, ''),
    category: pick<Category>(p.get('category'), CATEGORIES, ''),
    course: pick<string>(p.get('course'), COURSES, ''),
    minAmount: amount === 10000 || amount === 25000 || amount === 50000 ? amount : 0,
    savedOnly: p.get('saved') === '1',
    sort: pick<SortKey>(p.get('sort'), SORTS, 'eligibility') || 'eligibility',
  }
}

/** Writes only non-default filters so URLs stay short. */
export function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.query.trim()) p.set('q', f.query.trim())
  if (f.level) p.set('level', f.level)
  if (f.providerType) p.set('provider', f.providerType)
  if (f.verdict) p.set('verdict', f.verdict)
  if (f.closingWithin) p.set('within', String(f.closingWithin))
  if (f.state) p.set('state', f.state)
  if (f.category) p.set('category', f.category)
  if (f.course) p.set('course', f.course)
  if (f.minAmount) p.set('min', String(f.minAmount))
  if (f.savedOnly) p.set('saved', '1')
  if (f.sort !== 'eligibility') p.set('sort', f.sort)
  return p
}
