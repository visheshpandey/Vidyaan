interface Entry<T> {
  value: T
  expiresAt: number
}

/** Small in-memory cache where every entry expires after a fixed time. */
export class TtlCache<T> {
  private readonly entries = new Map<string, Entry<T>>()
  private readonly ttlMs: number
  private readonly now: () => number

  /**
   * @param ttlMs how long an entry stays valid. 0 disables caching.
   * @param now clock, injectable so tests do not need real timers.
   */
  constructor(ttlMs: number, now: () => number = Date.now) {
    this.ttlMs = ttlMs
    this.now = now
  }

  /** Returns the cached value, or undefined if missing or expired. */
  get(key: string): T | undefined {
    const entry = this.entries.get(key)
    if (!entry) return undefined
    if (this.now() >= entry.expiresAt) {
      this.entries.delete(key)
      return undefined
    }
    return entry.value
  }

  /** Stores a value for the configured time. */
  set(key: string, value: T): void {
    if (this.ttlMs <= 0) return
    this.entries.set(key, { value, expiresAt: this.now() + this.ttlMs })
  }

  /** Removes everything. */
  clear(): void {
    this.entries.clear()
  }
}
