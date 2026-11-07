export type DocumentStatus = 'available' | 'missing'

/** Metadata only. No file contents are ever stored. */
export interface DocumentItem {
  id: string
  name: string
  status: DocumentStatus
  /** ISO date when the document expires, if it does. */
  expiry?: string
}
