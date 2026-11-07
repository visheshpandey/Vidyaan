import * as Menu from '@radix-ui/react-dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import { APPLICATION_STATUSES, type Application } from '@/types/tracker'
import { STATUS_LABELS } from './transitions'

/** Keyboard-accessible "Move to" menu: the primary way to change status. */
export function StatusMenu({ app, title }: { app: Application; title: string }) {
  const setStatus = useTrackerStore((s) => s.setStatus)
  const notify = useUiStore((s) => s.notify)
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="secondary" size="sm" aria-label={`Move ${title} to another status`}>
          Move to <ChevronDown size={14} aria-hidden />
        </Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="end"
          className="z-50 min-w-48 rounded-card border border-line bg-surface p-1 shadow-lg"
        >
          {APPLICATION_STATUSES.map((status) => (
            <Menu.Item
              key={status}
              onSelect={() => {
                if (status === app.status) return
                setStatus(app.id, status)
                notify(`${title} moved to ${STATUS_LABELS[status]}`)
              }}
              className="flex h-10 cursor-pointer items-center justify-between gap-3 rounded-control px-3 text-sm outline-none data-[highlighted]:bg-canvas"
            >
              {STATUS_LABELS[status]}
              {status === app.status && <Check size={16} aria-label="Current status" />}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
