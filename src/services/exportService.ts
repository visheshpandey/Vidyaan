import type { Application } from '@/types/tracker'

const cell = (v: string) => {
  // Neutralise spreadsheet formulas (CSV injection) and quote when needed.
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

/** Tracker as CSV: one row per application. */
export function applicationsToCsv(apps: Application[], titleOf: (id: string) => string): string {
  const header = ['Scholarship', 'Status', 'Created', 'Updated', 'Notes']
  const rows = apps.map((a) => [
    titleOf(a.scholarshipId),
    a.status,
    a.createdAt,
    a.updatedAt,
    a.notes,
  ])
  return [header, ...rows].map((r) => r.map(cell).join(',')).join('\n')
}

/**
 * Triggers a browser download of text content.
 * Never throws: returns false when the browser blocks or fails the download so callers can tell the user.
 */
export function downloadText(filename: string, content: string, type: string): boolean {
  let url: string | null = null
  try {
    url = URL.createObjectURL(new Blob([content], { type }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    return true
  } catch {
    return false
  } finally {
    if (url) {
      try {
        URL.revokeObjectURL(url)
      } catch {
        // Nothing useful to do if revoking fails.
      }
    }
  }
}
