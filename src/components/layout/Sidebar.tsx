import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, type NavGroup } from '@/constants/nav'
import type { MessageKey } from '@/i18n/dictionary'
import { useT } from '@/i18n/useT'
import { Logo } from './Logo'

const GROUPS: Array<{ id: NavGroup; heading?: MessageKey }> = [
  { id: 'main' },
  { id: 'activity', heading: 'nav.group.activity' },
  { id: 'account', heading: 'nav.group.account' },
]

/** Dark green sidebar (desktop only). Items are grouped like the design reference. */
export function Sidebar() {
  const t = useT()
  return (
    <aside className="no-print hidden bg-sidebar text-white lg:block">
      <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto p-4">
        <Logo onDark className="mb-6 px-2 py-3" />
        <nav aria-label="Main" className="flex flex-col gap-5">
          {GROUPS.map(({ id, heading }) => (
            <div key={id}>
              {heading && <p className="mb-1 px-3 text-sm text-white/70">{t(heading)}</p>}
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.filter((i) => i.group === id).map(({ to, key, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        clsx(
                          'flex h-11 items-center gap-3 rounded-control px-3 text-sm font-medium',
                          isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10',
                        )
                      }
                    >
                      <Icon size={18} aria-hidden />
                      {t(key)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="mt-auto px-3 pt-6 text-xs text-white/70">Your data stays in this browser.</p>
      </div>
    </aside>
  )
}
