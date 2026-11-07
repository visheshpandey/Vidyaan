/** Turns a list of strings into `{ value, label }` options for a select. */
export function toOptions(list: string[]): Array<{ value: string; label: string }> {
  return list.map((v) => ({ value: v, label: v }))
}

/** Parses a numeric input value. An empty string means "not answered" and returns undefined. */
export function parseNumber(v: string): number | undefined {
  if (v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export interface FormErrorItem {
  fieldId?: string
  message: string
}

/**
 * Normalises errors from an array or record into a list of items for error summaries.
 */
export function normalizeErrors(
  errors: FormErrorItem[] | Record<string, string | undefined>,
): FormErrorItem[] {
  if (Array.isArray(errors)) {
    return errors.filter((item) => Boolean(item.message))
  }
  return Object.entries(errors)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([fieldId, message]) => ({ fieldId, message }))
}
