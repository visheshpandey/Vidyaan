import { Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { TextField } from '@/components/ui/Field'
import { ROUTES } from '@/constants/routes'
import { LIMITS } from '@/data/schemas'
import type { StudentProfile } from '@/types/profile'
import type { Scholarship } from '@/types/scholarship'
import { parseNumber } from '@/utils/forms'
import { whatIf } from './whatIf'

/**
 * "What if?" simulator. Change family income or marks and see which scholarships would open up or
 * close, using the same eligibility engine as everywhere else. Nothing is saved.
 */
export function WhatIfPanel({
  profile,
  scholarships,
}: {
  profile: StudentProfile
  scholarships: Scholarship[]
}) {
  const [income, setIncome] = useState('')
  const [percent, setPercent] = useState('')

  const change = useMemo<Partial<StudentProfile>>(() => {
    const next: Partial<StudentProfile> = {}
    const i = parseNumber(income)
    const p = parseNumber(percent)
    if (i !== undefined && i >= 0 && i <= LIMITS.maxIncome) next.annualFamilyIncome = i
    if (p !== undefined && p >= 0 && p <= LIMITS.maxPercent) next.lastExamPercent = p
    return next
  }, [income, percent])

  const touched = Object.keys(change).length > 0
  const result = useMemo(
    () => whatIf(profile, scholarships, change),
    [profile, scholarships, change],
  )

  return (
    <Card>
      <h2 className="flex items-center gap-2 font-serif text-xl text-heading">
        <Sparkles size={18} aria-hidden className="text-secondary" /> What if?
      </h2>
      <p className="mt-1 text-sm text-muted">
        Try a different family income or exam percentage to see which scholarships would open up.
        This does not change your profile.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <TextField
          label="Family income (₹ per year)"
          type="number"
          inputMode="numeric"
          min={0}
          max={LIMITS.maxIncome}
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          hint={
            profile.annualFamilyIncome === undefined
              ? undefined
              : `Now: ₹${profile.annualFamilyIncome.toLocaleString('en-IN')}`
          }
        />
        <TextField
          label="Last exam percentage"
          type="number"
          inputMode="decimal"
          min={0}
          max={LIMITS.maxPercent}
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          hint={
            profile.lastExamPercent === undefined ? undefined : `Now: ${profile.lastExamPercent}%`
          }
        />
      </div>
      <div role="status" aria-live="polite" className="mt-3 text-sm">
        {!touched ? (
          <p className="text-muted">Enter a number above to try it.</p>
        ) : (
          <>
            <p className="font-medium text-ink">
              You would be eligible for {result.eligibleAfter} scholarship
              {result.eligibleAfter === 1 ? '' : 's'}.
            </p>
            {result.unlocked.length > 0 && (
              <>
                <p className="mt-2 text-success">Newly unlocked ({result.unlocked.length}):</p>
                <ul className="list-disc pl-5">
                  {result.unlocked.map((m) => (
                    <li key={m.scholarship.id}>
                      <Link className="underline" to={ROUTES.scholarship(m.scholarship.id)}>
                        {m.scholarship.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {result.lost.length > 0 && (
              <>
                <p className="mt-2 text-danger">No longer eligible ({result.lost.length}):</p>
                <ul className="list-disc pl-5">
                  {result.lost.map((m) => (
                    <li key={m.scholarship.id}>{m.scholarship.title}</li>
                  ))}
                </ul>
              </>
            )}
            {result.unlocked.length === 0 && result.lost.length === 0 && (
              <p className="mt-1 text-muted">No scholarship changes with these numbers.</p>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
