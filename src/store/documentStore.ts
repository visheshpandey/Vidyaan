import { create } from 'zustand'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { documentSchema } from '@/data/schemas'
import { loadJSON, saveJSON } from '@/services/storage'
import type { DocumentItem, DocumentStatus } from '@/types/document'
import { isIsoDate, sanitizeText, TEXT_LIMITS } from '@/utils/sanitize'

interface DocumentState {
  documents: DocumentItem[]
  addDocument: (name: string) => void
  setStatus: (id: string, status: DocumentStatus) => void
  setExpiry: (id: string, expiry: string | undefined) => void
  removeDocument: (id: string) => void
  reload: () => void
}

const MAX_DOCUMENTS = 100

let idSequence = 0

/** Unique even when two documents are added in the same millisecond (a bare timestamp is not). */
function nextDocumentId(): string {
  idSequence += 1
  return `doc-${Date.now()}-${idSequence}`
}

const read = () => loadJSON(STORAGE_KEYS.documents, z.array(documentSchema).max(MAX_DOCUMENTS), [])

/** Zustand store for the document checklist, persisted through services/storage. */
export const useDocumentStore = create<DocumentState>((set, get) => {
  const persist = (documents: DocumentItem[]) => {
    saveJSON(STORAGE_KEYS.documents, documents)
    set({ documents })
  }
  return {
    documents: read(),
    addDocument: (name) => {
      const clean = sanitizeText(name, TEXT_LIMITS.documentName)
      const { documents } = get()
      if (
        !clean ||
        documents.length >= MAX_DOCUMENTS ||
        documents.some((d) => d.name.toLowerCase() === clean.toLowerCase())
      )
        return
      persist([...documents, { id: nextDocumentId(), name: clean, status: 'missing' }])
    },
    setStatus: (id, status) =>
      persist(get().documents.map((d) => (d.id === id ? { ...d, status } : d))),
    setExpiry: (id, expiry) => {
      // Only a real YYYY-MM-DD date is stored; anything else clears the expiry.
      const safe = expiry !== undefined && isIsoDate(expiry) ? expiry : undefined
      persist(get().documents.map((d) => (d.id === id ? { ...d, expiry: safe } : d)))
    },
    removeDocument: (id) => persist(get().documents.filter((d) => d.id !== id)),
    reload: () => set({ documents: read() }),
  }
})
