export { default as Landing } from '@/pages/Landing'
import { lazy } from 'react'

/** The landing page ships in the first bundle (it is the first thing most people see). Every other page loads on demand. */
export const Onboarding = lazy(() => import('@/pages/Onboarding'))
export const Dashboard = lazy(() => import('@/pages/Dashboard'))
export const Discover = lazy(() => import('@/pages/Discover'))
export const ScholarshipDetail = lazy(() => import('@/pages/ScholarshipDetail'))
export const Compare = lazy(() => import('@/pages/Compare'))
export const Saved = lazy(() => import('@/pages/Saved'))
export const Applications = lazy(() => import('@/pages/Applications'))
export const ApplicationDetail = lazy(() => import('@/pages/ApplicationDetail'))
export const Documents = lazy(() => import('@/pages/Documents'))
export const Deadlines = lazy(() => import('@/pages/Deadlines'))
export const Profile = lazy(() => import('@/pages/Profile'))
export const NotFound = lazy(() => import('@/pages/NotFound'))

/** The signed-in layout (sidebar, header, menus) is only needed after onboarding. */
export const AppShell = lazy(() =>
  import('@/components/layout/AppShell').then((m) => ({ default: m.AppShell })),
)
