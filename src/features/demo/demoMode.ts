import { STORAGE_KEYS } from '@/constants/storage-keys'
import { buildDemoApplications, buildDemoDocuments, DEMO_PROFILE } from '@/data/demo'
import { clearAllData, saveJSON } from '@/services/storage'
import { useDocumentStore } from '@/store/documentStore'
import { useProfileStore } from '@/store/profileStore'
import { useTrackerStore } from '@/store/trackerStore'

function reloadStores() {
  useProfileStore.getState().reload()
  useTrackerStore.getState().reload()
  useDocumentStore.getState().reload()
}

/** Replaces local data with the Priya demo persona (profile, applications, documents). */
export function loadDemoData() {
  const applications = buildDemoApplications()
  saveJSON(STORAGE_KEYS.profile, DEMO_PROFILE)
  saveJSON(STORAGE_KEYS.onboarded, true)
  saveJSON(STORAGE_KEYS.applications, applications)
  saveJSON(STORAGE_KEYS.saved, applications.map((a) => a.scholarshipId))
  saveJSON(STORAGE_KEYS.documents, buildDemoDocuments())
  reloadStores()
}

/** Removes everything this app stored in the browser. */
export function resetAllData() {
  clearAllData()
  reloadStores()
}
