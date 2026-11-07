import { ClipboardCheck, ListChecks, SearchCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/constants/routes'
import { loadDemoData } from '@/features/demo/demoMode'
import { useT } from '@/i18n/useT'
import { useProfileStore } from '@/store/profileStore'

const FEATURES = [
  {
    icon: SearchCheck,
    title: 'Know where you stand',
    text: 'Every scholarship shows Eligible, Needs information or Not eligible, with the exact reasons.',
  },
  {
    icon: ListChecks,
    title: 'See what is missing',
    text: 'Skipped a question? We tell you what to add instead of guessing you do not qualify.',
  },
  {
    icon: ClipboardCheck,
    title: 'Follow through',
    text: 'Track each application from Saved to Disbursed, with documents and deadlines in one place.',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const t = useT()
  const onboarded = useProfileStore((s) => s.onboarded)
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
      <section className="max-w-2xl">
        <h1 className="font-serif text-4xl leading-tight text-heading sm:text-5xl">{t('tagline')}</h1>
        <p className="mt-4 text-lg text-muted">
          {t('landing.intro')}
        </p>
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
        <p className="mt-3 text-xs text-muted">{t('landing.privacy')}</p>
      </section>
      <section aria-label="What you get" className="mt-14 grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <Icon className="text-secondary" aria-hidden />
            <h2 className="mt-3 font-serif text-xl text-heading">{title}</h2>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </Card>
        ))}
      </section>
    </div>
  )
}
