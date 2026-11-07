import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { ROUTES } from '@/constants/routes'

/**
 * Shown when a route fails to load or render (including lazy chunk failures and 404 responses).
 * Calm wording: the student's saved data is stored locally and is not affected.
 */
export function RouteError() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <div role="alert" className="mx-auto max-w-md p-10 text-center">
      <h1 className="font-serif text-2xl text-heading">
        {notFound ? 'Page not found' : 'Something went wrong'}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {notFound
          ? 'That page does not exist or has moved.'
          : 'Your saved data is safe. Reload the page, or go back to the home page.'}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        {!notFound && (
          <button type="button" className={buttonClass()} onClick={() => window.location.reload()}>
            Reload
          </button>
        )}
        <Link to={ROUTES.home} className={buttonClass('secondary')}>
          Go home
        </Link>
      </div>
    </div>
  )
}
