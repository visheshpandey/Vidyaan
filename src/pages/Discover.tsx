import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { SEARCH_DEBOUNCE_MS } from '@/constants/limits'
import { FilterChips } from '@/features/discover/FilterChips'
import { FilterControls } from '@/features/discover/FilterControls'
import {
  activeFilterCount,
  applyFilters,
  filtersFromParams,
  filtersToParams,
  type Filters,
} from '@/features/discover/filters'
import { rank } from '@/features/matching/rank'
import { ScholarshipRow } from '@/features/scholarships/ScholarshipRow'
import { useDebounce } from '@/hooks/useDebounce'
import { useT } from '@/i18n/useT'
import { useMatches } from '@/hooks/useMatches'

export default function Discover() {
  const matches = useMatches()
  const t = useT()
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [text, setText] = useState(filters.query)
  const query = useDebounce(text, SEARCH_DEBOUNCE_MS)
  const patch = (p: Partial<Filters>) =>
    setParams(filtersToParams({ ...filters, ...p, query: p.query ?? filters.query }), {
      replace: true,
    })
  const effective = filters

  // Keep the URL in step with the (debounced) search box so results can be shared and bookmarked.
  useEffect(() => {
    if (query === text && query !== filters.query)
      setParams(filtersToParams({ ...filters, query }), { replace: true })
  }, [query, text, filters, setParams])

  const results = useMemo(
    () => rank(applyFilters(matches, effective), effective.sort),
    [matches, effective],
  )
  const reset = () => {
    setParams({}, { replace: true })
    setText('')
  }
  const activeCount = activeFilterCount(effective)

  return (
    <>
      <PageHeader
        title={t('discover.title')}
        subtitle="Scholarships ranked by how well they fit your profile."
      />
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search scholarships
          </label>
          <input
            id="search"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('discover.search')}
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full rounded-control border border-line bg-surface px-3 text-sm placeholder:text-muted"
          />
        </div>
        <Button variant="secondary" className="lg:hidden" onClick={() => setSheetOpen(true)}>
          <SlidersHorizontal size={16} aria-hidden /> Filters
          {activeCount ? ` (${activeCount})` : ''}
        </Button>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filters">
          <Card>
            <FilterControls filters={filters} onChange={patch} />
          </Card>
        </aside>
        <section aria-label="Results" className="space-y-4">
          <FilterChips filters={filters} onChange={patch} />
          <p role="status" aria-live="polite" className="text-sm text-muted">
            Showing {results.length} of {matches.length} scholarships
          </p>
          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No scholarships match"
              action={<Button onClick={reset}>Clear search and filters</Button>}
            >
              Try removing a filter or searching with fewer words.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {results.map((m) => (
                <ScholarshipRow key={m.scholarship.id} item={m} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal open={sheetOpen} onOpenChange={setSheetOpen} title="Filters" variant="sheet">
        <FilterControls filters={filters} onChange={patch} />
        <div className="mt-5 flex justify-between gap-2">
          <Button variant="secondary" onClick={reset}>
            Reset
          </Button>
          <Button onClick={() => setSheetOpen(false)}>Show {results.length} results</Button>
        </div>
      </Modal>
    </>
  )
}
