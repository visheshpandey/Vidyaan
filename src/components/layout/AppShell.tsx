import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { useProfileStore } from '@/store/profileStore'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

/** Signed-in layout: sidebar on desktop, header and bottom navigation on mobile. */
export function AppShell() {
  const name = useProfileStore((s) => s.profile?.name)
  return (
    <div className="app-shell min-h-dvh">
      <Sidebar />
      <div className="min-w-0 pb-20 lg:pb-0">
        <header className="no-print flex h-[72px] items-center justify-between border-b border-line bg-surface px-4 sm:px-8">
          <Link to={ROUTES.home} className="flex items-center gap-2 font-serif text-xl text-primary lg:hidden">
            <GraduationCap aria-hidden /> {APP_NAME}
          </Link>
          <p className="hidden text-sm text-muted lg:block">Find your fit. Follow through.</p>
          <Link to={ROUTES.profile} className="flex items-center gap-2 rounded-control px-2 py-1 text-sm font-medium hover:bg-canvas">
            <span aria-hidden className="grid size-8 place-items-center rounded-full bg-primary text-white">
              {(name?.[0] ?? 'S').toUpperCase()}
            </span>
            <span className="hidden sm:inline">{name || 'Your profile'}</span>
          </Link>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-6 outline-none sm:px-8 sm:py-8">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
