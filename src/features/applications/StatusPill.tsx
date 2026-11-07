import { Badge, type Tone } from '@/components/ui/Badge'
import type { ApplicationStatus } from '@/types/tracker'
import { STATUS_LABELS } from './transitions'

const TONES: Record<ApplicationStatus, Tone> = {
  saved: 'neutral',
  preparing: 'warning',
  submitted: 'info',
  under_review: 'info',
  approved: 'success',
  disbursed: 'success',
  not_selected: 'danger',
}

export function StatusPill({ status }: { status: ApplicationStatus }) {
  return <Badge tone={TONES[status]}>{STATUS_LABELS[status]}</Badge>
}
