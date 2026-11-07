import { useSettingsStore } from '@/store/settingsStore'
import { translate, type MessageKey } from './dictionary'

/** Returns a `t(key)` function bound to the chosen language. */
export function useT() {
  const language = useSettingsStore((s) => s.language)
  return (key: MessageKey) => translate(language, key)
}
