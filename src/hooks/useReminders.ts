import { useEffect } from 'react'
import { collectEvents } from '@/features/deadlines/events'
import { dueReminders, reminderSummary } from '@/features/deadlines/reminders'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useDocumentStore } from '@/store/documentStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useTrackerStore } from '@/store/trackerStore'

/** Shows at most one browser notification per day, only if the student opted in and allowed it. */
export function useReminders() {
  const enabled = useSettingsStore((s) => s.remindersEnabled)
  const lastNotifiedOn = useSettingsStore((s) => s.lastNotifiedOn)
  const update = useSettingsStore((s) => s.update)
  const saved = useTrackerStore((s) => s.saved)
  const applications = useTrackerStore((s) => s.applications)
  const documents = useDocumentStore((s) => s.documents)

  useEffect(() => {
    if (!enabled || typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const today = new Date().toISOString().slice(0, 10)
    if (lastNotifiedOn === today) return
    const due = dueReminders(collectEvents(getScholarshipsSync(), saved, applications, documents))
    if (due.length === 0) return
    new Notification('Vidyaan reminder', { body: reminderSummary(due) })
    update({ lastNotifiedOn: today })
  }, [enabled, lastNotifiedOn, saved, applications, documents, update])
}
