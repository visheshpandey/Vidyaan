import { Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ROUTES } from '@/constants/routes'
import {
  AppShell,
  ApplicationDetail,
  Applications,
  Compare,
  Dashboard,
  Deadlines,
  Discover,
  Documents,
  Landing,
  NotFound,
  Onboarding,
  Profile,
  Saved,
  ScholarshipDetail,
} from './pages'
import { RequireOnboarding } from './RequireOnboarding'
import { RouteError } from './RouteError'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteError />,
    children: [
      { path: ROUTES.home, element: <Landing /> },
      { path: ROUTES.onboarding, element: <Onboarding /> },
    ],
  },
  {
    element: (
      <RequireOnboarding>
        <Suspense fallback={<PageSkeleton />}>
          <AppShell />
        </Suspense>
      </RequireOnboarding>
    ),
    errorElement: <RouteError />,
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
  { path: '/home', element: <Navigate to={ROUTES.home} replace />, errorElement: <RouteError /> },
  { path: '*', element: <NotFound />, errorElement: <RouteError /> },
])
