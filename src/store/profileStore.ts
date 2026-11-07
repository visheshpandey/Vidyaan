import { create } from 'zustand'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { LIMITS, profileSchema } from '@/data/schemas'
import { loadJSON, saveJSON } from '@/services/storage'
import type { StudentProfile } from '@/types/profile'
import { sanitizeText, TEXT_LIMITS } from '@/utils/sanitize'

interface ProfileState {
  profile: StudentProfile | null
  onboarded: boolean
  setProfile: (profile: StudentProfile, onboarded?: boolean) => void
  updateProfile: (patch: Partial<StudentProfile>) => void
  reload: () => void
}

const read = () => ({
  profile: loadJSON<StudentProfile | null>(STORAGE_KEYS.profile, profileSchema.nullable(), null),
  onboarded: loadJSON(STORAGE_KEYS.onboarded, z.boolean(), false),
})

/** Keeps a number inside [min, max]. Anything that is not a finite number becomes undefined. */
function clamp(value: number | undefined, min: number, max: number): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined
  return Math.min(max, Math.max(min, value))
}

/** Cleans optional free text; an empty result means "not answered". */
function cleanOptional(value: string | undefined, maxLength: number): string | undefined {
  if (value === undefined) return undefined
  const clean = sanitizeText(value, maxLength)
  return clean === '' ? undefined : clean
}

/**
 * Returns a copy of the profile that is safe to store: text is cleaned and capped, numbers are
 * forced into their allowed range, and the list of preferences is bounded. Nothing is stored unsanitised.
 */
export function sanitizeProfile(profile: StudentProfile): StudentProfile {
  const year = clamp(profile.academicYear, LIMITS.minYear, LIMITS.maxYear)
  return {
    ...profile,
    name: sanitizeText(profile.name, TEXT_LIMITS.name),
    course: cleanOptional(profile.course, 80),
    state: cleanOptional(profile.state, 60),
    academicYear: year === undefined ? undefined : Math.round(year),
    annualFamilyIncome: clamp(profile.annualFamilyIncome, 0, LIMITS.maxIncome),
    lastExamPercent: clamp(profile.lastExamPercent, 0, LIMITS.maxPercent),
    preferences: profile.preferences
      .map((p) => sanitizeText(p, 60))
      .filter((p) => p !== '')
      .slice(0, 20),
  }
}

/** Zustand store for the student profile, sanitised on write and persisted. */
export const useProfileStore = create<ProfileState>((set, get) => ({
  ...read(),
  setProfile: (input, onboarded = true) => {
    const profile = sanitizeProfile(input)
    saveJSON(STORAGE_KEYS.profile, profile)
    saveJSON(STORAGE_KEYS.onboarded, onboarded)
    set({ profile, onboarded })
  },
  updateProfile: (patch) => {
    const current = get().profile ?? { name: 'Student', preferences: [] }
    const merged = sanitizeProfile({ ...current, ...patch })
    // A name that cleans to nothing would make the stored profile invalid, so keep the old one.
    const profile = merged.name === '' ? { ...merged, name: current.name } : merged
    saveJSON(STORAGE_KEYS.profile, profile)
    set({ profile })
  },
  reload: () => set(read()),
}))
