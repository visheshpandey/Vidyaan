import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeSync } from '@/app/ThemeSync'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { loadDemoData } from '@/features/demo/demoMode'
import Profile from '@/pages/Profile'
import { useProfileStore } from '@/store/profileStore'
import { useTrackerStore } from '@/store/trackerStore'
import { currentUrl, renderApp, resetApp } from './helpers'

function renderProfile() {
  return renderApp(
    [
      {
        path: '/profile',
        element: (
          <>
            <ThemeSync />
            <Profile />
          </>
        ),
      },
      { path: '/', element: <p>Home page</p> },
    ],
    '/profile',
  )
}

describe('R4.7 R5.5 Profile', () => {
  beforeEach(() => {
    resetApp()
    loadDemoData()
  })

  afterEach(() => {
    delete document.documentElement.dataset.theme
  })

  it('applies edits to the profile immediately', async () => {
    const user = userEvent.setup()
    renderProfile()

    await user.selectOptions(screen.getByLabelText('State'), 'Kerala')

    expect(useProfileStore.getState().profile?.state).toBe('Kerala')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) ?? '{}')).toMatchObject({
      state: 'Kerala',
    })
  })

  it('switches to dark mode and remembers the choice', async () => {
    const user = userEvent.setup()
    renderProfile()
    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(screen.getByLabelText('Dark mode'))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) ?? '{}')).toMatchObject({
      theme: 'dark',
    })
  })

  it('asks before replacing data with the demo persona', async () => {
    const user = userEvent.setup()
    useProfileStore.getState().updateProfile({ name: 'Someone else' })
    renderProfile()

    await user.click(screen.getByRole('button', { name: 'Load demo data' }))
    const dialog = screen.getByRole('dialog')
    expect(useProfileStore.getState().profile?.name).toBe('Someone else')

    await user.click(within(dialog).getByRole('button', { name: 'Load demo' }))

    expect(useProfileStore.getState().profile?.name).toBe('Priya')
  })

  it('does not clear anything until the student confirms', async () => {
    const user = userEvent.setup()
    renderProfile()

    await user.click(screen.getByRole('button', { name: 'Clear all my data' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Clear all your data?')).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEYS.profile)).not.toBeNull()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    expect(localStorage.getItem(STORAGE_KEYS.profile)).not.toBeNull()
    expect(useTrackerStore.getState().applications.length).toBeGreaterThan(0)
  })

  it('empties storage and returns home after the student confirms', async () => {
    const user = userEvent.setup()
    renderProfile()

    await user.click(screen.getByRole('button', { name: 'Clear all my data' }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Clear everything' }),
    )

    for (const key of Object.values(STORAGE_KEYS)) {
      expect(localStorage.getItem(key)).toBeNull()
    }
    expect(useProfileStore.getState().profile).toBeNull()
    expect(useTrackerStore.getState().applications).toEqual([])
    expect(currentUrl()).toBe('/')
  })
})
