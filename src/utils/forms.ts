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
