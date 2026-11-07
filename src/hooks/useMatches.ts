import { useMemo } from 'react'
import { evaluate } from '@/features/matching/engine'
import type { Matched } from '@/features/matching/rank'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useProfileStore } from '@/store/profileStore'
import type { StudentProfile } from '@/types/profile'

const EMPTY: StudentProfile = { name: '', preferences: [] }

/** Derived (never stored) eligibility results for every scholarship. */
export function useMatches(): Matched[] {
  const profile = useProfileStore((s) => s.profile)
  return useMemo(
    () =>
      getScholarshipsSync().map((scholarship) => ({
        scholarship,
        result: evaluate(profile ?? EMPTY, scholarship),
      })),
    [profile],
  )
}
