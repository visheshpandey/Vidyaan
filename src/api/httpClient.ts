import type { z } from 'zod'
import { env } from '@/config/env'
import { ApiError } from './ApiError'

interface GetJsonOptions {
  /** Defaults to VITE_API_BASE_URL. Use an empty string to call the same origin as the page. */
  baseUrl?: string
  /** Defaults to VITE_API_TIMEOUT_MS. */
  timeoutMs?: number
  /** Lets the caller cancel the request, for example when a component unmounts. */
  signal?: AbortSignal
}

/** Joins a base URL and path with exactly one slash between them. */
function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

/**
 * GET a JSON resource from our own backend and validate it.
 * Every failure becomes an `ApiError`: network, timeout, non-2xx, or a response that does not match `schema`.
 * No credentials are sent. Third-party APIs must never be called from the browser.
 */
export async function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  options: GetJsonOptions = {},
): Promise<T> {
  const baseUrl = options.baseUrl ?? env.apiBaseUrl
  if (baseUrl === undefined) throw new ApiError('No API base URL is configured', 'network')

  const controller = new AbortController()
  const timeoutMs = options.timeoutMs ?? env.apiTimeoutMs
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const onCallerAbort = () => controller.abort()
  if (options.signal?.aborted) controller.abort()
  else options.signal?.addEventListener('abort', onCallerAbort, { once: true })

  try {
    let response: Response
    try {
      response = await fetch(joinUrl(baseUrl, path), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        signal: controller.signal,
      })
    } catch (cause) {
      if (controller.signal.aborted) {
        throw new ApiError(`Request timed out after ${timeoutMs} ms`, 'timeout', { cause })
      }
      throw new ApiError('Network request failed', 'network', { cause })
    }

    if (!response.ok) {
      throw new ApiError(`Request failed with status ${response.status}`, 'http', {
        status: response.status,
      })
    }

    let body: unknown
    try {
      body = await response.json()
    } catch (cause) {
      throw new ApiError('Response was not valid JSON', 'invalid', { cause })
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      throw new ApiError('Response did not match the expected shape', 'invalid', {
        cause: parsed.error,
      })
    }
    return parsed.data
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener('abort', onCallerAbort)
  }
}
