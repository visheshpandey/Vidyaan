import { useEffect, useMemo, useRef, useState } from 'react'
import { paginate, type Page } from '@/features/discover/paginate'

/**
 * Local (non-URL) pagination, used by pages like Saved. The page resets to 1 when the list
 * shrinks past it, and `scrollRef` is scrolled into view when the page changes.
 */
export function usePagination<T>(list: readonly T[], pageSize?: number) {
  const [requested, setPage] = useState(1)
  const view: Page<T> = useMemo(() => paginate(list, requested, pageSize), [list, requested, pageSize])
  const scrollRef = useRef<HTMLElement | null>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    scrollRef.current?.scrollIntoView?.({ block: 'start' })
  }, [view.page])

  return { view, setPage, scrollRef }
}
