import { X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'

/** Polite live region: every toast is announced to screen readers. */
export function Toaster() {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismiss)
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex max-w-md items-center gap-3 rounded-control bg-primary px-4 py-3 text-sm text-white shadow-lg"
        >
          <span>{t.message}</span>
          <button
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
            className="grid size-10 place-items-center rounded hover:bg-white/10"
          >
            <X size={14} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  )
}
