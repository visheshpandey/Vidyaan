import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { pageNameForPath } from '@/utils/pageNames'

/**
 * Makes client-side navigation accessible. After each route change it:
 *  1. sets the document title (so the tab, history and screen readers name the page),
 *  2. moves keyboard focus to the main content (not on the very first load), and
 *  3. announces "Navigated to <page>" in a visually hidden polite live region.
 * Navigation to an in-page anchor (a URL hash) keeps the browser's own focus behaviour.
 */
export function RouteAnnouncer() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const name = pageNameForPath(pathname)
    document.title = `${name} | ${APP_NAME}`
    if (first.current) {
      first.current = false
      return
    }
    setMessage(`Navigated to ${name}`)
    if (!hash) document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="route-announcer">
      {message}
    </div>
  )
}
