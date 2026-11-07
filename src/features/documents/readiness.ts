import type { DocumentItem } from '@/types/document'
import type { Application } from '@/types/tracker'

/** Share of the student's documents that are available, as a whole percentage. 0 when the list is empty. */
export function overallReadiness(documents: DocumentItem[]): {
  available: number
  percent: number
} {
  const available = documents.filter((d) => d.status === 'available').length
  return {
    available,
    percent: documents.length === 0 ? 0 : Math.round((available / documents.length) * 100),
  }
}

interface Readiness {
  ready: number
  total: number
  percent: number
  missing: string[]
}

/** How many of an application's required documents are available right now. */
export function readiness(app: Application, documents: DocumentItem[]): Readiness {
  const have = new Set(documents.filter((d) => d.status === 'available').map((d) => d.name))
  const missing = app.documentChecklist.filter((name) => !have.has(name))
  const total = app.documentChecklist.length
  const ready = total - missing.length
  return { ready, total, percent: total === 0 ? 100 : Math.round((ready / total) * 100), missing }
}
