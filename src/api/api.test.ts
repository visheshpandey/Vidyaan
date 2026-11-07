import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ApiError } from './ApiError'
import { loadBundledScholarships } from './bundledScholarships'
import { getJson } from './httpClient'
import { createScholarshipsApi } from './scholarshipsApi'

const BASE = 'https://api.test/v1'
const bundled = loadBundledScholarships()

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => vi.unstubAllGlobals())

describe('getJson', () => {
  const schema = z.object({ ok: z.boolean() })

  it('returns validated data and calls the joined URL with GET and no credentials', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    await expect(getJson('/ping', schema, { baseUrl: `${BASE}/` })).resolves.toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('https://api.test/v1/ping')
    expect(init?.method).toBe('GET')
    expect(init?.credentials).toBe('omit')
  })

  it('throws an http ApiError on a non-2xx response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 503 }))
    const err = await getJson('/ping', schema, { baseUrl: BASE }).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ code: 'http', status: 503 })
  })

  it('throws an invalid ApiError when the shape is wrong', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: 'yes' }))
    await expect(getJson('/ping', schema, { baseUrl: BASE })).rejects.toMatchObject({
      code: 'invalid',
    })
  })

  it('throws an invalid ApiError when the body is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('<html>', { status: 200 }))
    await expect(getJson('/ping', schema, { baseUrl: BASE })).rejects.toMatchObject({
      code: 'invalid',
    })
  })

  it('throws a network ApiError when fetch fails', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(getJson('/ping', schema, { baseUrl: BASE })).rejects.toMatchObject({
      code: 'network',
    })
  })

  it('throws a timeout ApiError when the server is too slow', async () => {
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          )
        }),
    )
    await expect(getJson('/ping', schema, { baseUrl: BASE, timeoutMs: 10 })).rejects.toMatchObject({
      code: 'timeout',
    })
  })

  it('fails clearly when no base URL is configured', async () => {
    await expect(getJson('/ping', schema, { baseUrl: undefined })).rejects.toMatchObject({
      code: 'network',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('createScholarshipsApi', () => {
  const remote = bundled.slice(0, 2)
  const config = { baseUrl: BASE, timeoutMs: 1000, cacheMs: 60_000 }

  it('reads the same-origin static file when no backend is set', async () => {
    fetchMock.mockResolvedValue(jsonResponse(remote))
    const api = createScholarshipsApi({ ...config, baseUrl: undefined })
    await expect(api.fetchScholarships()).resolves.toEqual(remote)
    expect(fetchMock.mock.calls[0]?.[0] as string).toBe('/data/scholarships.json')
  })

  it('uses bundled data when the static file cannot be loaded', async () => {
    fetchMock.mockRejectedValue(new TypeError('offline'))
    const api = createScholarshipsApi({ ...config, baseUrl: undefined })
    await expect(api.fetchScholarships()).resolves.toEqual(bundled)
  })

  it('reports where the data came from', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(remote))
    const api = createScholarshipsApi(config)
    expect((await api.fetchScholarshipsWithSource()).source).toBe('network')
    api.clearCache()
    fetchMock.mockRejectedValueOnce(new TypeError('offline'))
    expect((await api.fetchScholarshipsWithSource()).source).toBe('fallback')
  })

  it('drops invalid records but keeps the valid ones', async () => {
    fetchMock.mockResolvedValue(jsonResponse([...remote, { id: 7 }]))
    const api = createScholarshipsApi(config)
    await expect(api.fetchScholarships()).resolves.toEqual(remote)
  })

  it('skips the cache when forced', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(remote)))
    const api = createScholarshipsApi(config)
    await api.fetchScholarships()
    await api.fetchScholarships({ force: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('returns backend data when the request succeeds', async () => {
    fetchMock.mockResolvedValue(jsonResponse(remote))
    const api = createScholarshipsApi(config)
    await expect(api.fetchScholarships()).resolves.toEqual(remote)
  })

  it('serves the second call from the cache', async () => {
    fetchMock.mockResolvedValue(jsonResponse(remote))
    const api = createScholarshipsApi(config)
    await api.fetchScholarships()
    await api.fetchScholarships()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fetches again after the cache expires', async () => {
    let t = 0
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(remote)))
    const api = createScholarshipsApi({ ...config, now: () => t })
    await api.fetchScholarships()
    t = 60_001
    await api.fetchScholarships()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['a network error', () => fetchMock.mockRejectedValue(new TypeError('offline'))],
    ['a server error', () => fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }))],
    ['an invalid response', () => fetchMock.mockResolvedValue(jsonResponse([{ id: 1 }]))],
  ])('falls back to bundled data on %s', async (_label, arrange) => {
    arrange()
    const api = createScholarshipsApi(config)
    await expect(api.fetchScholarships()).resolves.toEqual(bundled)
  })

  it('does not cache the fallback, so it retries next time', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('offline'))
    fetchMock.mockResolvedValueOnce(jsonResponse(remote))
    const api = createScholarshipsApi(config)
    await expect(api.fetchScholarships()).resolves.toEqual(bundled)
    await expect(api.fetchScholarships()).resolves.toEqual(remote)
  })
})
