import {
  Bookmark,
  CalendarClock,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Search,
  Scale,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import type { MessageKey } from '@/i18n/dictionary'
import { ROUTES } from './routes'

export type NavGroup = 'main' | 'activity' | 'account'

export interface NavItem {
  to: string
  group: NavGroup
  label: string
  key: MessageKey
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: ROUTES.dashboard,
    group: 'main',
    label: 'Dashboard',
    key: 'nav.dashboard',
    icon: LayoutDashboard,
  },
  { to: ROUTES.discover, group: 'main', label: 'Discover', key: 'nav.discover', icon: Search },
  { to: ROUTES.compare, group: 'main', label: 'Compare', key: 'nav.compare', icon: Scale },
  { to: ROUTES.saved, group: 'activity', label: 'Saved', key: 'nav.saved', icon: Bookmark },
  {
    to: ROUTES.applications,
    group: 'activity',
    label: 'Applications',
    key: 'nav.applications',
    icon: ClipboardList,
  },
  {
    to: ROUTES.documents,
    group: 'activity',
    label: 'Documents',
    key: 'nav.documents',
    icon: FileText,
  },
  {
    to: ROUTES.deadlines,
    group: 'activity',
    label: 'Deadlines',
    key: 'nav.deadlines',
    icon: CalendarClock,
  },
  { to: ROUTES.profile, group: 'account', label: 'Profile', key: 'nav.profile', icon: UserRound },
]

/** Items shown directly in the mobile bottom bar; the rest live under "More". */
export const BOTTOM_NAV_PRIMARY: string[] = [ROUTES.dashboard, ROUTES.discover, ROUTES.applications]
