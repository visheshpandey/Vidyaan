/** Limits used for free-text input, shared by inputs, stores and schemas. */
export const TEXT_LIMITS = {
  name: 60,
  documentName: 60,
  search: 100,
} as const

// C0 and C1 control characters, except tab (\t), newline (\n) and carriage return (\r) which callers handle.
const CONTROL_CHARS = '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F]'
// Zero-width characters, bidi embeddings/overrides/isolates, word joiner and BOM. These can hide or reorder text.
const INVISIBLE_CHARS = '[\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064\\u2066-\\u2069\\uFEFF]'
const CONTROL_EXCEPT_WHITESPACE = new RegExp(CONTROL_CHARS, 'g')
const INVISIBLE_AND_BIDI = new RegExp(INVISIBLE_CHARS, 'g')

/** Removes control, zero-width and bidi-override characters. Keeps tabs and line breaks for the caller to handle. */
function stripUnsafeCharacters(value: string): string {
  return value.replace(CONTROL_EXCEPT_WHITESPACE, '').replace(INVISIBLE_AND_BIDI, '')
}

/**
 * Cleans a single-line text value: strips control, zero-width and bidi-override characters,
 * collapses all whitespace (including line breaks) to single spaces, trims, and caps the length.
 */
export function sanitizeText(value: string, maxLength: number): string {
  return stripUnsafeCharacters(value).replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

/**
 * Cleans a multi-line value such as notes: strips unsafe characters, normalises line endings to `\n`,
 * turns tabs into spaces, and caps the length. It deliberately does not trim or collapse spaces and
 * line breaks, so it is safe to run on every keystroke of a controlled textarea.
 */
export function sanitizeMultiline(value: string, maxLength: number): string {
  return stripUnsafeCharacters(value)
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, ' ')
    .slice(0, maxLength)
}

/** True when `value` is a calendar date written as YYYY-MM-DD. */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

/** Cleans a search query: single line, no unsafe characters, at most {@link TEXT_LIMITS.search} characters. */
export function sanitizeSearch(value: string): string {
  return sanitizeText(value, TEXT_LIMITS.search)
}

/**
 * True only for absolute http: or https: URLs that have a host.
 * Rejects javascript:, data:, vbscript:, file:, blob: and anything that cannot be parsed.
 */
export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname.length > 0
  } catch {
    return false
  }
}
