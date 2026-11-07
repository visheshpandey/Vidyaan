import { CheckboxField, SelectField } from '@/components/ui/Field'
import { CATEGORY_OPTIONS, COURSES, LEVEL_OPTIONS, STATES } from '@/constants/options'
import type { Category, Level } from '@/types/profile'
import { toOptions } from '@/utils/forms'
import type { ProviderType } from '@/types/scholarship'
import type { Verdict } from '@/types/eligibility'
import type { SortKey } from '@/features/matching/rank'
import { AMOUNT_STEPS, type Filters } from './filters'

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
        label="State"
        placeholder="Any"
        value={filters.state}
        onChange={(e) => onChange({ state: e.target.value })}
        options={toOptions(STATES)}
      />
      <SelectField
        label="Category"
        placeholder="Any"
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value as Category | '' })}
        options={CATEGORY_OPTIONS}
      />
      <SelectField
        label="Course"
        placeholder="Any"
        value={filters.course}
        onChange={(e) => onChange({ course: e.target.value })}
        options={toOptions(COURSES)}
      />
      <SelectField
        label="Minimum award"
        value={String(filters.minAmount)}
        onChange={(e) => onChange({ minAmount: Number(e.target.value) as Filters['minAmount'] })}
        options={[
          { value: '0', label: 'Any amount' },
          ...AMOUNT_STEPS.map((n) => ({
            value: String(n),
            label: `₹${n.toLocaleString('en-IN')} or more`,
          })),
        ]}
      />
      <SelectField
        label="Closing within"
        value={String(filters.closingWithin)}
        onChange={(e) =>
          onChange({ closingWithin: Number(e.target.value) as Filters['closingWithin'] })
        }
        options={[
          { value: '0', label: 'Any time' },
          { value: '30', label: '30 days' },
          { value: '60', label: '60 days' },
        ]}
      />
      <CheckboxField
        label="Saved scholarships only"
        checked={filters.savedOnly}
        onChange={(e) => onChange({ savedOnly: e.target.checked })}
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
