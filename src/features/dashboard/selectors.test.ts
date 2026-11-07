import { describe, expect, it } from 'vitest'
import { buildDemoApplications, buildDemoDocuments, DEMO_PROFILE } from '@/data/demo'
import { evaluate } from '@/features/matching/engine'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { buildDashboard } from './selectors'

const matches = getScholarshipsSync().map((scholarship) => ({
  scholarship,
  result: evaluate(DEMO_PROFILE, scholarship),
}))

describe('R1.4 R4.6 buildDashboard', () => {
  const apps = buildDemoApplications()
  const data = buildDashboard({
    matches,
    saved: apps.map((a) => a.scholarshipId),
    applications: apps,
    documents: buildDemoDocuments(),
  })

  it('counts verdicts from real matches', () => {
    expect(data.eligibleCount).toBe(matches.filter((m) => m.result.verdict === 'eligible').length)
    expect(data.savedCount).toBe(apps.length)
  })

  it('counts only in-progress applications as active', () => {
    expect(data.activeCount).toBe(4)
  })

  it('flags the missing domicile certificate and expiring income certificate', () => {
    const text = data.nextSteps.map((s) => s.text).join(' | ')
    expect(text).toMatch(/Domicile certificate/)
    expect(text).toMatch(/Income certificate expires/)
  })

  it('is empty-safe', () => {
    const empty = buildDashboard({ matches: [], saved: [], applications: [], documents: [] })
    expect(empty.nextSteps).toEqual([])
    expect(empty.activity).toEqual([])
  })
})
