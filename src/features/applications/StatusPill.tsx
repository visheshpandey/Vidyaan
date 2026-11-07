import { Badge, type Tone } from '@/components/ui/Badge'
import { useT } from '@/i18n/useT'
import type { ApplicationStatus } from '@/types/tracker'

const TONES: Record<ApplicationStatus, Tone> = {
  saved: 'neutral',
  preparing: 'warning',
  submitted: 'info',
  under_review: 'info',
  approved: 'success',
  disbursed: 'success',
  not_selected: 'danger',
}

/** Application status shown with an icon and text, never colour alone. */
export function StatusPill({ status }: { status: ApplicationStatus }) {
  const t = useT()
  return <Badge tone={TONES[status]}>{t(`status.${status}`)}</Badge>
}
