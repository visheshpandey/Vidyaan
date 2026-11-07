import type { Application } from '@/types/tracker'

const cell = (v: string) => {
  // Neutralise spreadsheet formulas (CSV injection) and quote when needed.
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

/** Tracker as CSV: one row per application. */
export function applicationsToCsv(apps: Application[], titleOf: (id: string) => string): string {
  const header = ['Scholarship', 'Status', 'Created', 'Updated', 'Notes']
  const rows = apps.map((a) => [titleOf(a.scholarshipId), a.status, a.createdAt, a.updatedAt, a.notes])
  return [header, ...rows].map((r) => r.map(cell).join(',')).join('\n')
}

/** Triggers a browser download of text content. */
export function downloadText(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
