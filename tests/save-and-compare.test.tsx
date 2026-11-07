import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Compare from '@/pages/Compare'
import Discover from '@/pages/Discover'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { MAX_COMPARE, useCompareStore } from '@/store/compareStore'
import { useTrackerStore } from '@/store/trackerStore'
import { renderApp, resetApp, signIn } from './helpers'

const [first, second] =getScholarshipsSync()

describe('R3.2 Saving scholarships', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('toggles the save button, announces it and persists the choice', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    // Only the first page of results is rendered, so pick whichever card is on top.
    const save = screen.getAllByRole('button', { name: /^Save / })[0]
    if (!save) throw new Error('no save button on the page')
    expect(save).toHaveAttribute('aria-pressed', 'false')
    const title = (save.getAttribute('aria-label') ?? '').replace(/^Save /, '')
    const target = getScholarshipsSync().find((s) => s.title === title)
    if (!target) throw new Error('unknown scholarship on the page')

    await user.click(save)

    const unsave = screen.getByRole('button', { name: `Unsave ${target.title}` })
    expect(unsave).toHaveAttribute('aria-pressed', 'true')
    expect(await screen.findByText('Saved to your list')).toBeInTheDocument()
    expect(useTrackerStore.getState().saved).toEqual([target.id])
    expect(JSON.parse(localStorage.getItem('grantly:v1:saved') ?? '[]')).toEqual([target.id])

    await user.click(unsave)

    expect(await screen.findByText('Removed from saved')).toBeInTheDocument()
    expect(useTrackerStore.getState().saved).toEqual([])
  })
})

describe('R1.5 Comparing scholarships', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('refuses a fourth scholarship with a clear message', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    // Only the first page of results is rendered, so compare the top four cards.
    const boxes = screen.getAllByRole('checkbox', { name: /^Compare / })
    const [a, b, c, d] = boxes
    if (!a || !b || !c || !d) throw new Error('fewer than four cards on the page')
    for (const box of [a, b, c]) await user.click(box)
    await user.click(d)

    expect(
      await screen.findByText(`You can compare up to ${MAX_COMPARE} scholarships`),
    ).toBeInTheDocument()
    expect(d).not.toBeChecked()
    expect(useCompareStore.getState().ids).toHaveLength(MAX_COMPARE)
  })

  it('shows the picked scholarships side by side and lets one be removed', async () => {
    const user = userEvent.setup()
    if (!first || !second) throw new Error('bundled data is too small')
    useCompareStore.getState().toggle(first.id)
    useCompareStore.getState().toggle(second.id)
    renderApp([{ path: '/compare', element: <Compare /> }], '/compare')

    expect(screen.getByRole('table', { name: 'Scholarship comparison' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: first.title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: second.title })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: `Remove ${first.title} from comparison` }))

    expect(screen.queryByRole('link', { name: first.title })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: second.title })).toBeInTheDocument()
  })

  it('explains what to do when nothing is selected', () => {
    renderApp([{ path: '/compare', element: <Compare /> }], '/compare')

    expect(screen.getByText('Nothing to compare yet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Choose scholarships' })).toBeInTheDocument()
  })
})
