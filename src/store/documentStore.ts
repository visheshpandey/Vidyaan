import { create } from 'zustand'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { documentSchema } from '@/data/schemas'
import { loadJSON, saveJSON } from '@/services/storage'
import type { DocumentItem, DocumentStatus } from '@/types/document'

interface DocumentState {
  documents: DocumentItem[]
  addDocument: (name: string) => void
  setStatus: (id: string, status: DocumentStatus) => void
  setExpiry: (id: string, expiry: string | undefined) => void
  removeDocument: (id: string) => void
  reload: () => void
}

const read = () => loadJSON(STORAGE_KEYS.documents, z.array(documentSchema), [])

export const useDocumentStore = create<DocumentState>((set, get) => {
  const persist = (documents: DocumentItem[]) => {
    saveJSON(STORAGE_KEYS.documents, documents)
    set({ documents })
  }
  return {
    documents: read(),
    addDocument: (name) => {
      const trimmed = name.trim()
      if (!trimmed || get().documents.some((d) => d.name.toLowerCase() === trimmed.toLowerCase())) return
      persist([...get().documents, { id: `doc-${Date.now()}`, name: trimmed, status: 'missing' }])
    },
    setStatus: (id, status) =>
      persist(get().documents.map((d) => (d.id === id ? { ...d, status } : d))),
    setExpiry: (id, expiry) =>
      persist(get().documents.map((d) => (d.id === id ? { ...d, expiry } : d))),
    removeDocument: (id) => persist(get().documents.filter((d) => d.id !== id)),
    reload: () => set({ documents: read() }),
  }
})
