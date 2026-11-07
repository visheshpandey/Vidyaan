import { Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

/** Leaf mark plus serif wordmark. `onDark` switches to light text for the green sidebar. */
export function Logo({ onDark = false, className = '' }: { onDark?: boolean; className?: string }) {
  return (
    <Link
      to={ROUTES.home}
      className={`flex items-center gap-2 font-serif text-2xl ${onDark ? 'text-white' : 'text-heading'} ${className}`}
    >
      <Sprout
        aria-hidden
        className={onDark ? 'text-accent' : 'text-secondary'}
        size={26}
        strokeWidth={2}
      />
      <span translate="no">{APP_NAME}</span>
    </Link>
  )
}
