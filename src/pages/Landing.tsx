import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { ROUTES } from '@/constants/routes'
import { DEMO_PROFILE } from '@/data/demo'
import { loadDemoData } from '@/features/demo/demoMode'
import { evaluate } from '@/features/matching/engine'
import { StatusBadge } from '@/features/matching/StatusBadge'
import { ScholarshipBrief } from '@/features/scholarships/ScholarshipBrief'
import { useT } from '@/i18n/useT'
import { getScholarshipsSync } from '@/services/scholarshipService'
import { useProfileStore } from '@/store/profileStore'
import type { Verdict } from '@/types/eligibility'

const PREVIEW_ID = 'demo-merit-engineering'

const MEANINGS: Array<{ verdict: Verdict; text: string }> = [
  { verdict: 'eligible', text: 'You meet every rule we know about. Check the official page, then apply.' },
  { verdict: 'needs_info', text: 'A rule depends on something you skipped. We tell you exactly what to add.' },
  { verdict: 'not_eligible', text: 'A rule you have answered rules you out. We show which one and why.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const t = useT()
  const onboarded = useProfileStore((s) => s.onboarded)
  const preview = useMemo(() => {
    const scholarship = getScholarshipsSync().find((s) => s.id === PREVIEW_ID)
    return scholarship ? { scholarship, result: evaluate(DEMO_PROFILE, scholarship) } : null
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="font-serif text-4xl leading-tight text-heading sm:text-5xl">{t('tagline')}</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{t('landing.intro')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={onboarded ? ROUTES.dashboard : ROUTES.onboarding} className={buttonClass()}>
              {onboarded ? t('landing.open') : t('landing.start')}
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                loadDemoData()
                navigate(ROUTES.dashboard)
              }}
            >
              {t('landing.demo')}
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted">{t('landing.privacy')}</p>
        </div>

        {preview && (
          <figure className="lg:max-w-sm lg:justify-self-end">
            {/* A real card rendered for a sample student. Inert so the preview never changes saved data. */}
            <div inert aria-hidden="true">
              <ScholarshipBrief item={preview} as="h2" />
            </div>
            <figcaption className="mt-2 text-sm text-muted">An example result for a sample student.</figcaption>
          </figure>
        )}
      </section>

      <section aria-labelledby="meanings" className="mt-16 max-w-3xl">
        <h2 id="meanings" className="font-serif text-2xl text-heading">
          Every result comes with a reason
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {MEANINGS.map(({ verdict, text }) => (
            <li key={verdict} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-6">
              <span className="sm:w-48 sm:shrink-0">
                <StatusBadge verdict={verdict} />
              </span>
              <p className="text-ink">{text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-ink">
          After you choose a scholarship, track it from Saved to Disbursed, keep your documents ready and see every
          deadline in one place.
        </p>
      </section>
    </div>
  )
}
