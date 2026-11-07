import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppShell } from '@/components/layout/AppShell'
import { SkipLink } from '@/components/layout/SkipLink'
import { loadDemoData } from '@/features/demo/demoMode'
import { resetApp } from './helpers'

function renderShell() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <SkipLink />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<h1>Dashboard content</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('R5.2 Keyboard navigation', () => {
  beforeEach(() => {
    resetApp()
    loadDemoData()
  })

  it('offers a skip link that points at the main content', () => {
    renderShell()

    const skip = screen.getByRole('link', { name: /skip to main content/i })
    expect(skip).toHaveAttribute('href', '#main')
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main')
    expect(main).toHaveAttribute('tabindex', '-1')
  })

  it('makes the skip link the first stop when the student presses Tab', async () => {
    const user = userEvent.setup()
    renderShell()

    await user.tab()

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveFocus()
  })

  it('reaches the main navigation links with Tab alone', async () => {
    const user = userEvent.setup()
    renderShell()
    const reached: string[] = []

    for (let i = 0; i < 12; i += 1) {
      await user.tab()
      const label =
        document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent
      reached.push(label ?? '')
    }

    for (const name of ['Dashboard', 'Discover', 'Applications', 'Profile']) {
      expect(reached).toContain(name)
    }
  })

  it('has exactly one main landmark and labelled navigation regions', () => {
    renderShell()

    expect(screen.getAllByRole('main')).toHaveLength(1)
    for (const nav of screen.getAllByRole('navigation')) {
      expect(nav).toHaveAccessibleName()
    }
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('opens the bottom-bar "More" menu with the keyboard and lists the other pages', async () => {
    const user = userEvent.setup()
    renderShell()

    screen.getByRole('button', { name: 'More' }).focus()
    await user.keyboard('{Enter}')

    expect(await screen.findByRole('menuitem', { name: 'Documents' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument()
  })
})
