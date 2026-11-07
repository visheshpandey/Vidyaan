import clsx from 'clsx'

/** Placeholder block shown while content loads, to avoid layout shift. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx('animate-pulse rounded-control bg-line', className)} />
}

/**
 * Route-level loading fallback. It reserves roughly a screen of height so the footer and sidebar
 * do not jump when the lazy page replaces it (keeps Cumulative Layout Shift low).
 */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading…" className="min-h-[70vh] space-y-4 p-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
