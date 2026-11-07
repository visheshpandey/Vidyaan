import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { useProfileStore } from './profileStore'
import { useTrackerStore } from './trackerStore'

describe('trackerStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useTrackerStore.getState().reload()
  })

  it('saves and unsaves, persisting each change', () => {
    expect(useTrackerStore.getState().toggleSaved('a')).toBe(true)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.saved) ?? '[]')).toEqual(['a'])
    expect(useTrackerStore.getState().toggleSaved('a')).toBe(false)
    expect(useTrackerStore.getState().saved).toEqual([])
  })

  it('start tracking creates one Saved application and is idempotent', () => {
    useTrackerStore.getState().startTracking('a', ['Marksheet'])
    useTrackerStore.getState().startTracking('a', ['Marksheet'])
    const { applications, saved } = useTrackerStore.getState()
    expect(applications).toHaveLength(1)
    expect(applications[0]?.status).toBe('saved')
    expect(saved).toContain('a')
  })

  it('changes status and survives a reload', () => {
    const app = useTrackerStore.getState().startTracking('a', [])
    useTrackerStore.getState().setStatus(app.id, 'submitted')
    useTrackerStore.getState().reload()
    expect(useTrackerStore.getState().applications[0]?.status).toBe('submitted')
  })
})

describe('profileStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useProfileStore.getState().reload()
  })

  it('starts empty and not onboarded', () => {
    expect(useProfileStore.getState().profile).toBeNull()
    expect(useProfileStore.getState().onboarded).toBe(false)
  })

  it('persists profile and recovers from corrupt data', () => {
    useProfileStore.getState().setProfile({ name: 'Priya', preferences: [] })
    useProfileStore.getState().reload()
    expect(useProfileStore.getState().profile?.name).toBe('Priya')
    localStorage.setItem(STORAGE_KEYS.profile, '{bad')
    useProfileStore.getState().reload()
    expect(useProfileStore.getState().profile).toBeNull()
  })
})
