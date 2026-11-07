import { CircleAlert, CircleCheck, CircleX } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Verdict } from '@/types/eligibility'

const CONFIG = {
  eligible: { tone: 'success', label: 'Eligible', Icon: CircleCheck },
  needs_info: { tone: 'warning', label: 'Needs information', Icon: CircleAlert },
  not_eligible: { tone: 'danger', label: 'Not eligible', Icon: CircleX },
} as const

/** Icon plus text, so the verdict never relies on colour alone. */
export function StatusBadge({ verdict }: { verdict: Verdict }) {
  const { tone, label, Icon } = CONFIG[verdict]
  return (
    <Badge tone={tone} icon={<Icon size={14} aria-hidden />}>
      {label}
    </Badge>
  )
}
