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
import { useDocumentStore } from '@/store/documentStore'
import { useProfileStore } from '@/store/profileStore'
import { useTrackerStore } from '@/store/trackerStore'
import { useUiStore } from '@/store/uiStore'
import type { Category, Gender, InstitutionType, Level, StudentProfile } from '@/types/profile'

const toOptions = (list: string[]) => list.map((v) => ({ value: v, label: v }))
const num = (v: string) => (v === '' ? undefined : Number(v))

export default function Profile() {
  const profile = useProfileStore((s) => s.profile) ?? { name: '', preferences: [] }
  const update = useProfileStore((s) => s.updateProfile)
  const { saved, applications } = useTrackerStore()
  const documents = useDocumentStore((s) => s.documents)
  const notify = useUiStore((s) => s.notify)
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState<'demo' | 'clear' | null>(null)
  const set = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) => update({ [k]: v })

  const titleOf = (id: string) => getScholarshipsSync().find((s) => s.id === id)?.title ?? id

  return (
    <>
      <PageHeader title="Profile" subtitle="Changes apply instantly. Your matches update as you edit." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <TextField label="Name" value={profile.name} onChange={(e) => set('name', e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Education level" placeholder="Not set" options={LEVEL_OPTIONS} value={profile.educationLevel ?? ''} onChange={(e) => set('educationLevel', (e.target.value || undefined) as Level | undefined)} />
            <SelectField label="Course" placeholder="Not set" options={toOptions(COURSES)} value={profile.course ?? ''} onChange={(e) => set('course', e.target.value || undefined)} />
            <SelectField label="State" placeholder="Not set" options={toOptions(STATES)} value={profile.state ?? ''} onChange={(e) => set('state', e.target.value || undefined)} />
            <SelectField label="Institution type" placeholder="Not set" options={INSTITUTION_OPTIONS} value={profile.institutionType ?? ''} onChange={(e) => set('institutionType', (e.target.value || undefined) as InstitutionType | undefined)} />
            <SelectField label="Gender" placeholder="Not set" options={GENDER_OPTIONS} value={profile.gender ?? ''} onChange={(e) => set('gender', (e.target.value || undefined) as Gender | undefined)} />
            <SelectField label="Category" placeholder="Not set" options={CATEGORY_OPTIONS} value={profile.category ?? ''} onChange={(e) => set('category', (e.target.value || undefined) as Category | undefined)} />
            <TextField label="Annual family income (₹)" type="number" inputMode="numeric" min={0} value={profile.annualFamilyIncome ?? ''} onChange={(e) => set('annualFamilyIncome', num(e.target.value))} />
            <TextField label="Last exam percentage" type="number" inputMode="decimal" min={0} max={100} value={profile.lastExamPercent ?? ''} onChange={(e) => set('lastExamPercent', num(e.target.value))} />
          </div>
          <CheckboxField label="I have a disability" checked={profile.disability ?? false} onChange={(e) => set('disability', e.target.checked)} />
          <CheckboxField label="I belong to a minority community" checked={profile.minority ?? false} onChange={(e) => set('minority', e.target.checked)} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-serif text-xl text-primary">Your data</h2>
            <p className="mt-1 text-sm text-muted">Stored only in this browser. Nothing is sent anywhere.</p>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  downloadText('vidyaan-data.json', JSON.stringify({ profile, saved, applications, documents }, null, 2), 'application/json')
                }
              >
                Export everything (JSON)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={applications.length === 0}
                onClick={() => downloadText('vidyaan-applications.csv', applicationsToCsv(applications, titleOf), 'text/csv')}
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
          loadDemoData()
          notify('Demo data loaded')
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
          resetAllData()
          notify('All data cleared', 'info')
          navigate(ROUTES.home)
        }}
      />
    </>
  )
}
