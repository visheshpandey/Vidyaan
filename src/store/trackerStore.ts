import { create } from 'zustand'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { applicationSchema } from '@/data/schemas'
import { toggleStep as toggleStepIndex } from '@/features/applications/steps'
import { applyStatus, createApplication } from '@/features/applications/transitions'
import { loadJSON, saveJSON } from '@/services/storage'
import { MAX_NOTES_LENGTH } from '@/constants/limits'
import type { Application, ApplicationStatus } from '@/types/tracker'
import { sanitizeMultiline } from '@/utils/sanitize'

interface TrackerState {
  saved: string[]
  applications: Application[]
  toggleSaved: (scholarshipId: string) => boolean
  startTracking: (scholarshipId: string, checklist: string[]) => Application
  setStatus: (id: string, status: ApplicationStatus) => void
  setNotes: (id: string, notes: string) => void
  toggleStep: (id: string, index: number, total: number) => void
  removeApplication: (id: string) => void
  restoreApplication: (application: Application) => void
  reload: () => void
}

const read = () => ({
  saved: loadJSON(STORAGE_KEYS.saved, z.array(z.string().max(100)).max(500), []),
  applications: loadJSON(STORAGE_KEYS.applications, z.array(applicationSchema), []),
})

const nowIso = () => new Date().toISOString()

/** Zustand store for tracked applications, notes, history and step progress. */
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
          a.id === id
            ? { ...a, notes: sanitizeMultiline(notes, MAX_NOTES_LENGTH), updatedAt: nowIso() }
            : a,
        ),
      }),
    toggleStep: (id, index, total) =>
      persist({
        applications: get().applications.map((a) =>
          a.id === id
            ? { ...a, stepsDone: toggleStepIndex(a.stepsDone, index, total), updatedAt: nowIso() }
            : a,
        ),
      }),
    removeApplication: (id) =>
      persist({ applications: get().applications.filter((a) => a.id !== id) }),
    restoreApplication: (app) => {
      const { applications, saved } = get()
      if (applications.some((a) => a.id === app.id)) return
      persist({
        applications: [...applications, app],
        saved: saved.includes(app.scholarshipId) ? saved : [...saved, app.scholarshipId],
      })
    },
    reload: () => set(read()),
  }
})
