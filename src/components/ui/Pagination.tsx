import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const btn =
  'inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-control border border-line bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

/** Previous/next paging with a "Page X of Y" label. Renders nothing for a single page. */
export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-2">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} aria-hidden /> Previous
      </button>
      <span aria-current="page" className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className={btn}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next <ChevronRight size={16} aria-hidden />
      </button>
    </nav>
  )
}
