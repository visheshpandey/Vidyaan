import clsx from 'clsx'
import type { ReactNode } from 'react'

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

const TONES: Record<Tone, string> = {
  neutral: 'bg-canvas text-ink border-line',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  info: 'bg-secondary/10 text-secondary border-secondary/30',
  accent: 'bg-accent/30 text-heading border-accent',
}

/** Status pill. Always paired with text or an icon; colour is never the only signal. */
export function Badge({ tone = 'neutral', icon, children }: { tone?: Tone; icon?: ReactNode; children: ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
      )}
    >
      {icon}
      {children}
    </span>
  )
}
