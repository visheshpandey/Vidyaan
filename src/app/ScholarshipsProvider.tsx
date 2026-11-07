import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getScholarshipsSync, refreshScholarships } from '@/services/scholarshipService'
import type { Scholarship } from '@/types/scholarship'
import {
  ScholarshipsContext,
  type ScholarshipsState,
  type ScholarshipsStatus,
} from './scholarshipsContext'

/**
 * Loads scholarships with stale-while-revalidate: the first render uses the bundled data so nothing
 * waits on the network, then the latest list is fetched through the API layer. If that fails the bundled
 * data stays on screen and `status` becomes `offline`. Never throws.
 */
export function ScholarshipsProvider({ children }: { children: ReactNode }) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(getScholarshipsSync)
  const [status, setStatus] = useState<ScholarshipsStatus>('refreshing')
  /** Bumped by `reload`; any value above 0 means "ask the server again, ignoring the cache". */
  const [reloads, setReloads] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    refreshScholarships({ signal: controller.signal, force: reloads > 0 })
      .then((result) => {
        if (controller.signal.aborted) return
        setScholarships(result.scholarships)
        setStatus(result.source === 'network' ? 'ready' : 'offline')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('offline')
      })
    return () => controller.abort()
  }, [reloads])

  const reload = useCallback(() => {
    setStatus('refreshing')
    setReloads((n) => n + 1)
  }, [])

  const value = useMemo<ScholarshipsState>(
    () => ({ scholarships, status, reload }),
    [scholarships, status, reload],
  )

  return <ScholarshipsContext.Provider value={value}>{children}</ScholarshipsContext.Provider>
}
