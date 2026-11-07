import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckboxField, SelectField, TextField } from '@/components/ui/Field'
import { Progress } from '@/components/ui/Progress'
import {
  CATEGORY_OPTIONS,
  COURSES,
  GENDER_OPTIONS,
  INSTITUTION_OPTIONS,
  LEVEL_OPTIONS,
  PREFERENCES,
  STATES,
} from '@/constants/options'
import { ROUTES } from '@/constants/routes'
import { validateStep, type Errors } from '@/features/onboarding/validate'
import { LIMITS } from '@/data/schemas'
import { parseNumber, toOptions } from '@/utils/forms'
import { TEXT_LIMITS } from '@/utils/sanitize'
import { useProfileStore } from '@/store/profileStore'
import { useUiStore } from '@/store/uiStore'
import type { Category, Gender, InstitutionType, Level, StudentProfile } from '@/types/profile'

const STEPS = ['About you', 'Education', 'Eligibility details', 'Review']

export default function Onboarding() {
  const existing = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const notify = useUiStore((s) => s.notify)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [p, setP] = useState<StudentProfile>(existing ?? { name: '', preferences: [] })
  const [errors, setErrors] = useState<Errors>({})

  const set = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    setP((prev) => ({ ...prev, [key]: value }))

  const next = () => {
    const found = validateStep(step, p)
    setErrors(found)
    if (Object.keys(found).length === 0) setStep(step + 1)
  }

  const finish = () => {
    setProfile(p)
    notify('Profile saved. Here are your matches.')
    void navigate(ROUTES.dashboard)
  }

  const togglePref = (pref: string) =>
    set(
      'preferences',
      p.preferences.includes(pref)
        ? p.preferences.filter((x) => x !== pref)
        : [...p.preferences, pref],
    )

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-serif text-3xl text-heading">Let us find your fit</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Answer what you can. Anything you skip is marked &quot;needs information&quot;, never
        &quot;not eligible&quot;.
      </p>
      <Progress
        value={((step + 1) / STEPS.length) * 100}
        label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}
      />
      <Card className="mt-4 space-y-4">
        {step === 0 && (
          <>
            <TextField
              label="Your name"
              value={p.name}
              error={errors.name}
              onChange={(e) => set('name', e.target.value)}
              autoComplete="given-name"
              maxLength={TEXT_LIMITS.name}
            />
            <SelectField
              label="Gender"
              hint="Optional. Some scholarships are for women only."
              placeholder="Prefer not to say"
              options={GENDER_OPTIONS}
              value={p.gender ?? ''}
              onChange={(e) => set('gender', (e.target.value || undefined) as Gender | undefined)}
            />
            <SelectField
              label="State of domicile"
              placeholder="Select a state"
              options={toOptions(STATES)}
              value={p.state ?? ''}
              onChange={(e) => set('state', e.target.value || undefined)}
            />
          </>
        )}
        {step === 1 && (
          <>
            <SelectField
              label="Education level"
              placeholder="Select a level"
              options={LEVEL_OPTIONS}
              value={p.educationLevel ?? ''}
              onChange={(e) =>
                set('educationLevel', (e.target.value || undefined) as Level | undefined)
              }
            />
            <SelectField
              label="Course"
              placeholder="Select a course"
              options={toOptions(COURSES)}
              value={p.course ?? ''}
              onChange={(e) => set('course', e.target.value || undefined)}
            />
            <TextField
              label="Current year of study"
              type="number"
              inputMode="numeric"
              min={LIMITS.minYear}
              max={LIMITS.maxYear}
              step={1}
              value={p.academicYear ?? ''}
              error={errors.academicYear}
              onChange={(e) => set('academicYear', parseNumber(e.target.value))}
            />
            <SelectField
              label="Institution type"
              placeholder="Select a type"
              options={INSTITUTION_OPTIONS}
              value={p.institutionType ?? ''}
              onChange={(e) =>
                set('institutionType', (e.target.value || undefined) as InstitutionType | undefined)
              }
            />
          </>
        )}
        {step === 2 && (
          <>
            <SelectField
              label="Category"
              placeholder="Select a category"
              options={CATEGORY_OPTIONS}
              value={p.category ?? ''}
              onChange={(e) =>
                set('category', (e.target.value || undefined) as Category | undefined)
              }
            />
            <TextField
              label="Annual family income (₹)"
              type="number"
              inputMode="numeric"
              hint="Used only on this device to check income limits."
              min={0}
              max={LIMITS.maxIncome}
              value={p.annualFamilyIncome ?? ''}
              error={errors.annualFamilyIncome}
              onChange={(e) => set('annualFamilyIncome', parseNumber(e.target.value))}
            />
            <TextField
              label="Last exam percentage"
              type="number"
              inputMode="decimal"
              min={0}
              max={LIMITS.maxPercent}
              step="any"
              value={p.lastExamPercent ?? ''}
              error={errors.lastExamPercent}
              onChange={(e) => set('lastExamPercent', parseNumber(e.target.value))}
            />
            <CheckboxField
              label="I have a disability"
              checked={p.disability ?? false}
              onChange={(e) => set('disability', e.target.checked)}
            />
            <CheckboxField
              label="I belong to a minority community"
              checked={p.minority ?? false}
              onChange={(e) => set('minority', e.target.checked)}
            />
            <fieldset>
              <legend className="mb-1 text-sm font-medium">
                What are you looking for? (optional)
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {PREFERENCES.map((pref) => (
                  <CheckboxField
                    key={pref}
                    label={pref}
                    checked={p.preferences.includes(pref)}
                    onChange={() => togglePref(pref)}
                  />
                ))}
              </div>
            </fieldset>
          </>
        )}
        {step === 3 && <Review p={p} />}
        <div className="flex justify-between pt-2">
          <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Continue</Button>
          ) : (
            <Button onClick={finish}>Show my matches</Button>
          )}
        </div>
      </Card>
    </div>
  )
}

function Review({ p }: { p: StudentProfile }) {
  const rows: Array<[string, string | undefined]> = [
    ['Name', p.name],
    ['State', p.state],
    ['Level', p.educationLevel],
    ['Course', p.course],
    ['Category', p.category],
    [
      'Family income',
      p.annualFamilyIncome === undefined
        ? undefined
        : `₹${p.annualFamilyIncome.toLocaleString('en-IN')}`,
    ],
    ['Last exam', p.lastExamPercent === undefined ? undefined : `${p.lastExamPercent}%`],
  ]
  return (
    <dl className="divide-y divide-line text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between py-2">
          <dt className="text-muted">{k}</dt>
          <dd className={v ? 'font-medium' : 'text-warning'}>{v ?? 'Not provided'}</dd>
        </div>
      ))}
    </dl>
  )
}
