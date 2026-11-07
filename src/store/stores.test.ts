import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { useDocumentStore } from './documentStore'
import { sanitizeProfile, useProfileStore } from './profileStore'
import { useTrackerStore } from './trackerStore'

describe('R3.2 R4.5 trackerStore', () => {
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

describe('R4.7 profileStore', () => {
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

describe('R6.2 sanitisation on write', () => {
  beforeEach(() => {
    localStorage.clear()
    useTrackerStore.getState().reload()
    useProfileStore.getState().reload()
    useDocumentStore.getState().reload()
  })

  it('cleans and caps application notes before storing them', () => {
    const app = useTrackerStore.getState().startTracking('a', [])
    useTrackerStore.getState().setNotes(app.id, 'call\u0000 them\u202E' + 'x'.repeat(5000))
    const stored = useTrackerStore.getState().applications[0]?.notes ?? ''
    expect(stored.startsWith('call them')).toBe(true)
    expect(stored.includes(String.fromCharCode(0))).toBe(false)
    expect(stored.includes(String.fromCharCode(0x202e))).toBe(false)
    expect(stored.length).toBeLessThanOrEqual(1000)
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEYS.applications) ?? '[]') as Array<{
      notes: string
    }>
    expect(persisted[0]?.notes).toBe(stored)
  })

  it('cleans, caps and de-duplicates document names', () => {
    useDocumentStore.getState().addDocument('  Caste \n certificate\u200B  ')
    useDocumentStore.getState().addDocument('caste certificate')
    useDocumentStore.getState().addDocument('   ')
    useDocumentStore.getState().addDocument('y'.repeat(300))
    const names = useDocumentStore.getState().documents.map((d) => d.name)
    expect(names[0]).toBe('Caste certificate')
    expect(names).toHaveLength(2)
    expect(names[1]).toHaveLength(60)
  })

  it('only keeps a real date as a document expiry', () => {
    useDocumentStore.getState().addDocument('Income certificate')
    const id = useDocumentStore.getState().documents[0]?.id ?? ''
    useDocumentStore.getState().setExpiry(id, '2027-01-31')
    expect(useDocumentStore.getState().documents[0]?.expiry).toBe('2027-01-31')
    useDocumentStore.getState().setExpiry(id, '<script>')
    expect(useDocumentStore.getState().documents[0]?.expiry).toBeUndefined()
  })

  it('cleans the profile name and forces numbers into range', () => {
    useProfileStore.getState().setProfile({
      name: '  Priya\u0000  Sharma ',
      annualFamilyIncome: 9e12,
      lastExamPercent: 140,
      academicYear: 99,
      preferences: ['Merit', ' ', 'x'.repeat(200)],
    })
    const p = useProfileStore.getState().profile
    expect(p?.name).toBe('Priya Sharma')
    expect(p?.annualFamilyIncome).toBe(100_000_000)
    expect(p?.lastExamPercent).toBe(100)
    expect(p?.academicYear).toBe(8)
    expect(p?.preferences).toEqual(['Merit', 'x'.repeat(60)])
  })

  it('keeps the old name when an edit would leave it empty', () => {
    useProfileStore.getState().setProfile({ name: 'Priya', preferences: [] })
    useProfileStore.getState().updateProfile({ name: '   ' })
    expect(useProfileStore.getState().profile?.name).toBe('Priya')
  })

  it('drops numbers that are not finite', () => {
    expect(
      sanitizeProfile({ name: 'A', preferences: [], annualFamilyIncome: Number.NaN })
        .annualFamilyIncome,
    ).toBeUndefined()
  })
})

describe('R3.1 trackerStore steps', () => {
  beforeEach(() => {
    localStorage.clear()
    useTrackerStore.getState().reload()
  })

  it('ticks a guide step, persists it and survives a reload', () => {
    const app = useTrackerStore.getState().startTracking('a', [])
    useTrackerStore.getState().toggleStep(app.id, 1, 3)
    useTrackerStore.getState().reload()
    expect(useTrackerStore.getState().applications[0]?.stepsDone).toEqual([1])
    useTrackerStore.getState().toggleStep(app.id, 1, 3)
    expect(useTrackerStore.getState().applications[0]?.stepsDone).toEqual([])
  })

  it('loads older saved applications that have no steps field', () => {
    const old = {
      id: 'app-x',
      scholarshipId: 'x',
      status: 'saved',
      notes: '',
      documentChecklist: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      history: [{ status: 'saved', at: '2026-01-01T00:00:00.000Z' }],
    }
    localStorage.setItem('grantly:v1:applications', JSON.stringify([old]))
    useTrackerStore.getState().reload()
    expect(useTrackerStore.getState().applications[0]?.stepsDone).toEqual([])
  })
})
