import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SEARCH_DEBOUNCE_MS } from '@/constants/limits'
import { useDebounce } from '@/hooks/useDebounce'
import { sanitizeSearch } from '@/utils/sanitize'
import { activeFilterCount, filtersFromParams, filtersToParams, type Filters } from './filters'

/**
 * Discover's filter state, kept in the URL so results can be shared and bookmarked.
 * The search box is local and debounced; the URL follows it once typing settles.
 */
export function useDiscoverFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])
  const [text, setText] = useState(filters.query)
  const query = useDebounce(text, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    const clean = sanitizeSearch(query)
    if (query === text && clean !== filters.query) {
      setParams(filtersToParams({ ...filters, query: clean }), { replace: true })
    }
  }, [query, text, filters, setParams])

  const patch = (change: Partial<Filters>) =>
    setParams(filtersToParams({ ...filters, ...change }), { replace: true })

  const reset = () => {
    setParams({}, { replace: true })
    setText('')
  }

  return { filters, text, setText, patch, reset, activeCount: activeFilterCount(filters) }
}
