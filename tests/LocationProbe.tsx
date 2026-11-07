import { useLocation } from 'react-router-dom'

/** Test-only: exposes the current URL so tests can assert on navigation and query strings. */
export function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname + location.search}</output>
}
