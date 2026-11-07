import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Onboarding from '@/pages/Onboarding'
import { useProfileStore } from '@/store/profileStore'
import { currentUrl, renderApp, resetApp } from './helpers'

const routes = [
  { path: '/onboarding', element: <Onboarding /> },
  { path: '/dashboard', element: <p>Dashboard page</p> },
]

describe('R5.1 Onboarding', () => {
  beforeEach(resetApp)

  it('asks for a name before letting the student continue', async () => {
    const user = userEvent.setup()
    renderApp(routes, '/onboarding')

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Tell us what to call you')
    expect(screen.getByRole('progressbar', { name: /Step 1 of 4/ })).toBeInTheDocument()
  })

  it('saves the profile and opens the dashboard after the last step', async () => {
    const user = userEvent.setup()
    renderApp(routes, '/onboarding')

    await user.type(screen.getByLabelText('Your name'), 'Asha')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('progressbar', { name: /Step 2 of 4: Education/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('progressbar', { name: /Step 4 of 4: Review/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show my matches' }))

    expect(useProfileStore.getState().profile?.name).toBe('Asha')
    expect(useProfileStore.getState().onboarded).toBe(true)
    expect(currentUrl()).toBe('/dashboard')
    expect(screen.getByText('Dashboard page')).toBeInTheDocument()
  })

  it('shows skipped answers as "Not provided" on the review step', async () => {
    const user = userEvent.setup()
    renderApp(routes, '/onboarding')

    await user.type(screen.getByLabelText('Your name'), 'Asha')
    for (let i = 0; i < 3; i += 1) {
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }

    expect(screen.getAllByText('Not provided').length).toBeGreaterThanOrEqual(5)
    expect(screen.getByText('Asha')).toBeInTheDocument()
  })

  it('can go back without losing what was typed', async () => {
    const user = userEvent.setup()
    renderApp(routes, '/onboarding')

    await user.type(screen.getByLabelText('Your name'), 'Asha')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByLabelText('Your name')).toHaveValue('Asha')
  })

  it('rejects an impossible exam percentage', async () => {
    const user = userEvent.setup()
    renderApp(routes, '/onboarding')

    await user.type(screen.getByLabelText('Your name'), 'Asha')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.type(screen.getByLabelText('Last exam percentage'), '150')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('between 0 and 100')
  })
})
