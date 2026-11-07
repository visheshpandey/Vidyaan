import { X } from 'lucide-react'
import { levelLabel } from '@/utils/format'
import type { Filters } from './filters'

const VERDICT = {
  eligible: 'Eligible',
  needs_info: 'Needs information',
  not_eligible: 'Not eligible',
} as const

/** Removable chips for each active filter. */
export function FilterChips({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (p: Partial<Filters>) => void
}) {
  const chips: Array<{ label: string; clear: Partial<Filters> }> = []
  if (filters.verdict) chips.push({ label: VERDICT[filters.verdict], clear: { verdict: '' } })
  if (filters.level) chips.push({ label: levelLabel(filters.level), clear: { level: '' } })
  if (filters.providerType) chips.push({ label: filters.providerType, clear: { providerType: '' } })
  if (filters.closingWithin)
    chips.push({ label: `Closing in ${filters.closingWithin} days`, clear: { closingWithin: 0 } })
  if (filters.state) chips.push({ label: filters.state, clear: { state: '' } })
  if (filters.category)
    chips.push({ label: `Category ${filters.category}`, clear: { category: '' } })
  if (filters.course) chips.push({ label: filters.course, clear: { course: '' } })
  if (filters.minAmount)
    chips.push({
      label: `₹${filters.minAmount.toLocaleString('en-IN')} or more`,
      clear: { minAmount: 0 },
    })
  if (filters.savedOnly) chips.push({ label: 'Saved only', clear: { savedOnly: false } })
  if (chips.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.label}>
          <button
            onClick={() => onChange(c.clear)}
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line bg-surface px-3 text-sm capitalize hover:bg-canvas"
          >
            {c.label}
            <X size={14} aria-hidden />
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
