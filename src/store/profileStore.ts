import { create } from 'zustand'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { profileSchema } from '@/data/schemas'
import { loadJSON, saveJSON } from '@/services/storage'
import type { StudentProfile } from '@/types/profile'

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

export const useProfileStore = create<ProfileState>((set, get) => ({
  ...read(),
  setProfile: (profile, onboarded = true) => {
    saveJSON(STORAGE_KEYS.profile, profile)
    saveJSON(STORAGE_KEYS.onboarded, onboarded)
    set({ profile, onboarded })
  },
  updateProfile: (patch) => {
    const current = get().profile ?? { name: 'Student', preferences: [] }
    const profile = { ...current, ...patch }
    saveJSON(STORAGE_KEYS.profile, profile)
    set({ profile })
  },
  reload: () => set(read()),
}))
