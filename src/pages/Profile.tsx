import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckboxField, SelectField, TextField } from '@/components/ui/Field'
import { ConfirmDialog } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  CATEGORY_OPTIONS,
  COURSES,
  GENDER_OPTIONS,
  INSTITUTION_OPTIONS,
  LEVEL_OPTIONS,
  STATES,
} from '@/constants/options'
import { ROUTES } from '@/constants/routes'
import { loadDemoData, resetAllData } from '@/features/demo/demoMode'
import { applicationsToCsv, downloadText } from '@/services/exportService'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useT } from '@/i18n/useT'
import { useSettingsStore } from '@/store/settingsStore'
import { useDocumentStore } from '@/store/documentStore'
import { useProfileStore } from '@/store/profileStore'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import type { Category, Gender, InstitutionType, Level, StudentProfile } from '@/types/profile'
import { LIMITS } from '@/data/schemas'
import { parseNumber, toOptions } from '@/utils/forms'
import { sanitizeText, TEXT_LIMITS } from '@/utils/sanitize'

/** Runs a download and tells the student whether it worked. */
function runDownload(
  notify: (message: string, tone?: 'success' | 'info' | 'error') => void,
  filename: string,
  content: string,
  type: string,
): void {
  const ok = downloadText(filename, content, type)
  notify(
    ok ? 'File downloaded' : 'Could not download the file. Please try again.',
    ok ? 'success' : 'error',
  )
}

/**
 * Name input that keeps its own draft while typing and saves the cleaned value when the field loses focus.
 * Cleaning on every keystroke would stop people typing spaces between words.
 */
function NameField({ value, onCommit }: { value: string; onCommit: (name: string) => void }) {
  const [draft, setDraft] = useState(value)
  return (
    <TextField
      label="Name"
      value={draft}
      maxLength={TEXT_LIMITS.name}
      autoComplete="name"
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const clean = sanitizeText(draft, TEXT_LIMITS.name)
        if (clean === '') {
          setDraft(value)
        } else {
          setDraft(clean)
          onCommit(clean)
        }
      }}
    />
  )
}

