import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

describe('R6.2 parseEnv', () => {
  it('uses safe defaults when nothing is set', () => {
    expect(parseEnv({})).toEqual({
      appName: 'GRANTLY',
      apiBaseUrl: undefined,
      apiTimeoutMs: 8000,
      apiCacheMs: 600000,
    })
  })

  it('reads valid values (numbers arrive as strings)', () => {
    const env = parseEnv({
      VITE_APP_NAME: 'GRANTLY Staging',
      VITE_API_BASE_URL: 'https://api.example.org/v1',
      VITE_API_TIMEOUT_MS: '3000',
      VITE_API_CACHE_MS: '0',
    })
    expect(env).toEqual({
      appName: 'GRANTLY Staging',
      apiBaseUrl: 'https://api.example.org/v1',
      apiTimeoutMs: 3000,
      apiCacheMs: 0,
    })
  })

  it('ignores malformed values instead of throwing', () => {
    const env = parseEnv({
      VITE_APP_NAME: '   ',
      VITE_API_BASE_URL: 'not a url',
      VITE_API_TIMEOUT_MS: 'abc',
      VITE_API_CACHE_MS: '-5',
    })
    expect(env.appName).toBe('GRANTLY')
    expect(env.apiBaseUrl).toBeUndefined()
    expect(env.apiTimeoutMs).toBe(8000)
    expect(env.apiCacheMs).toBe(600000)
  })

  it('rejects non-http URL schemes', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'javascript:alert(1)' }).apiBaseUrl).toBeUndefined()
    expect(parseEnv({ VITE_API_BASE_URL: 'ftp://files.example.org' }).apiBaseUrl).toBeUndefined()
  })

  it('returns a frozen object', () => {
    expect(Object.isFrozen(parseEnv({}))).toBe(true)
  })
})
