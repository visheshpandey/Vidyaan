import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadDemoData } from '@/features/demo/demoMode'
import Documents from '@/pages/Documents'
import { useDocumentStore } from '@/store/documentStore'
import { renderApp, resetApp, signIn } from './helpers'

function renderDocuments() {
  return renderApp([{ path: '/documents', element: <Documents /> }], '/documents')
}

function row(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no list row for ${name}`)
  return li
}

describe('R4.1 R4.2 Documents', () => {
  beforeEach(() => {
    resetApp()
    signIn()
  })

  it('adds a document as missing and ignores duplicates', async () => {
    const user = userEvent.setup()
    renderDocuments()

    await user.type(screen.getByLabelText('New document name'), 'Caste certificate')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('New document name'), 'caste CERTIFICATE')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(within(row('Caste certificate')).getByText('Missing')).toBeInTheDocument()
    expect(useDocumentStore.getState().documents).toHaveLength(1)
  })

  it('gives every document its own id, even when two are added in the same millisecond', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
    useDocumentStore.getState().addDocument('Marksheet')
    useDocumentStore.getState().addDocument('Bank passbook')

    const ids = useDocumentStore.getState().documents.map((d) => d.id)
    expect(new Set(ids).size).toBe(2)
    vi.restoreAllMocks()
  })

  it('disables Add until something is typed', () => {
    renderDocuments()

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('updates the readiness percentage when a document becomes available', async () => {
    const user = userEvent.setup()
    useDocumentStore.getState().addDocument('Marksheet')
    useDocumentStore.getState().addDocument('Bank passbook')
    renderDocuments()
    expect(screen.getByText('0 of 2 documents available')).toBeInTheDocument()

    await user.click(within(row('Marksheet')).getByRole('button', { name: 'Mark available' }))

    expect(screen.getByText('1 of 2 documents available')).toBeInTheDocument()
    expect(screen.getAllByText('50%').length).toBeGreaterThan(0)

    await user.click(within(row('Marksheet')).getByRole('button', { name: 'Mark missing' }))

    expect(screen.getByText('0 of 2 documents available')).toBeInTheDocument()
  })

  it('needs confirmation before a document is removed', async () => {
    const user = userEvent.setup()
    useDocumentStore.getState().addDocument('Marksheet')
    renderDocuments()

    await user.click(screen.getByRole('button', { name: 'Remove Marksheet' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Remove document?')).toBeInTheDocument()
    expect(useDocumentStore.getState().documents).toHaveLength(1)

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(useDocumentStore.getState().documents).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Remove Marksheet' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Remove' }))

    expect(useDocumentStore.getState().documents).toEqual([])
    expect(screen.queryByText('Marksheet')).not.toBeInTheDocument()
  })

  it('warns about a document that expires soon', () => {
    loadDemoData()
    renderDocuments()

    expect(within(row('Income certificate')).getByText(/Expires in \d+ days/)).toBeInTheDocument()
  })
})
