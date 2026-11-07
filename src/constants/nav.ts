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

export interface NavItem {
  to: string
  label: string
  key: MessageKey
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.dashboard, label: 'Dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
  { to: ROUTES.discover, label: 'Discover', key: 'nav.discover', icon: Search },
  { to: ROUTES.compare, label: 'Compare', key: 'nav.compare', icon: Scale },
  { to: ROUTES.saved, label: 'Saved', key: 'nav.saved', icon: Bookmark },
  { to: ROUTES.applications, label: 'Applications', key: 'nav.applications', icon: ClipboardList },
  { to: ROUTES.documents, label: 'Documents', key: 'nav.documents', icon: FileText },
  { to: ROUTES.deadlines, label: 'Deadlines', key: 'nav.deadlines', icon: CalendarClock },
  { to: ROUTES.profile, label: 'Profile', key: 'nav.profile', icon: UserRound },
]

/** Items shown directly in the mobile bottom bar; the rest live under "More". */
export const BOTTOM_NAV_PRIMARY: string[] = [ROUTES.dashboard, ROUTES.discover, ROUTES.applications]
