import type { z } from 'zod'
import { STORAGE_KEYS, type StorageKey } from '@/constants/storage-keys'

/** Largest stored value we are willing to parse, in characters. Real data is a few kilobytes. */
export const MAX_STORED_CHARS = 1_000_000

function getStore(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

/**
 * Reads and validates a value. Missing, corrupt, or wrongly-shaped data
 * returns the fallback so the app never crashes on bad storage.
 */
export function loadJSON<T>(key: StorageKey, schema: z.ZodType<T>, fallback: T): T {
  const store = getStore()
  if (!store) return fallback
  try {
    const raw = store.getItem(key)
    if (raw === null || raw.length > MAX_STORED_CHARS) return fallback
    const parsed = schema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : fallback
  } catch {
    return fallback
  }
}

/** Writes a value; returns false if storage is unavailable or full. */
export function saveJSON(key: StorageKey, value: unknown): boolean {
  const store = getStore()
  if (!store) return false
  try {
    store.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/** Removes every GRANTLY key. Used by "Clear local data" and "Reset demo". */
export function clearAllData(): void {
  const store = getStore()
  if (!store) return
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      store.removeItem(key)
    } catch {
      /* ignore */
    }
  }
}
