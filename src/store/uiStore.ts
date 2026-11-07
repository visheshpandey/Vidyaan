import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  tone: 'success' | 'info' | 'error'
}

interface UiState {
  toasts: Toast[]
  notify: (message: string, tone?: Toast['tone']) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  notify: (message, tone = 'success') => {
    const id = nextId++
    set({ toasts: [...get().toasts, { id, message, tone }] })
    setTimeout(() => get().dismiss(id), 4000)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))
