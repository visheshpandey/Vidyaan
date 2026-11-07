import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useScholarships } from '@/hooks/useScholarships'

/** How long a refresh may take before we mention it. Quick refreshes stay invisible. */
const SHOW_REFRESHING_AFTER_MS = 800

/**
 * A small polite status line about scholarship data: "Updating scholarships…" if loading takes a while,
 * and a retry button when the app is showing saved data because the server could not be reached.
 * Renders an empty live region when everything is fine so screen readers still hear changes.
 */
export function DataStatus() {
  const { status, reload } = useScholarships()
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (status !== 'refreshing') return
    const timer = setTimeout(() => setSlow(true), SHOW_REFRESHING_AFTER_MS)
    return () => {
      clearTimeout(timer)
      setSlow(false)
    }
  }, [status])

  return (
    <div role="status" aria-live="polite" className="min-h-0 text-sm text-muted">
      {status === 'refreshing' && slow && <p>Updating scholarships…</p>}
      {status === 'offline' && (
        <p className="flex flex-wrap items-center gap-2">
          <span>You are offline. Showing saved scholarships.</span>
          <Button variant="ghost" size="sm" onClick={reload}>
            Try again
          </Button>
        </p>
      )}
    </div>
  )
}
