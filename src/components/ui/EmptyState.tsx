import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { EmptyIllustration } from './HeroIllustration'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, children, action }: EmptyStateProps) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center">
      <EmptyIllustration className="mx-auto mb-2 h-auto w-40 max-w-full" />
      <Icon className="mx-auto mb-2 text-muted" size={24} aria-hidden />
      <h2 className="font-serif text-xl text-heading">{title}</h2>
      {children && <p className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
