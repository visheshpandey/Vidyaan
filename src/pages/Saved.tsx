import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { rank } from '@/features/matching/rank'
import { ScholarshipRow } from '@/features/scholarships/ScholarshipRow'
import { useMatches } from '@/hooks/useMatches'
import { useTrackerStore } from '@/store/trackerStore'

export default function Saved() {
  const saved = useTrackerStore((s) => s.saved)
  const matches = useMatches()
  const items = rank(
    matches.filter((m) => saved.includes(m.scholarship.id)),
    'deadline',
  )
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
        <div className="space-y-3">
          {items.map((m) => (
            <ScholarshipRow key={m.scholarship.id} item={m} />
          ))}
        </div>
      )}
    </>
  )
}
