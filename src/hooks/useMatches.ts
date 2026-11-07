import { useMemo } from 'react'
import { evaluate } from '@/features/matching/engine'
import type { Matched } from '@/features/matching/rank'
import { useScholarships } from '@/hooks/useScholarships'
import { useProfileStore } from '@/store/profileStore'
import type { StudentProfile } from '@/types/profile'

const EMPTY: StudentProfile = { name: '', preferences: [] }

/** Derived (never stored) eligibility results for every scholarship. */
export function useMatches(): Matched[] {
  const { scholarships } = useScholarships()
  const profile = useProfileStore((s) => s.profile)
  return useMemo(
    () =>
      scholarships.map((scholarship) => ({
        scholarship,
        result: evaluate(profile ?? EMPTY, scholarship),
      })),
    [profile, scholarships],
  )
}
