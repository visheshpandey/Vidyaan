import { render, screen, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/Toaster'
import { useCompareStore } from '@/store/compareStore'
import { useDocumentStore } from '@/store/documentStore'
import { useProfileStore } from '@/store/profileStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { LocationProbe } from './LocationProbe'

/** Wipes browser storage and every store so each test starts from a clean slate. */
export function resetApp(): void {
  localStorage.clear()
  useProfileStore.getState().reload()
  useTrackerStore.getState().reload()
  useDocumentStore.getState().reload()
  useSettingsStore.getState().reload()
  useCompareStore.getState().clear()
  useUiStore.setState({ toasts: [] })
  delete document.documentElement.dataset.theme
}

/** A student who has finished onboarding but has no saved data yet. */
export function signIn(name = 'Asha'): void {
  useProfileStore.getState().setProfile({ name, preferences: [] })
}

export interface TestRoute {
  path: string
  element: ReactElement
}

/**
 * Renders real pages inside a memory router, with the toast region and a URL probe alongside.
 * Use `screen.getByTestId('location')` to read the current URL.
 */
export function renderApp(routes: TestRoute[], initialPath: string): RenderResult {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
      <Toaster />
      <LocationProbe />
    </MemoryRouter>,
  )
}

/** Current URL (path plus query) as seen by the router. */
export function currentUrl(): string {
  return screen.getByTestId('location').textContent ?? ''
}
