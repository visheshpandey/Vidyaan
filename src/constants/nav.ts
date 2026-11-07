import {
  Bookmark,
  CalendarClock,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Search,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from './routes'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.discover, label: 'Discover', icon: Search },
  { to: ROUTES.saved, label: 'Saved', icon: Bookmark },
  { to: ROUTES.applications, label: 'Applications', icon: ClipboardList },
  { to: ROUTES.documents, label: 'Documents', icon: FileText },
  { to: ROUTES.deadlines, label: 'Deadlines', icon: CalendarClock },
  { to: ROUTES.profile, label: 'Profile', icon: UserRound },
]

/** Items shown directly in the mobile bottom bar; the rest live under "More". */
export const BOTTOM_NAV_PRIMARY: string[] = [ROUTES.dashboard, ROUTES.discover, ROUTES.applications]
