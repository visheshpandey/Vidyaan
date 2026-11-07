import * as Menu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import { Ellipsis } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BOTTOM_NAV_PRIMARY, NAV_ITEMS } from '@/constants/nav'

const ITEM = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium'

export function BottomNav() {
  const navigate = useNavigate()
  const primary = NAV_ITEMS.filter((i) => BOTTOM_NAV_PRIMARY.includes(i.to))
  const more = NAV_ITEMS.filter((i) => !BOTTOM_NAV_PRIMARY.includes(i.to))
  return (
    <nav
      aria-label="Main"
      className="no-print fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {primary.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => clsx(ITEM, isActive ? 'text-primary' : 'text-muted')}>
          <Icon size={20} aria-hidden />
          {label}
        </NavLink>
      ))}
      <Menu.Root>
        <Menu.Trigger className={clsx(ITEM, 'text-muted')}>
          <Ellipsis size={20} aria-hidden />
          More
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Content
            side="top"
            align="end"
            className="z-50 min-w-48 rounded-card border border-line bg-surface p-1 shadow-lg"
          >
            {more.map(({ to, label, icon: Icon }) => (
              <Menu.Item
                key={to}
                onSelect={() => navigate(to)}
                className="flex h-11 cursor-pointer items-center gap-3 rounded-control px-3 text-sm outline-none data-[highlighted]:bg-canvas"
              >
                <Icon size={18} aria-hidden />
                {label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Portal>
      </Menu.Root>
    </nav>
  )
}
