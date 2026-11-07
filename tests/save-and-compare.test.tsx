import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Compare from '@/pages/Compare'
import Discover from '@/pages/Discover'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { MAX_COMPARE, useCompareStore } from '@/store/compareStore'
import { useTrackerStore } from '@/store/trackerStore'
import { renderApp, resetApp, signIn } from './helpers'

const [first, second, third, fourth] = getScholarshipsSync()

describe('Saving scholarships', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('toggles the save button, announces it and persists the choice', async () => {
    const user = userEvent.setup()
    if (!first) throw new Error('bundled data is empty')
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    const save = screen.getByRole('button', { name: `Save ${first.title}` })
    expect(save).toHaveAttribute('aria-pressed', 'false')

    await user.click(save)

    const unsave = screen.getByRole('button', { name: `Unsave ${first.title}` })
    expect(unsave).toHaveAttribute('aria-pressed', 'true')
    expect(await screen.findByText('Saved to your list')).toBeInTheDocument()
    expect(useTrackerStore.getState().saved).toEqual([first.id])
    expect(JSON.parse(localStorage.getItem('vidyaan:v1:saved') ?? '[]')).toEqual([first.id])

    await user.click(unsave)

    expect(await screen.findByText('Removed from saved')).toBeInTheDocument()
    expect(useTrackerStore.getState().saved).toEqual([])
  })
})

describe('Comparing scholarships', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('refuses a fourth scholarship with a clear message', async () => {
    const user = userEvent.setup()
    if (!first || !second || !third || !fourth) throw new Error('bundled data is too small')
    renderApp([{ path: '/discover', element: <Discover /> }], '/discover')

    for (const s of [first, second, third]) {
      await user.click(screen.getByRole('checkbox', { name: `Compare ${s.title}` }))
    }
    await user.click(screen.getByRole('checkbox', { name: `Compare ${fourth.title}` }))

    expect(
      await screen.findByText(`You can compare up to ${MAX_COMPARE} scholarships`),
    ).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: `Compare ${fourth.title}` })).not.toBeChecked()
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
