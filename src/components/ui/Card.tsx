import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-card border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(24,59,50,0.05)]',
        className,
      )}
      {...rest}
    />
  )
}
