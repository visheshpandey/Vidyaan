import { Suspense, useState, type FormEvent } from 'react'
import { Bell, Search } from 'lucide-react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { ROUTES } from '@/constants/routes'
import { useReminders } from '@/hooks/useReminders'
import { useT } from '@/i18n/useT'
import { useProfileStore } from '@/store/profileStore'
import { BottomNav } from './BottomNav'
import { Logo } from './Logo'
import { PreferenceToggles } from './PreferenceToggles'
import { Sidebar } from './Sidebar'

/** Signed-in layout: sidebar on desktop, header with search and bottom navigation on mobile. */
export function AppShell() {
  const name = useProfileStore((s) => s.profile?.name)
  const t = useT()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  useReminders()

  const search = (e: FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    void navigate(query ? `${ROUTES.discover}?q=${encodeURIComponent(query)}` : ROUTES.discover)
  }

  return (
    <div className="app-shell min-h-dvh">
      <Sidebar />
      <div className="min-w-0 pb-20 lg:pb-0">
        <header className="no-print flex h-[72px] items-center gap-3 border-b border-line bg-surface px-4 sm:px-8">
          <Logo className="lg:hidden" />
          <form
            role="search"
            onSubmit={search}
            className="relative hidden max-w-xl flex-1 sm:block"
          >
            <label htmlFor="global-search" className="sr-only">
              {t('nav.search')}
            </label>
            <Search
              size={16}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="global-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('nav.search')}
              autoComplete="off"
              spellCheck={false}
              className="h-11 w-full rounded-full border border-line bg-canvas pl-9 pr-4 text-sm text-ink placeholder:text-muted"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <PreferenceToggles />
            <Link
              to={ROUTES.deadlines}
              aria-label={t('nav.notifications')}
              className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink hover:bg-canvas"
            >
              <Bell size={18} aria-hidden />
            </Link>
            <Link
              to={ROUTES.profile}
              aria-label={name || 'Your profile'}
              className="grid size-10 place-items-center rounded-full bg-primary text-sm font-medium text-white"
            >
              {(name?.[0] ?? 'S').toUpperCase()}
            </Link>
          </div>
        </header>
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto max-w-6xl px-4 py-6 outline-none sm:px-8 sm:py-8"
        >
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
