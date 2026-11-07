import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

/** Circular completeness meter. Percentage is also shown as text so it never relies on the graphic. */
export function ProfileRing({
  percent,
  label,
  hint,
}: {
  percent: number
  label: string
  hint: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        role="img"
        aria-label={`${label}: ${percent}%`}
        className="grid size-24 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--color-secondary) ${percent * 3.6}deg, var(--color-line) 0)`,
        }}
      >
        <div className="grid size-[74px] place-items-center rounded-full bg-surface text-center">
          <span className="tabular font-serif text-2xl leading-none text-heading">{percent}%</span>
        </div>
      </div>
      <div className="text-sm">
        <p className="font-medium text-ink">{label}</p>
        <p className="text-muted">{hint}</p>
        {percent < 100 && (
          <Link
            to={ROUTES.profile}
            className="mt-1 inline-block font-medium text-secondary underline"
          >
            Complete profile
          </Link>
        )}
      </div>
    </div>
  )
}
