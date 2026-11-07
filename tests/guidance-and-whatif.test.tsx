import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEMO_PROFILE } from '@/data/demo'
import { loadDemoData, resetAllData } from '@/features/demo/demoMode'
import { StepChecklist } from '@/features/applications/StepChecklist'
import { FilterControls } from '@/features/discover/FilterControls'
import { DEFAULT_FILTERS } from '@/features/discover/filters'
import { WhatIfPanel } from '@/features/matching/WhatIfPanel'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useTrackerStore } from '@/store/trackerStore'
import type { Scholarship } from '@/types/scholarship'

const STEPS = ['Register on the portal', 'Upload documents', 'Submit and print the receipt']

describe('R3.1 StepChecklist', () => {
  beforeEach(() => {
    resetAllData()
  })

  it('shows the next step and ticks steps off, saving progress', async () => {
    const app = useTrackerStore.getState().startTracking('guide-test', [])
    render(<StepChecklist applicationId={app.id} steps={STEPS} />)

    expect(screen.getByText(/next step:/i).parentElement).toHaveTextContent(
      'Register on the portal',
    )
    expect(screen.getByRole('progressbar', { name: /0 of 3 steps done/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: /register on the portal/i }))
    expect(screen.getByText(/next step:/i).parentElement).toHaveTextContent('Upload documents')
    expect(screen.getByRole('progressbar', { name: /1 of 3 steps done/i })).toBeInTheDocument()
    expect(useTrackerStore.getState().applications[0]?.stepsDone).toEqual([0])
  })

  it('celebrates when every step is done and lets a step be unticked', async () => {
    const app = useTrackerStore.getState().startTracking('guide-test-2', [])
    render(<StepChecklist applicationId={app.id} steps={STEPS.slice(0, 1)} />)
    const box = screen.getByRole('checkbox')
    await userEvent.click(box)
    expect(screen.getByText(/every step is done/i)).toBeInTheDocument()
    await userEvent.click(box)
    expect(screen.queryByText(/every step is done/i)).not.toBeInTheDocument()
  })

  it('explains when a scholarship has no steps', () => {
    render(<StepChecklist applicationId="none" steps={[]} />)
    expect(screen.getByText(/no guide steps yet/i)).toBeInTheDocument()
  })
})

describe('R2.3 WhatIfPanel', () => {
  const capped: Scholarship = {
    id: 'cap-test',
    title: 'Income Capped Award',
    provider: 'Test Trust',
    providerType: 'private',
    type: 'need',
    description: 'Test',
    benefits: [],
    amount: { value: 5000, period: 'yearly' },
    deadline: null,
    rules: { maxIncome: 100000 },
    requiredDocuments: [],
    steps: [],
    applicationUrl: 'https://example.org',
    sourceUrl: 'https://example.org',
    dataType: 'sample',
  }

  it('invites the student to try a number first', () => {
    render(
      <MemoryRouter>
        <WhatIfPanel profile={DEMO_PROFILE} scholarships={[capped]} />
      </MemoryRouter>,
    )
    expect(screen.getByText(/enter a number above to try it/i)).toBeInTheDocument()
  })

  it('lists scholarships that a lower income would unlock, without saving anything', async () => {
    localStorage.clear()
    render(
      <MemoryRouter>
        <WhatIfPanel profile={DEMO_PROFILE} scholarships={[capped]} />
      </MemoryRouter>,
    )
    await userEvent.type(screen.getByLabelText(/family income/i), '90000')
    const status = screen.getByRole('status')
    expect(within(status).getByText(/newly unlocked \(1\)/i)).toBeInTheDocument()
    expect(within(status).getByRole('link', { name: /income capped award/i })).toBeInTheDocument()
    expect(localStorage.getItem('grantly:v1:profile')).toBeNull()
  })

  it('ignores impossible numbers', async () => {
    render(
      <MemoryRouter>
        <WhatIfPanel profile={DEMO_PROFILE} scholarships={getScholarshipsSync()} />
      </MemoryRouter>,
    )
    await userEvent.type(screen.getByLabelText(/exam percentage/i), '250')
    expect(screen.getByText(/enter a number above to try it/i)).toBeInTheDocument()
  })
})

describe('R1.2 FilterControls (richer discovery)', () => {
  it('offers state, category, course, minimum award and saved-only filters', async () => {
    const onChange = vi.fn()
    render(<FilterControls filters={DEFAULT_FILTERS} onChange={onChange} />)

    await userEvent.selectOptions(screen.getByLabelText('State'), 'Kerala')
    expect(onChange).toHaveBeenLastCalledWith({ state: 'Kerala' })

    await userEvent.selectOptions(screen.getByLabelText('Category'), 'OBC')
    expect(onChange).toHaveBeenLastCalledWith({ category: 'OBC' })

    await userEvent.selectOptions(screen.getByLabelText('Course'), 'B.Tech')
    expect(onChange).toHaveBeenLastCalledWith({ course: 'B.Tech' })

    await userEvent.selectOptions(screen.getByLabelText('Minimum award'), '25000')
    expect(onChange).toHaveBeenLastCalledWith({ minAmount: 25000 })

    await userEvent.click(screen.getByRole('checkbox', { name: /saved scholarships only/i }))
    expect(onChange).toHaveBeenLastCalledWith({ savedOnly: true })
  })

  it('keeps the demo data loader available for other tests', () => {
    expect(typeof loadDemoData).toBe('function')
  })
})
