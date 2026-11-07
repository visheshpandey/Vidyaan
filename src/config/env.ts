import { z } from 'zod'

const DEFAULTS = {
  appName: 'GRANTLY',
  apiTimeoutMs: 8000,
  /** Matches the project rule: cache API responses for 10 minutes. */
  apiCacheMs: 10 * 60 * 1000,
} as const

const httpUrl = z
  .string()
  .trim()
  .url()
  .refine((v) => /^https?:\/\//i.test(v), 'Only http(s) URLs are allowed')

/** Every variable is optional. Anything missing or malformed falls back to a safe default. */
const envSchema = z.object({
  VITE_APP_NAME: z.string().trim().min(1).catch(DEFAULTS.appName),
  VITE_API_BASE_URL: httpUrl.optional().catch(undefined),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().catch(DEFAULTS.apiTimeoutMs),
  VITE_API_CACHE_MS: z.coerce.number().int().nonnegative().catch(DEFAULTS.apiCacheMs),
})

interface AppEnv {
  readonly appName: string
  /** Base URL of our own backend. Undefined means the app uses its bundled data. */
  readonly apiBaseUrl: string | undefined
  readonly apiTimeoutMs: number
  readonly apiCacheMs: number
}

/**
 * Turns raw `import.meta.env` values into a validated config object.
 * Pure and side-effect free so it can be unit tested with any input.
 */
export function parseEnv(raw: Record<string, unknown>): AppEnv {
  const parsed = envSchema.parse(raw)
  return Object.freeze({
    appName: parsed.VITE_APP_NAME,
    apiBaseUrl: parsed.VITE_API_BASE_URL,
    apiTimeoutMs: parsed.VITE_API_TIMEOUT_MS,
    apiCacheMs: parsed.VITE_API_CACHE_MS,
  })
}

/** The app's configuration, parsed once at startup. Read config from here, never from `import.meta.env`. */
export const env: AppEnv = parseEnv(import.meta.env)
