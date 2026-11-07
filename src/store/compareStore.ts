import { create } from 'zustand'

export const MAX_COMPARE = 3

interface CompareState {
  ids: string[]
  /** Returns false when the list is full and the id was not added. */
  toggle: (id: string) => boolean
  clear: () => void
}

/** Selection for the Compare page. Session-only on purpose: it is a scratchpad, not user data. */
export const useCompareStore = create<CompareState>((set, get) => ({
  ids: [],
  toggle: (id) => {
    const { ids } = get()
    if (ids.includes(id)) {
      set({ ids: ids.filter((x) => x !== id) })
      return true
    }
    if (ids.length >= MAX_COMPARE) return false
    set({ ids: [...ids, id] })
    return true
  },
  clear: () => set({ ids: [] }),
}))
