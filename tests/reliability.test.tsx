import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { createMemoryRouter, MemoryRouter, Route, Routes, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { ThemeSync } from '@/app/ThemeSync'
import { RouteError } from '@/app/RouteError'
import { AppShell } from '@/components/layout/AppShell'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { loadDemoData } from '@/features/demo/demoMode'
import Dashboard from '@/pages/Dashboard'
import { useProfileStore } from '@/store/profileStore'
import { useTrackerStore } from '@/store/trackerStore'
import { resetApp } from './helpers'

function Bomb(): ReactNode {
  throw new Error('boom')
}

function silenceConsoleError() {
  return vi.spyOn(console, 'error').mockImplementation(() => {})
}

describe('R6.3 Error handling', () => {
  beforeEach(resetApp)
  afterEach(() => vi.restoreAllMocks())

  it('shows a calm recovery screen when a component crashes', () => {
    silenceConsoleError()
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    expect(screen.getByText(/saved data is safe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('renders its children when nothing goes wrong', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('All good')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the route error page, with a way home, when a route throws', () => {
    silenceConsoleError()
    const router = createMemoryRouter(
      [{ path: '/', element: <Bomb />, errorElement: <RouteError /> }],
      { initialEntries: ['/'] },
    )
    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/')
  })

  it('shows a "page not found" message, without a reload button, for an unknown URL', () => {
    silenceConsoleError()
    const router = createMemoryRouter(
      [{ errorElement: <RouteError />, children: [{ path: '/', element: <p>Home</p> }] }],
      { initialEntries: ['/does-not-exist'] },
    )
    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument()
  })
})

describe('R6.3 Corrupt saved data', () => {
  beforeEach(resetApp)

  it('still renders the dashboard when every stored value is broken', () => {
    localStorage.setItem(STORAGE_KEYS.profile, '{bad json')
    localStorage.setItem(STORAGE_KEYS.applications, '[{"nonsense":true}]')
    localStorage.setItem(STORAGE_KEYS.saved, '"not an array"')
    localStorage.setItem(STORAGE_KEYS.documents, 'null')
    localStorage.setItem(STORAGE_KEYS.settings, '12345')
    localStorage.setItem(STORAGE_KEYS.onboarded, 'true')
    useProfileStore.getState().reload()
    useTrackerStore.getState().reload()

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /^Good (morning|afternoon|evening)!/,
    )
    expect(useProfileStore.getState().profile).toBeNull()
    expect(useTrackerStore.getState().applications).toEqual([])
    expect(screen.getByText('Profile complete')).toBeInTheDocument()
  })
})

describe('R5.5 Language', () => {
  beforeEach(() => {
    resetApp()
    loadDemoData()
  })

  it('switches navigation labels to Hindi and remembers the choice', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ThemeSync />
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<p>content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getAllByRole('link', { name: 'Discover' }).length).toBeGreaterThan(0)
    expect(document.documentElement.lang).toBe('en')

    await user.selectOptions(screen.getByLabelText('Language'), 'hi')

    expect(screen.getAllByRole('link', { name: 'खोजें' }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: 'Discover' })).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) ?? '{}')).toMatchObject({
      language: 'hi',
    })
    expect(document.documentElement.lang).toBe('hi')
  })
})
