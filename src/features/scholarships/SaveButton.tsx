import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useT } from '@/i18n/useT'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'

/** Toggles a scholarship in the saved list and announces the result. */
export function SaveButton({
  id,
  title,
  compact,
}: {
  id: string
  title: string
  compact?: boolean
}) {
  const isSaved = useTrackerStore((s) => s.saved.includes(id))
  const toggle = useTrackerStore((s) => s.toggleSaved)
  const notify = useUiStore((s) => s.notify)
  const t = useT()
  const Icon = isSaved ? BookmarkCheck : Bookmark
  return (
    <Button
      variant="secondary"
      size="sm"
      aria-pressed={isSaved}
      aria-label={`${isSaved ? 'Unsave' : 'Save'} ${title}`}
      onClick={() => notify(toggle(id) ? 'Saved to your list' : 'Removed from saved', 'info')}
    >
      <Icon size={16} aria-hidden />
      {!compact && (isSaved ? t('common.saved') : t('common.save'))}
    </Button>
  )
}
