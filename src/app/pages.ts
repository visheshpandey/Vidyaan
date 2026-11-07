import { lazy } from 'react'

/** Every route page, loaded on demand so the first visit downloads only what it needs. */
export const Landing = lazy(() => import('@/pages/Landing'))
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
