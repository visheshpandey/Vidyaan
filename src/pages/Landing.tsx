import { useMemo } from 'react'
import { CalendarCheck, Compass, ListChecks, Route as RouteIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { HeroIllustration } from '@/components/ui/HeroIllustration'
import { ROUTES } from '@/constants/routes'
import { DEMO_PROFILE } from '@/data/demo'
import { loadDemoData } from '@/features/demo/demoMode'
import { evaluate } from '@/features/matching/engine'
import { StatusBadge } from '@/features/matching/StatusBadge'
import { ScholarshipBrief } from '@/features/scholarships/ScholarshipBrief'
import { useT } from '@/i18n/useT'
import { useScholarships } from '@/hooks/useScholarships'
import { useProfileStore } from '@/store/profileStore'
import type { Verdict } from '@/types/eligibility'

const PREVIEW_ID = 'demo-merit-engineering'

const STEPS = [
  {
    icon: Compass,
    title: 'Discover',
    text: 'Tell us about your education and family once. We check every scholarship for you.',
  },
  {
    icon: ListChecks,
    title: 'Understand',
    text: 'See Eligible, Needs information or Not eligible, with the exact reason for each.',
  },
  {
    icon: RouteIcon,
    title: 'Navigate',
    text: 'Follow a step-by-step guide for each application and keep the right documents ready.',
  },
  {
    icon: CalendarCheck,
    title: 'Track',
    text: 'See every application, note and deadline in one place and never miss a date.',
  },
]

const MEANINGS: Array<{ verdict: Verdict; text: string }> = [
  {
    verdict: 'eligible',
    text: 'You meet every rule we know about. Check the official page, then apply.',
  },
  {
    verdict: 'needs_info',
    text: 'A rule depends on something you skipped. We tell you exactly what to add.',
  },
  {
    verdict: 'not_eligible',
    text: 'A rule you have answered rules you out. We show which one and why.',
  },
]

export default function Landing() {
  const { scholarships } = useScholarships()
  const navigate = useNavigate()
  const t = useT()
  const onboarded = useProfileStore((s) => s.onboarded)
  const preview = useMemo(() => {
    const scholarship = scholarships.find((s) => s.id === PREVIEW_ID)
    return scholarship ? { scholarship, result: evaluate(DEMO_PROFILE, scholarship) } : null
  }, [scholarships])

  return (
    <div>
      <section className="relative overflow-hidden bg-sidebar text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-white/5" />
        <div
          aria-hidden
          className="absolute -bottom-32 right-1/3 size-80 rounded-full bg-white/5"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              {t('landing.headline')}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">{t('landing.intro')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={onboarded ? ROUTES.dashboard : ROUTES.onboarding}
                className={buttonClass(
                  'primary',
                  'md',
                  'bg-white! text-sidebar! hover:bg-white/90!',
                )}
              >
                {onboarded ? t('landing.open') : t('landing.start')}
              </Link>
              <Button
                variant="secondary"
                className="border-white/40! bg-transparent! text-white! hover:bg-white/10!"
                onClick={() => {
                  loadDemoData()
                  void navigate(ROUTES.dashboard)
                }}
              >
                {t('landing.demo')}
              </Button>
            </div>
            <p className="mt-3 text-sm text-white/75">{t('landing.privacy')}</p>
          </div>

          {preview && (
            <figure className="text-ink lg:max-w-sm lg:justify-self-end">
              <HeroIllustration className="mb-4 hidden h-auto w-full rounded-card md:block" />
              {/* A real card rendered for a sample student. Inert so the preview never changes saved data. */}
              <div inert aria-hidden="true">
                <ScholarshipBrief item={preview} as="h2" />
              </div>
              <figcaption className="mt-2 text-sm text-white/75">
                An example result for a sample student.
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <section aria-labelledby="steps">
          <h2 id="steps" className="sr-only">
            How it works
          </h2>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary/10 text-secondary"
                >
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-serif text-xl text-heading">{title}</p>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="meanings" className="mt-14 max-w-3xl">
          <h2 id="meanings" className="font-serif text-2xl text-heading">
            Every result comes with a reason
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {MEANINGS.map(({ verdict, text }) => (
              <li
                key={verdict}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="sm:w-48 sm:shrink-0">
                  <StatusBadge verdict={verdict} />
                </span>
                <p className="text-ink">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
