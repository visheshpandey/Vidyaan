import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonStyles'
import { ROUTES } from '@/constants/routes'
import { loadDemoData } from '@/features/demo/demoMode'
import { useProfileStore } from '@/store/profileStore'

/**
 * Shown above every signed-in page until the student adds their details. The site opens straight to
 * the scholarship list; this strip explains that results are not personal yet and offers the two ways
 * to fix that.
 */
export function ProfilePrompt() {
  const onboarded = useProfileStore((s) => s.onboarded)
  if (onboarded) return null
  return (
    <section
      aria-label="Personalise your results"
      className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-line bg-secondary/10 px-4 py-3 text-sm sm:px-8"
    >
      <p className="max-w-3xl text-ink">
        You are browsing without a profile, so every result says <strong>Needs information</strong>.
        Add a few details to see which scholarships you qualify for.
      </p>
      <div className="flex gap-2">
        <Link to={ROUTES.onboarding} className={buttonClass('primary', 'sm')}>
          Add my details
        </Link>
        <Button variant="secondary" size="sm" onClick={() => void loadDemoData()}>
          Try the demo
        </Button>
      </div>
    </section>
  )
}
