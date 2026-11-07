import { RouterProvider } from 'react-router-dom'
import { SkipLink } from '@/components/layout/SkipLink'
import { Toaster } from '@/components/ui/Toaster'
import { ThemeSync } from './app/ThemeSync'
import { ErrorBoundary } from './app/ErrorBoundary'
import { router } from './app/router'

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeSync />
      <SkipLink />
      <RouterProvider router={router} />
      <Toaster />
    </ErrorBoundary>
  )
}
