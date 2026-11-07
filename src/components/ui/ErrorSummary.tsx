import { useEffect, useId, useRef } from 'react'
import clsx from 'clsx'
import { normalizeErrors, type FormErrorItem } from '@/utils/forms'

export interface ErrorSummaryProps {
  title?: string
  errors: FormErrorItem[] | Record<string, string | undefined>
  className?: string
  autoFocus?: boolean
}

/**
 * Accessible Error Summary component.
 * Displays a summary of form validation errors and moves focus to the summary container on submit failure.
 * Clicking any error link moves focus to the invalid field.
 */
export function ErrorSummary({
  title = 'There is a problem',
  errors,
  className,
  autoFocus = true,
}: ErrorSummaryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const items = normalizeErrors(errors)

  useEffect(() => {
    if (autoFocus && items.length > 0) {
      containerRef.current?.focus()
    }
  }, [autoFocus, items.length])

  if (items.length === 0) return null

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={clsx(
        'rounded-control border border-danger/40 bg-danger/10 p-4 text-ink focus:outline-none focus:ring-2 focus:ring-danger',
        className,
      )}
    >
      <h2 id={titleId} className="text-sm font-semibold text-danger">
        {title}
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {items.map((item, index) => (
          <li key={item.fieldId ?? index}>
            {item.fieldId ? (
              <a
                href={`#${item.fieldId}`}
                onClick={(e) => {
                  e.preventDefault()
                  const target = document.getElementById(item.fieldId!)
                  if (target) {
                    target.focus()
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="text-danger underline hover:text-danger/80 focus:outline-none focus:ring-1 focus:ring-danger"
              >
                {item.message}
              </a>
            ) : (
              <span className="text-danger">{item.message}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
