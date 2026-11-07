export const PAGE_SIZE = 10

export interface Page<T> {
  /** The page actually shown, after clamping. */
  page: number
  totalPages: number
  items: T[]
  /** 1-based number of the first and last item on this page; both 0 when the list is empty. */
  first: number
  last: number
  total: number
}

/** Parses a ?page= value. Anything that is not a positive whole number becomes 1. */
export function parsePage(raw: string | null): number {
  const n = Number(raw)
  return Number.isInteger(n) && n >= 1 ? n : 1
}

/** Slices one page out of a list, clamping out-of-range pages. Pure. */
export function paginate<T>(list: readonly T[], page: number, pageSize: number = PAGE_SIZE): Page<T> {
  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const wanted = Number.isFinite(page) ? Math.trunc(page) : 1
  const current = Math.min(Math.max(wanted, 1), totalPages)
  const start = (current - 1) * pageSize
  const items = list.slice(start, start + pageSize)
  return {
    page: current,
    totalPages,
    items,
    first: items.length ? start + 1 : 0,
    last: items.length ? start + items.length : 0,
    total,
  }
}
