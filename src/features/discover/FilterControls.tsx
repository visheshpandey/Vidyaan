import { SelectField } from '@/components/ui/Field'
import { LEVEL_OPTIONS } from '@/constants/options'
import type { Level } from '@/types/profile'
import type { ProviderType } from '@/types/scholarship'
import type { Verdict } from '@/types/eligibility'
import type { SortKey } from '@/features/matching/rank'
import type { Filters } from './filters'

interface Props {
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
}

/** The filter fields, shared by the desktop panel and the mobile sheet. */
export function FilterControls({ filters, onChange }: Props) {
  return (
    <div className="space-y-4">
      <SelectField
        label="Eligibility"
        placeholder="Any"
        value={filters.verdict}
        onChange={(e) => onChange({ verdict: e.target.value as Verdict | '' })}
        options={[
          { value: 'eligible', label: 'Eligible' },
          { value: 'needs_info', label: 'Needs information' },
          { value: 'not_eligible', label: 'Not eligible' },
        ]}
      />
      <SelectField
        label="Education level"
        placeholder="Any"
        value={filters.level}
        onChange={(e) => onChange({ level: e.target.value as Level | '' })}
        options={LEVEL_OPTIONS}
      />
      <SelectField
        label="Provider"
        placeholder="Any"
        value={filters.providerType}
        onChange={(e) => onChange({ providerType: e.target.value as ProviderType | '' })}
        options={[
          { value: 'government', label: 'Government' },
          { value: 'private', label: 'Private' },
          { value: 'university', label: 'University' },
          { value: 'ngo', label: 'NGO' },
        ]}
      />
      <SelectField
        label="Closing within"
        value={String(filters.closingWithin)}
        onChange={(e) => onChange({ closingWithin: Number(e.target.value) as Filters['closingWithin'] })}
        options={[
          { value: '0', label: 'Any time' },
          { value: '30', label: '30 days' },
          { value: '60', label: '60 days' },
        ]}
      />
      <SelectField
        label="Sort by"
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value as SortKey })}
        options={[
          { value: 'eligibility', label: 'Best match' },
          { value: 'deadline', label: 'Deadline soonest' },
          { value: 'amount', label: 'Highest amount' },
        ]}
      />
    </div>
  )
}
