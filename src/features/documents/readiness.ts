import type { DocumentItem } from '@/types/document'
import type { Application } from '@/types/tracker'

export interface Readiness {
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
