const PREFIX = 'grantly:v1'

export const STORAGE_KEYS = {
  profile: `${PREFIX}:profile`,
  saved: `${PREFIX}:saved`,
  applications: `${PREFIX}:applications`,
  documents: `${PREFIX}:documents`,
  settings: `${PREFIX}:settings`,
  onboarded: `${PREFIX}:onboarded`,
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
