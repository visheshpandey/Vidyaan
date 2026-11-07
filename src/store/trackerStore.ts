import { create } from 'zustand'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { applicationSchema } from '@/data/schemas'
import { applyStatus, createApplication } from '@/features/applications/transitions'
import { loadJSON, saveJSON } from '@/services/storage'
import type { Application, ApplicationStatus } from '@/types/tracker'

interface TrackerState {
  saved: string[]
  applications: Application[]
  toggleSaved: (scholarshipId: string) => boolean
  startTracking: (scholarshipId: string, checklist: string[]) => Application
  setStatus: (id: string, status: ApplicationStatus) => void
  setNotes: (id: string, notes: string) => void
  removeApplication: (id: string) => void
  reload: () => void
}

const read = () => ({
  saved: loadJSON(STORAGE_KEYS.saved, z.array(z.string()), []),
  applications: loadJSON(STORAGE_KEYS.applications, z.array(applicationSchema), []),
})

const nowIso = () => new Date().toISOString()

export const useTrackerStore = create<TrackerState>((set, get) => {
  const persist = (patch: Partial<Pick<TrackerState, 'saved' | 'applications'>>) => {
    if (patch.saved) saveJSON(STORAGE_KEYS.saved, patch.saved)
    if (patch.applications) saveJSON(STORAGE_KEYS.applications, patch.applications)
    set(patch)
  }

  return {
    ...read(),
    /** Returns true when the scholarship is now saved. */
    toggleSaved: (id) => {
      const { saved } = get()
      const nowSaved = !saved.includes(id)
      persist({ saved: nowSaved ? [...saved, id] : saved.filter((s) => s !== id) })
      return nowSaved
    },
    startTracking: (id, checklist) => {
      const existing = get().applications.find((a) => a.scholarshipId === id)
      if (existing) return existing
      const app = createApplication(id, nowIso(), checklist)
      const { saved, applications } = get()
      persist({
        applications: [...applications, app],
        saved: saved.includes(id) ? saved : [...saved, id],
      })
      return app
    },
    setStatus: (id, status) =>
      persist({
        applications: get().applications.map((a) =>
          a.id === id ? applyStatus(a, status, nowIso()) : a,
        ),
      }),
    setNotes: (id, notes) =>
      persist({
        applications: get().applications.map((a) =>
          a.id === id ? { ...a, notes, updatedAt: nowIso() } : a,
        ),
      }),
    removeApplication: (id) =>
      persist({ applications: get().applications.filter((a) => a.id !== id) }),
    reload: () => set(read()),
  }
})
