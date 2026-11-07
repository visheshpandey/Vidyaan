import { useMemo } from 'react'
import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { ROUTES } from '@/constants/routes'
import { rank } from '@/features/matching/rank'
import { ScholarshipRow } from '@/features/scholarships/ScholarshipRow'
import { useMatches } from '@/hooks/useMatches'
import { usePagination } from '@/hooks/usePagination'
import { useTrackerStore } from '@/store/trackerStore'

export default function Saved() {
  const saved = useTrackerStore((s) => s.saved)
  const matches = useMatches()
  const items = useMemo(
    () =>
      rank(
        matches.filter((m) => saved.includes(m.scholarship.id)),
        'deadline',
      ),
    [matches, saved],
  )
  const { view, setPage, scrollRef } = usePagination(items)
  return (
    <>
      <PageHeader title="Saved" subtitle="Scholarships you bookmarked, soonest deadline first." />
      {items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          action={
            <Link to={ROUTES.discover} className={buttonClass()}>
              Browse scholarships
            </Link>
          }
        >
          Save scholarships from Discover to compare and come back to them later.
        </EmptyState>
      ) : (
        <section
          aria-label="Saved scholarships"
          ref={scrollRef}
          className="scroll-mt-4 space-y-3"
        >
          {view.total > view.items.length && (
            <p role="status" aria-live="polite" className="text-sm text-muted">
              Showing {view.first} to {view.last} of {view.total} saved scholarships
            </p>
          )}
          {view.items.map((m) => (
            <ScholarshipRow key={m.scholarship.id} item={m} />
          ))}
          <Pagination page={view.page} totalPages={view.totalPages} onChange={setPage} />
        </section>
      )}
    </>
  )
}
