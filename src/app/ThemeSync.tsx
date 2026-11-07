import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

/** Applies the chosen theme and language to the document root. Renders nothing. */
export function ThemeSync() {
  const theme = useSettingsStore((s) => s.theme)
  const language = useSettingsStore((s) => s.language)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = language
  }, [theme, language])
  return null
}
