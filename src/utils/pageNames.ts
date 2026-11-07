import { NAV_ITEMS } from '@/constants/nav'
import { ROUTES } from '@/constants/routes'

/**
 * Human name of the page for a URL path, used for the browser tab title and the screen-reader
 * announcement. Nav labels are reused so the names always match the menu.
 */
export function pageNameForPath(pathname: string): string {
  if (pathname === ROUTES.home) return 'Home'
  if (pathname === ROUTES.welcome) return 'Welcome'
  if (pathname === ROUTES.onboarding) return 'Get started'
  if (pathname.startsWith('/scholarship/')) return 'Scholarship details'
  if (pathname.startsWith('/applications/')) return 'Application details'
  const nav = NAV_ITEMS.find((item) => item.to === pathname)
  return nav?.label ?? 'Page not found'
}