export default function Profile() {
  const profile = useProfileStore((s) => s.profile) ?? { name: '', preferences: [] }
  const update = useProfileStore((s) => s.updateProfile)
  const { saved, applications } = useTrackerStore()
  const documents = useDocumentStore((s) => s.documents)
  const notify = useUiStore((s) => s.notify)
  const navigate = useNavigate()
  const t = useT()
  const settings = useSettingsStore()
  const [confirm, setConfirm] = useState<'demo' | 'clear' | null>(null)
  const set = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) => update({ [k]: v })

  const titleOf = (id: string) => getScholarshipsSync().find((s) => s.id === id)?.title ?? id

  /** Asks the browser for notification permission. Failure is explained, never thrown. */
  const askForNotifications = async () => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') return
    try {
      const result = await Notification.requestPermission()
      notify(
        result === 'granted'
          ? 'Reminders on'
          : 'Browser notifications are blocked. You will still see deadlines in the app.',
        'info',
      )
    } catch {
      notify(
        'Your browser could not turn on reminders. You will still see deadlines in the app.',
        'info',
      )
    }
  }

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Changes apply instantly. Your matches update as you edit."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <NameField
            key={profile.name}
            value={profile.name}
            onCommit={(name) => set('name', name)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Education level"
              placeholder="Not set"
              options={LEVEL_OPTIONS}
              value={profile.educationLevel ?? ''}
              onChange={(e) =>
                set('educationLevel', (e.target.value || undefined) as Level | undefined)
              }
            />
            <SelectField
              label="Course"
              placeholder="Not set"
              options={toOptions(COURSES)}
              value={profile.course ?? ''}
              onChange={(e) => set('course', e.target.value || undefined)}
            />
            <SelectField
              label="State"
              placeholder="Not set"
              options={toOptions(STATES)}
              value={profile.state ?? ''}
              onChange={(e) => set('state', e.target.value || undefined)}
            />
            <SelectField
              label="Institution type"
              placeholder="Not set"
              options={INSTITUTION_OPTIONS}
              value={profile.institutionType ?? ''}
              onChange={(e) =>
                set('institutionType', (e.target.value || undefined) as InstitutionType | undefined)
              }
            />
            <SelectField
              label="Gender"
              placeholder="Not set"
              options={GENDER_OPTIONS}
              value={profile.gender ?? ''}
              onChange={(e) => set('gender', (e.target.value || undefined) as Gender | undefined)}
            />
            <SelectField
              label="Category"
              placeholder="Not set"
              options={CATEGORY_OPTIONS}
              value={profile.category ?? ''}
              onChange={(e) =>
                set('category', (e.target.value || undefined) as Category | undefined)
              }
            />
            <TextField
              label="Annual family income (₹)"
              type="number"
              inputMode="numeric"
              min={0}
              max={LIMITS.maxIncome}
              value={profile.annualFamilyIncome ?? ''}
              onChange={(e) => set('annualFamilyIncome', parseNumber(e.target.value))}
            />
            <TextField
              label="Last exam percentage"
              type="number"
              inputMode="decimal"
              min={0}
              max={LIMITS.maxPercent}
              step="any"
              value={profile.lastExamPercent ?? ''}
              onChange={(e) => set('lastExamPercent', parseNumber(e.target.value))}
            />
          </div>
          <CheckboxField
            label="I have a disability"
            checked={profile.disability ?? false}
            onChange={(e) => set('disability', e.target.checked)}
          />
          <CheckboxField
            label="I belong to a minority community"
            checked={profile.minority ?? false}
            onChange={(e) => set('minority', e.target.checked)}
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-serif text-xl text-heading">Preferences</h2>
            <CheckboxField
              label={t('profile.theme')}
              checked={settings.theme === 'dark'}
              onChange={(e) => settings.update({ theme: e.target.checked ? 'dark' : 'light' })}
            />
            <CheckboxField
              label={t('profile.reminders')}
              checked={settings.remindersEnabled}
              onChange={(e) => {
                settings.update({ remindersEnabled: e.target.checked })
                if (e.target.checked) void askForNotifications()
              }}
            />
          </Card>
          <Card>
            <h2 className="font-serif text-xl text-heading">Your data</h2>
            <p className="mt-1 text-sm text-muted">
              Stored only in this browser. Nothing is sent anywhere.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  runDownload(
                    notify,
                    'vidyaan-data.json',
                    JSON.stringify({ profile, saved, applications, documents }, null, 2),
                    'application/json',
                  )
                }
              >
                Export everything (JSON)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={applications.length === 0}
                onClick={() =>
                  runDownload(
                    notify,
                    'vidyaan-applications.csv',
                    applicationsToCsv(applications, titleOf),
                    'text/csv',
                  )
                }
              >
                Export applications (CSV)
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirm('demo')}>
                Load demo data
              </Button>
              <Button variant="danger" size="sm" onClick={() => setConfirm('clear')}>
                Clear all my data
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === 'demo'}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Load demo data?"
        description="This replaces your profile, saved list, applications and documents with the sample student, Priya."
        confirmLabel="Load demo"
        onConfirm={() => {
          if (loadDemoData()) notify('Demo data loaded')
          else notify('Could not load the demo data. Please try again.', 'error')
        }}
      />
      <ConfirmDialog
        open={confirm === 'clear'}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Clear all your data?"
        description="This deletes your profile, saved scholarships, applications, notes and documents from this browser. It cannot be undone."
        confirmLabel="Clear everything"
        danger
        onConfirm={() => {
          if (!resetAllData()) {
            notify('Could not clear your data. Please try again.', 'error')
            return
          }
          notify('All data cleared', 'info')
          void navigate(ROUTES.home)
        }}
      />
    </>
  )
}
