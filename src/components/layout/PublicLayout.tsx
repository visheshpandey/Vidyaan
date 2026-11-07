import { Suspense } from 'react'
import { GraduationCap } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { PreferenceToggles } from './PreferenceToggles'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { useT } from '@/i18n/useT'
import { useProfileStore } from '@/store/profileStore'

export function PublicLayout() {
  const onboarded = useProfileStore((s) => s.onboarded)
  const t = useT()
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="no-print flex h-[72px] items-center justify-between px-4 sm:px-8">
        <Link to={ROUTES.home} className="flex items-center gap-2 font-serif text-2xl text-heading">
          <GraduationCap aria-hidden /> {APP_NAME}
        </Link>
        <div className="flex items-center gap-2">
          <PreferenceToggles />
          <Link to={onboarded ? ROUTES.dashboard : ROUTES.onboarding} className={buttonClass('secondary', 'sm')}>
            {onboarded ? t('landing.open') : t('landing.start')}
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="no-print border-t border-line px-4 py-6 text-center text-xs text-muted sm:px-8">
        {APP_NAME} helps you find and track scholarships. It never submits applications for you. Always confirm
        details on the official site.
      </footer>
    </div>
  )
}
