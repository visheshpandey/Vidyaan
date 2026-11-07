import { create } from 'zustand'
import { DEFAULT_SETTINGS, settingsSchema, type Settings } from '@/data/schemas'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { loadJSON, saveJSON } from '@/services/storage'

interface SettingsState extends Settings {
  update: (patch: Partial<Settings>) => void
  reload: () => void
}

const read = (): Settings => loadJSON(STORAGE_KEYS.settings, settingsSchema, DEFAULT_SETTINGS)

const pick = (s: SettingsState): Settings => ({
  remindersEnabled: s.remindersEnabled,
  theme: s.theme,
  language: s.language,
  lastNotifiedOn: s.lastNotifiedOn,
})

/** Zustand store for theme, language and reminder settings. */
export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...read(),
  update: (patch) => {
    set(patch)
    saveJSON(STORAGE_KEYS.settings, pick(get()))
  },
  reload: () => set(read()),
}))
