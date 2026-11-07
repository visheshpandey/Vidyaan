import { screen, waitFor } from '@testing-library/react'
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

/** Reads N from the "Showing N of M scholarships" status line. */
function shownCount(): number {
  const text = screen.getByText(/Showing \d+ of \d+ scholarships/).textContent ?? ''
  const match = /Showing (\d+) of/.exec(text)
  return Number(match?.[1])
}

/** Puts text in the search box in one step (typing key by key re-renders every card per letter). */
async function search(user: UserEvent, text: string): Promise<HTMLElement> {
  const box = screen.getByRole('searchbox', { name: /search scholarships/i })
  await user.click(box)
  await user.paste(text)
  return box
}

describe('Discover', { timeout: 20_000 }, () => {
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
})
