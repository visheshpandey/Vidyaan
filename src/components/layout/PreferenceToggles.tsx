import { Moon, Sun } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import type { Language } from '@/i18n/dictionary'

/** Language and theme switches shown in every header. */
export function PreferenceToggles() {
  const theme = useSettingsStore((s) => s.theme)
  const language = useSettingsStore((s) => s.language)
  const update = useSettingsStore((s) => s.update)
  const dark = theme === 'dark'
  return (
    <div className="no-print flex items-center gap-1">
      <label className="sr-only" htmlFor="lang">
        Language
      </label>
      <select
        id="lang"
        value={language}
        onChange={(e) => update({ language: e.target.value as Language })}
        className="h-10 rounded-control border border-line bg-surface px-2 text-sm text-ink"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
      <button
        aria-pressed={dark}
        aria-label="Dark mode"
        onClick={() => update({ theme: dark ? 'light' : 'dark' })}
        className="grid size-10 place-items-center rounded-control border border-line bg-surface text-ink hover:bg-canvas"
      >
        {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
      </button>
    </div>
  )
}
