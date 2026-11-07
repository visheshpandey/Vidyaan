import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Applications from '@/pages/Applications'
import ApplicationDetail from '@/pages/ApplicationDetail'
import ScholarshipDetail from '@/pages/ScholarshipDetail'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useTrackerStore } from '@/store/trackerStore'
import { currentUrl, renderApp, resetApp, signIn } from './helpers'

const scholarship = getScholarshipsSync().find((s) => s.id === 'demo-merit-engineering')
const routes = [
  { path: '/scholarship/:id', element: <ScholarshipDetail /> },
  { path: '/applications', element: <Applications /> },
  { path: '/applications/:id', element: <ApplicationDetail /> },
]

function title(): string {
  if (!scholarship) throw new Error('demo scholarship missing from bundled data')
  return scholarship.title
}

describe('R3.2 R3.3 R4.5 Tracking an application', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('creates a tracked application from the scholarship page', async () => {
    const user = userEvent.setup()
    renderApp(routes, '/scholarship/demo-merit-engineering')

    await user.click(screen.getByRole('button', { name: 'Start tracking' }))

    const { applications } = useTrackerStore.getState()
    expect(applications).toHaveLength(1)
    expect(applications[0]?.status).toBe('saved')
    expect(currentUrl()).toBe('/applications/app-demo-merit-engineering')
    expect(screen.getByRole('heading', { level: 1, name: title() })).toBeInTheDocument()
  })

  it('moves an application to a new status with the keyboard-friendly menu', async () => {
    const user = userEvent.setup()
    useTrackerStore.getState().startTracking('demo-merit-engineering', ['Marksheet'])
    renderApp(routes, '/applications/app-demo-merit-engineering')

    screen.getByRole('button', { name: `Move ${title()} to another status` }).focus()
    await user.keyboard('{Enter}')
    // Menu opens on the first item (Saved); two steps down is Submitted.
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(useTrackerStore.getState().applications[0]?.status).toBe('submitted')
    expect(await screen.findByText(`${title()} moved to Submitted`)).toBeInTheDocument()
    const history = screen.getByRole('heading', { name: 'History' }).closest('div')
    expect(history).not.toBeNull()
    expect(within(history as HTMLElement).getByText('Submitted')).toBeInTheDocument()
  })

  it('asks for confirmation before it stops tracking, and can be cancelled', async () => {
    const user = userEvent.setup()
    useTrackerStore.getState().startTracking('demo-merit-engineering', [])
    renderApp(routes, '/applications/app-demo-merit-engineering')

    await user.click(screen.getByRole('button', { name: 'Stop tracking' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Stop tracking?')).toBeInTheDocument()
    expect(useTrackerStore.getState().applications).toHaveLength(1)

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(useTrackerStore.getState().applications).toHaveLength(1)
  })

  it('removes the application after the student confirms', async () => {
    const user = userEvent.setup()
    useTrackerStore.getState().startTracking('demo-merit-engineering', [])
    renderApp(routes, '/applications/app-demo-merit-engineering')

    await user.click(screen.getByRole('button', { name: 'Stop tracking' }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Stop tracking' }),
    )

    expect(useTrackerStore.getState().applications).toEqual([])
    expect(currentUrl()).toBe('/applications')
    expect(screen.getByText('No applications yet')).toBeInTheDocument()
  })

  it('keeps notes the student types and counts the characters', async () => {
    const user = userEvent.setup()
    useTrackerStore.getState().startTracking('demo-merit-engineering', [])
    renderApp(routes, '/applications/app-demo-merit-engineering')

    await user.type(screen.getByLabelText(`Notes for ${title()}`), 'Call office Monday')

    expect(useTrackerStore.getState().applications[0]?.notes).toBe('Call office Monday')
    expect(screen.getByText(/18\/1000/)).toBeInTheDocument()
  })

  it('shows a way forward for an application that does not exist', () => {
    renderApp(routes, '/applications/app-nope')

    expect(screen.getByText('Application not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to applications' })).toBeInTheDocument()
  })
})
