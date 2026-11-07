import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScholarshipsProvider } from '@/app/ScholarshipsProvider'
import { scholarshipsApi } from '@/api/scholarshipsApi'
import raw from '@/data/scholarships.json'
import { DataStatus } from '@/features/scholarships/DataStatus'
import { useScholarships } from '@/hooks/useScholarships'

const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Two valid records with new ids, so tests can tell fetched data from bundled data. */
const remote = [
  { ...raw[0], id: 'remote-a', title: 'Remote A' },
  { ...raw[1], id: 'remote-b', title: 'Remote B' },
]

function Probe() {
  const { scholarships, status, reload } = useScholarships()
  return (
    <div>
      <p data-testid="count">{scholarships.length}</p>
      <p data-testid="status">{status}</p>
      <button onClick={reload}>reload</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <ScholarshipsProvider>
      <Probe />
      <DataStatus />
    </ScholarshipsProvider>,
  )
}

beforeEach(() => {
  scholarshipsApi.clearCache()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useScholarships without a provider', () => {
  it('still returns the bundled scholarships, so pages render synchronously', () => {
    render(<Probe />)
    expect(screen.getByTestId('count')).toHaveTextContent(String(raw.length))
    expect(screen.getByTestId('status')).toHaveTextContent('ready')
  })
})

describe('ScholarshipsProvider', () => {
  it('shows bundled data first, then switches to the fetched list', async () => {
    fetchMock.mockResolvedValue(jsonResponse(remote))
    renderWithProvider()

    expect(screen.getByTestId('count')).toHaveTextContent(String(raw.length))
    expect(screen.getByTestId('status')).toHaveTextContent('refreshing')

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(fetchMock.mock.calls[0]?.[0] as string).toContain('/data/scholarships.json')
  })

  it('drops a bad record and keeps the good ones', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse([
        ...remote,
        { id: 42, title: 'not a scholarship' },
        { ...raw[2], applicationUrl: 'javascript:alert(1)' },
      ]),
    )
    renderWithProvider()

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('falls back to bundled data and says it is offline when the request fails', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    renderWithProvider()

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('offline'))
    expect(screen.getByTestId('count')).toHaveTextContent(String(raw.length))
    expect(screen.getByText(/you are offline\. showing saved scholarships/i)).toBeInTheDocument()
  })

  it('treats a response with no valid records as offline instead of showing an empty list', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ id: 1 }]))
    renderWithProvider()

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('offline'))
    expect(screen.getByTestId('count')).toHaveTextContent(String(raw.length))
  })

  it('"Try again" asks the server again and recovers', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    fetchMock.mockResolvedValue(jsonResponse(remote))
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('offline'))

    await userEvent.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('ready'))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(screen.queryByText(/you are offline/i)).not.toBeInTheDocument()
  })
})

describe('DataStatus', () => {
  it('stays quiet for a quick refresh and mentions it only when loading is slow', async () => {
    vi.useFakeTimers()
    fetchMock.mockImplementation(() => new Promise<Response>(() => undefined))
    renderWithProvider()

    expect(screen.queryByText(/updating scholarships/i)).not.toBeInTheDocument()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(900)
    })
    expect(screen.getByText(/updating scholarships/i)).toBeInTheDocument()
  })

  it('is a polite live region', () => {
    renderWithProvider()
    const regions = screen.getAllByRole('status')
    expect(regions.some((r) => r.getAttribute('aria-live') === 'polite')).toBe(true)
  })
})
