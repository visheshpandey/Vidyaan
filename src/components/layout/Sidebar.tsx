import clsx from 'clsx'
import { GraduationCap } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { NAV_ITEMS } from '@/constants/nav'
import { ROUTES } from '@/constants/routes'

export function Sidebar() {
  return (
    <aside className="no-print hidden border-r border-line bg-surface lg:block">
      <div className="sticky top-0 flex h-dvh flex-col p-4">
        <Link to={ROUTES.home} className="mb-6 flex items-center gap-2 px-2 py-3 font-serif text-2xl text-primary">
          <GraduationCap aria-hidden /> {APP_NAME}
        </Link>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex h-11 items-center gap-3 rounded-control px-3 text-sm font-medium',
                  isActive ? 'bg-primary text-white' : 'text-ink hover:bg-canvas',
                )
              }
            >
              <Icon size={18} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto px-2 text-xs text-muted">Your data stays in this browser.</p>
      </div>
    </aside>
  )
}
