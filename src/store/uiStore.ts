import { create } from 'zustand'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface Toast {
  id: number
  message: string
  tone: 'success' | 'info' | 'error'
  action?: ToastAction
}

interface UiState {
  toasts: Toast[]
  notify: (
    message: string,
    tone?: Toast['tone'],
    action?: ToastAction,
    durationMs?: number,
  ) => void
  dismiss: (id: number) => void
}

let nextId = 1

/** Zustand store for transient UI state such as toasts. */
export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  notify: (message, tone = 'success', action, durationMs = 4000) => {
    const id = nextId++
    set({ toasts: [...get().toasts, { id, message, tone, action }] })
    setTimeout(() => get().dismiss(id), durationMs)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))
