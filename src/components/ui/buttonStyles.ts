import clsx from 'clsx'

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type Size = 'sm' | 'md'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-secondary',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  ghost: 'text-primary hover:bg-primary/10',
  danger: 'bg-danger text-white hover:opacity-90',
}
const SIZES: Record<Size, string> = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-4 text-sm' }

/** Class string so links (router `Link`) can look like buttons. */
export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    extra,
  )
}

