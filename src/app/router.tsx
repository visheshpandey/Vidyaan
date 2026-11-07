/* oxlint-disable react/only-export-components -- route table, not a component module */
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ROUTES } from '@/constants/routes'
import { RequireOnboarding } from './RequireOnboarding'

const Landing = lazy(() => import('@/pages/Landing'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Discover = lazy(() => import('@/pages/Discover'))
const ScholarshipDetail = lazy(() => import('@/pages/ScholarshipDetail'))
const Compare = lazy(() => import('@/pages/Compare'))
const Saved = lazy(() => import('@/pages/Saved'))
const Applications = lazy(() => import('@/pages/Applications'))
const ApplicationDetail = lazy(() => import('@/pages/ApplicationDetail'))
const Documents = lazy(() => import('@/pages/Documents'))
const Deadlines = lazy(() => import('@/pages/Deadlines'))
const Profile = lazy(() => import('@/pages/Profile'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.home, element: <Landing /> },
      { path: ROUTES.onboarding, element: <Onboarding /> },
    ],
  },
  {
    element: (
      <RequireOnboarding>
        <AppShell />
      </RequireOnboarding>
    ),
    children: [
      { path: ROUTES.dashboard, element: <Dashboard /> },
      { path: ROUTES.discover, element: <Discover /> },
      { path: '/scholarship/:id', element: <ScholarshipDetail /> },
      { path: ROUTES.compare, element: <Compare /> },
      { path: ROUTES.saved, element: <Saved /> },
      { path: ROUTES.applications, element: <Applications /> },
      { path: '/applications/:id', element: <ApplicationDetail /> },
      { path: ROUTES.documents, element: <Documents /> },
      { path: ROUTES.deadlines, element: <Deadlines /> },
      { path: ROUTES.profile, element: <Profile /> },
    ],
  },
  { path: '/home', element: <Navigate to={ROUTES.home} replace /> },
  { path: '*', element: <NotFound /> },
])
