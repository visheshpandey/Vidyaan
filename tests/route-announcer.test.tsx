import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { OfflineBanner } from '@/components/layout/OfflineBanner'
import { RouteAnnouncer } from '@/components/layout/RouteAnnouncer'
import { pageNameForPath } from '@/utils/pageNames'

function Harness({ start = '/' }: { start?: string }) {
  return (
    <MemoryRouter initialEntries={[start]}>
      <RouteAnnouncer />
      <nav>
        <Link to="/discover">Go to discover</Link>
        <Link to="/scholarship/abc">Go to scholarship</Link>
      </nav>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="*" element={<p>content</p>} />
        </Routes>
      </main>
    </MemoryRouter>
  )
}

describe('pageNameForPath', () => {
  it('names known, dynamic and unknown routes', () => {
    expect(pageNameForPath('/')).toBe('Home')
    expect(pageNameForPath('/discover')).toBe('Discover')
    expect(pageNameForPath('/onboarding')).toBe('Get started')
    expect(pageNameForPath('/scholarship/aicte-pragati')).toBe('Scholarship details')
    expect(pageNameForPath('/applications/app-1')).toBe('Application details')
    expect(pageNameForPath('/nope')).toBe('Page not found')
  })
})

describe('RouteAnnouncer', () => {
  it('sets the title on first load without stealing focus or announcing', () => {
    render(<Harness />)
    expect(document.title).toBe('Home | GRANTLY')
    expect(document.activeElement).toBe(document.body)
    expect(screen.getByTestId('route-announcer')).toBeEmptyDOMElement()
  })

  it('updates the title, moves focus to main and announces after navigation', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('link', { name: 'Go to discover' }))
    expect(document.title).toBe('Discover | GRANTLY')
    expect(document.activeElement).toBe(document.getElementById('main'))
    expect(screen.getByTestId('route-announcer')).toHaveTextContent('Navigated to Discover')
  })

  it('has a polite live region', () => {
    render(<Harness />)
    expect(screen.getByTestId('route-announcer')).toHaveAttribute('aria-live', 'polite')
  })
})

describe('OfflineBanner', () => {
  it('is hidden online and visible when the browser goes offline', () => {
    render(<OfflineBanner />)
    expect(screen.queryByRole('status')).toBeNull()
    act(() => {
      Object.defineProperty(navigator, 'onLine', { configurable: true, value: false })
      window.dispatchEvent(new Event('offline'))
    })
    expect(screen.getByRole('status')).toHaveTextContent(/you are offline/i)
    act(() => {
      Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })
      window.dispatchEvent(new Event('online'))
    })
    expect(screen.queryByRole('status')).toBeNull()
  })
})
