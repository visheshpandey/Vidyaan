import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Documents from '@/pages/Documents'
import Onboarding from '@/pages/Onboarding'
import Profile from '@/pages/Profile'
import { ErrorSummary } from '@/components/ui/ErrorSummary'
import { renderApp, resetApp, signIn } from './helpers'

describe('R5.1 R5.2 ErrorSummary component', () => {
  it('renders nothing when there are no errors', () => {
    renderApp([{ path: '/', element: <ErrorSummary errors={{}} /> }], '/')
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument()
  })

  it('moves focus to the container and focuses the target field on click', async () => {
    const user = userEvent.setup()
    renderApp(
      [
        {
          path: '/',
          element: (
            <div>
              <ErrorSummary errors={{ 'test-input': 'Test error message' }} />
              <input id="test-input" aria-label="Test input" />
            </div>
          ),
        },
      ],
      '/',
    )

    const summaryHeading = screen.getByText('There is a problem')
    const summaryContainer = summaryHeading.closest('[tabindex="-1"]')
    expect(summaryContainer).toHaveFocus()

    const link = screen.getByRole('link', { name: 'Test error message' })
    await user.click(link)

    expect(screen.getByLabelText('Test input')).toHaveFocus()
  })
})

describe('R5.1 Onboarding form validation', () => {
  beforeEach(resetApp)

  it('shows error summary and inline error, taking focus on submit failure', async () => {
    const user = userEvent.setup()
    renderApp(
      [
        { path: '/onboarding', element: <Onboarding /> },
        { path: '/dashboard', element: <p>Dashboard</p> },
      ],
      '/onboarding',
    )

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    const summaryHeading = screen.getByText('There is a problem')
    const summaryContainer = summaryHeading.closest('[tabindex="-1"]')
    expect(summaryContainer).toHaveFocus()

    const link = within(summaryContainer as HTMLElement).getByRole('link', {
      name: 'Tell us what to call you',
    })
    expect(link).toBeInTheDocument()

    await user.click(link)
    expect(screen.getByLabelText('Your name')).toHaveFocus()
  })
})

describe('R4.1 R5.2 Documents form validation', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('shows error summary and inline error when duplicate document is submitted', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/documents', element: <Documents /> }], '/documents')

    await user.type(screen.getByLabelText('New document name'), 'Aadhaar')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    await user.type(screen.getByLabelText('New document name'), 'aadhaar')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    const summaryHeading = screen.getByText('There is a problem')
    const summaryContainer = summaryHeading.closest('[tabindex="-1"]')
    expect(summaryContainer).toHaveFocus()

    expect(
      within(summaryContainer as HTMLElement).getByText('This document is already in your list'),
    ).toBeInTheDocument()
    expect(screen.getAllByText('This document is already in your list')).toHaveLength(2)
  })
})

describe('R4.7 R5.2 Profile form validation', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('shows error summary and moves focus when saving invalid data', async () => {
    const user = userEvent.setup()
    renderApp([{ path: '/profile', element: <Profile /> }], '/profile')

    const percentInput = screen.getAllByLabelText('Last exam percentage')[0]!
    await user.clear(percentInput)
    await user.type(percentInput, '150')

    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    const summaryHeading = screen.getByText('There is a problem')
    const summaryContainer = summaryHeading.closest('[tabindex="-1"]')
    expect(summaryContainer).toHaveFocus()

    const errorLink = within(summaryContainer as HTMLElement).getByRole('link', {
      name: 'Enter a percentage between 0 and 100',
    })
    expect(errorLink).toBeInTheDocument()

    await user.click(errorLink)
    expect(percentInput).toHaveFocus()
  })
})
