import { screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_PROFILE } from '@/data/demo'
import { loadDemoData } from '@/features/demo/demoMode'
import { evaluate } from '@/features/matching/engine'
import Discover from '@/pages/Discover'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { currentUrl, renderApp, resetApp } from './helpers'

const TOTAL = getScholarshipsSync().length

/** The search is debounced by 300ms; allow for a slow machine. */
const SLOW = { timeout: 5000 }

/** Reads the total result count from "Showing A to B of N scholarships" (or "Showing 0 scholarships"). */
function shownCount(): number {
  const text = screen.getByText(/^Showing \d+ (to \d+ of \d+ )?scholarships$/).textContent ?? ''
  const match = /of (\d+) scholarships/.exec(text)
  return match ? Number(match[1]) : 0
}

/** Names of the scholarship cards currently on the page. */
function visibleTitles(): string[] {
  return within(screen.getByRole('region', { name: 'Results' }))
    .getAllByRole('heading')
    .map((h) => h.textContent ?? '')
}

/** Puts text in the search box in one step (typing key by key re-renders every card per letter). */
async function search(user: UserEvent, text: string): Promise<HTMLElement> {
  const box = screen.getByRole('searchbox', { name: /search scholarships/i })
  await user.click(box)
  await user.paste(text)
  return box
}

describe('R1.1 R1.2 R1.3 R1.6 Discover', { timeout: 20_000 }, () => {
  beforeEach(() => {
    resetApp()
    loadDemoData()
  })

  it('lists every scholarship before any filter is applied', () => {
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    expect(shownCount()).toBe(TOTAL)
    expect(screen.getByRole('heading', { level: 1, name: 'Discover' })).toBeInTheDocument()
  })

  it('narrows results as the student types, after the debounce', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    await search(user, 'AICTE')

    await waitFor(() => {
      expect(shownCount()).toBeLessThan(TOTAL)
    }, SLOW)
    expect(shownCount()).toBeGreaterThan(0)
    expect(screen.getAllByText(/AICTE/).length).toBeGreaterThan(0)
  })

  it('keeps the search text in the URL so the page can be shared', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    await search(user, 'merit')

    await waitFor(() => {
      expect(currentUrl()).toContain('q=merit')
    }, SLOW)
  })

  it('restores filters from the URL on first load', () => {
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover?verdict=eligible')

    expect(screen.getByLabelText('Eligibility')).toHaveValue('eligible')
    expect(screen.getByRole('list', { name: 'Active filters' })).toBeInTheDocument()
  })

  it('filters by eligibility result and shows the matching count', async () => {
    const user = userEvent.setup()
    const expected = getScholarshipsSync().filter(
      (s) => evaluate(DEMO_PROFILE, s).verdict === 'not_eligible',
    ).length
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    await user.selectOptions(screen.getByLabelText('Eligibility'), 'not_eligible')

    expect(shownCount()).toBe(expected)
    expect(currentUrl()).toContain('verdict=not_eligible')
  })

  it('shows a helpful empty state for a nonsense search and clears it on request', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')
    const box = await search(user, 'zzzqqqxxx')
    expect(await screen.findByText('No scholarships match', {}, SLOW)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }))

    expect(box).toHaveValue('')
    await waitFor(() => {
      expect(shownCount()).toBe(TOTAL)
    }, SLOW)
    expect(currentUrl()).toBe('/discover')
  })

  it('lets a filter chip be removed', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover?verdict=eligible')

    await user.click(screen.getByRole('button', { name: /Eligible/ }))

    expect(screen.getByLabelText('Eligibility')).toHaveValue('')
    expect(shownCount()).toBe(TOTAL)
  })

  it('pages through results ten at a time', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')
    const firstPage = visibleTitles()
    expect(firstPage).toHaveLength(10)
    expect(
      screen.getByText(`Showing 1 to 10 of ${TOTAL} scholarships`),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(currentUrl()).toContain('page=2')
    expect(screen.getByText(`Showing 11 to 20 of ${TOTAL} scholarships`)).toBeInTheDocument()
    const secondPage = visibleTitles()
    expect(secondPage.some((title) => firstPage.includes(title))).toBe(false)
    expect(screen.getByText(/Page 2 of/)).toHaveAttribute('aria-current', 'page')
  })

  it('opens the page named in the URL and falls back to page 1 for junk', () => {
    const { unmount } = renderApp(
      [{ path: '/discover', element: <Discover /> }],
      '/discover?page=3',
    )
    expect(screen.getByText(/Page 3 of/)).toBeInTheDocument()
    unmount()

    renderApp([{ path: '/discover', element: <Discover /> }], '/discover?page=abc')
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
  })

  it('returns to page 1 when a search changes', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover?page=2')
    expect(screen.getByText(/Page 2 of/)).toBeInTheDocument()

    await search(user, 'Demo')

    await waitFor(() => {
      expect(currentUrl()).toContain('q=Demo')
    }, SLOW)
    expect(currentUrl()).not.toContain('page=')
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
  })

  it('returns to page 1 when a filter changes', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover?page=2')

    await user.selectOptions(screen.getByLabelText('Eligibility'), 'not_eligible')

    expect(currentUrl()).not.toContain('page=')
  })
})
