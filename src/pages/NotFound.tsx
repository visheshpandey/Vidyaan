import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { EmptyState } from '@/components/ui/EmptyState'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        action={
          <Link to={ROUTES.home} className={buttonClass()}>
            Back to home
          </Link>
        }
      >
        That page does not exist or has moved.
      </EmptyState>
    </div>
  )
}
