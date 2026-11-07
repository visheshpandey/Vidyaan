import clsx from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx('animate-pulse rounded-control bg-line', className)} />
}

/** Route-level loading fallback. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading…" className="space-y-4 p-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
