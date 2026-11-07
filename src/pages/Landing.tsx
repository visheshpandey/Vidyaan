import { useMemo } from 'react'
import { CalendarCheck, Compass, ListChecks, Route as RouteIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { HeroIllustration } from '@/components/ui/HeroIllustration'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
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

const JOURNEY = [
  {
    name: 'discover',
    verb: 'Discover',
    heading: 'Find financial assistance that fits you',
    text: 'Answer a few questions once and we search every scholarship in our list for you.',
    alt: 'A magnifying glass over a list of scholarship cards.',
  },
  {
    name: 'understand',
    verb: 'Understand',
    heading: 'See why, in plain language',
    text: 'Each result names the rules you meet and the one you miss, so nothing is a mystery.',
    alt: 'A checklist with ticks for met rules and an alert for a missing one.',
  },
  {
    name: 'hero',
    verb: 'Navigate',
    heading: 'Follow each application step by step',
    text: 'A clear application process, with the right documents ready before you begin.',
    alt: 'Two students walking a path from a stack of books to a completed checklist.',
  },
  {
    name: 'track',
    verb: 'Track',
    heading: 'Keep deadlines, documents and progress in one place',
    text: 'A seamless digital journey from the first search to the final submission.',
    alt: 'A calendar with a highlighted deadline and a progress bar.',
  },
] as const

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

  const cta = (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        to={onboarded ? ROUTES.dashboard : ROUTES.onboarding}
        className={buttonClass('primary', 'md', 'bg-white! text-sidebar! hover:bg-white/90!')}
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
  )

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
            {cta}
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

        <section aria-labelledby="journey" className="mt-16">
          <h2 id="journey" className="font-serif text-3xl text-heading sm:text-4xl">
            {t('landing.journey')}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            GRANTLY brings educational financial assistance, eligibility checks and your
            applications together in one place.
          </p>
          <div className="mt-10 flex flex-col gap-12 md:gap-16">
            {JOURNEY.map(({ name, verb, heading, text, alt }, i) => (
              <article
                key={verb}
                className="grid items-center gap-6 sm:grid-cols-2 md:gap-10 lg:gap-16"
              >
                <ResponsiveImage
                  name={name}
                  width={640}
                  height={400}
                  alt={alt}
                  className="h-auto w-full rounded-card border border-line bg-surface"
                />
                <div className={i % 2 === 1 ? 'sm:order-first' : undefined}>
                  <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                    {verb}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-heading lg:text-3xl">{heading}</h3>
                  <p className="mt-3 max-w-md text-ink">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="meanings" className="mt-16 max-w-3xl">
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

      <section aria-labelledby="closing" className="bg-sidebar text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-8 sm:py-16 md:text-left">
          <h2 id="closing" className="font-serif text-3xl sm:text-4xl">
            {t('landing.cta')}
          </h2>
          <p className="mt-3 max-w-xl text-white/85 md:mx-0">{t('landing.privacy')}</p>
          <div className="flex justify-center md:justify-start">{cta}</div>
        </div>
      </section>
    </div>
  )
}
