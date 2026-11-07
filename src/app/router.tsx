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
  Help,
  Documents,
  Landing,
  NotFound,
  Onboarding,
  Profile,
  Saved,
  ScholarshipDetail,
} from './pages'
import { RouteError } from './RouteError'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteError />,
    children: [
      { path: ROUTES.welcome, element: <Landing /> },
      { path: ROUTES.onboarding, element: <Onboarding /> },
    ],
  },
  {
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AppShell />
      </Suspense>
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
      { path: ROUTES.help, element: <Help /> },
    ],
  },
  // The site opens straight to the scholarship list. The landing page lives at /welcome.
  {
    path: ROUTES.home,
    element: <Navigate to={ROUTES.discover} replace />,
    errorElement: <RouteError />,
  },
  {
    path: '/home',
    element: <Navigate to={ROUTES.discover} replace />,
    errorElement: <RouteError />,
  },
  { path: '*', element: <NotFound />, errorElement: <RouteError /> },
])
