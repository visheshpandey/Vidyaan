import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useProfileStore } from '@/store/profileStore'

/** App pages need a profile for matching; send new visitors through onboarding first. */
export function RequireOnboarding({ children }: { children: ReactNode }) {
  const onboarded = useProfileStore((s) => s.onboarded)
  return onboarded ? children : <Navigate to={ROUTES.onboarding} replace />
}
