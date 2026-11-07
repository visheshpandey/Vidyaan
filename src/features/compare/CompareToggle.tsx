import { MAX_COMPARE, useCompareStore } from '@/store/compareStore'
import { useUiStore } from '@/store/uiStore'

/** "Compare" checkbox on a scholarship card. */
export function CompareToggle({ id, title }: { id: string; title: string }) {
  const selected = useCompareStore((s) => s.ids.includes(id))
  const toggle = useCompareStore((s) => s.toggle)
  const notify = useUiStore((s) => s.notify)
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-2 text-sm text-muted">
      <input
        type="checkbox"
        checked={selected}
        aria-label={`Compare ${title}`}
        className="size-4 accent-secondary"
        onChange={() => {
          if (!toggle(id)) notify(`You can compare up to ${MAX_COMPARE} scholarships`, 'info')
        }}
      />
      Compare
    </label>
  )
}
