import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Suspense } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { loadDemoData, resetAllData } from '@/features/demo/demoMode'
import Applications from '@/pages/Applications'
import ApplicationDetail from '@/pages/ApplicationDetail'
import Dashboard from '@/pages/Dashboard'
import Deadlines from '@/pages/Deadlines'
import Discover from '@/pages/Discover'
import Documents from '@/pages/Documents'
import Landing from '@/pages/Landing'
import Onboarding from '@/pages/Onboarding'
import Profile from '@/pages/Profile'
import Saved from '@/pages/Saved'
import ScholarshipDetail from '@/pages/ScholarshipDetail'

const PAGES: Array<[string, string, string, () => React.ReactElement]> = [
  ['Landing', '/', '/', () => <Landing />],
  ['Onboarding', '/onboarding', '/onboarding', () => <Onboarding />],
  ['Dashboard', '/dashboard', '/dashboard', () => <Dashboard />],
  ['Discover', '/discover', '/discover', () => <Discover />],
  ['Scholarship detail', '/scholarship/:id', '/scholarship/aicte-pragati', () => <ScholarshipDetail />],
  ['Saved', '/saved', '/saved', () => <Saved />],
  ['Applications', '/applications', '/applications', () => <Applications />],
  ['Application detail', '/applications/:id', '/applications/app-demo-need-ug', () => <ApplicationDetail />],
  ['Documents', '/documents', '/documents', () => <Documents />],
  ['Deadlines', '/deadlines', '/deadlines', () => <Deadlines />],
  ['Profile', '/profile', '/profile', () => <Profile />],
]

describe('pages have no detectable accessibility violations (demo data loaded)', () => {
  beforeEach(() => {
    resetAllData()
    loadDemoData()
  })

  it.each(PAGES)('%s', async (_name, pattern, url, element) => {
    const { container } = render(
      <MemoryRouter initialEntries={[url]}>
        <Suspense fallback={null}>
          <Routes>
            <Route path={pattern} element={element()} />
          </Routes>
        </Suspense>
      </MemoryRouter>,
    )
    expect(container.querySelector('h1')).not.toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('empty states', () => {
  it('shows an empty tracker with a way forward', () => {
    resetAllData()
    render(
      <MemoryRouter>
        <Applications />
      </MemoryRouter>,
    )
    expect(screen.getByText('No applications yet')).toBeInTheDocument()
  })
})
