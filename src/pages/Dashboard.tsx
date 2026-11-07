import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Award,
  Bookmark,
  CalendarClock,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/constants/routes'
import { profileCompleteness } from '@/features/dashboard/completeness'
import { ProfileRing } from '@/features/dashboard/ProfileRing'
import { buildDashboard } from '@/features/dashboard/selectors'
import { rank } from '@/features/matching/rank'
import { ScholarshipRow } from '@/features/scholarships/ScholarshipRow'
import { useMatches } from '@/hooks/useMatches'
import type { MessageKey } from '@/i18n/dictionary'
import { useT } from '@/i18n/useT'
import { useDocumentStore } from '@/store/documentStore'
import { useProfileStore } from '@/store/profileStore'
import { useTrackerStore } from '@/store/trackerStore'
import { formatDateTime } from '@/utils/date'

function greetingKey(hour: number): MessageKey {
  if (hour < 12) return 'dash.goodMorning'
  if (hour < 17) return 'dash.goodAfternoon'
  return 'dash.goodEvening'
}

function Metric({
  label,
  value,
  to,
  icon: Icon,
  note,
}: {
  label: string
  value: number
  to: string
  icon: LucideIcon
  note?: string
}) {
  return (
    <Link
      to={to}
      className="block rounded-card border border-line bg-surface p-4 hover:border-secondary"
    >
      <div className="flex items-start justify-between">
        <Icon size={18} aria-hidden className="text-secondary" />
        <ArrowRight size={14} aria-hidden className="text-muted" />
      </div>
      <p className="tabular mt-3 font-serif text-4xl text-heading">{value}</p>
      <p className="text-sm text-ink">{label}</p>
      {note && <p className="text-xs text-muted">{note}</p>}
    </Link>
  )
}

export default function Dashboard() {
  const profile = useProfileStore((s) => s.profile)
  const t = useT()
  const matches = useMatches()
  const saved = useTrackerStore((s) => s.saved)
  const applications = useTrackerStore((s) => s.applications)
  const documents = useDocumentStore((s) => s.documents)
  const [hour] = useState(() => new Date().getHours())
  const data = useMemo(
    () => buildDashboard({ matches, saved, applications, documents }),
    [matches, saved, applications, documents],
  )
  const top = useMemo(
    () => rank(matches.filter((m) => m.result.verdict !== 'not_eligible')).slice(0, 3),
    [matches],
  )
  const completeness = profileCompleteness(profile)
  const name = profile?.name

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-heading">
          {t(greetingKey(hour))}
          {name ? `, ${name}!` : '!'}
        </h1>
        <p className="mt-1 text-sm text-muted">{t('dash.subtitle')}</p>
      </div>

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          label={t('dash.matches')}
          value={data.eligibleCount}
          to={ROUTES.discover}
          icon={Award}
          note={
            data.needsInfoCount > 0
              ? `+${data.needsInfoCount} ${t('dash.needInfoShort')}`
              : undefined
          }
        />
        <Metric label={t('dash.saved')} value={data.savedCount} to={ROUTES.saved} icon={Bookmark} />
        <Metric
          label={t('dash.active')}
          value={data.activeCount}
          to={ROUTES.applications}
          icon={ClipboardList}
        />
        <Metric
          label={t('dash.deadlines')}
          value={data.deadlinesSoon.length}
          to={ROUTES.deadlines}
          icon={CalendarClock}
        />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section aria-labelledby="top">
          <div className="mb-3 flex items-end justify-between">
            <h2 id="top" className="font-serif text-2xl text-heading">
              {t('dash.best')}
            </h2>
            <Link to={ROUTES.discover} className="text-sm font-medium text-secondary underline">
              {t('dash.seeAll')}
            </Link>
          </div>
          <div className="space-y-3">
            {top.map((m) => (
              <ScholarshipRow key={m.scholarship.id} item={m} as="h3" />
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="next-steps">
            <h2 id="next-steps" className="mb-3 font-serif text-2xl text-heading">
              {t('dash.nextSteps')}
            </h2>
            <Card className="space-y-4">
              <ProfileRing
                percent={completeness.percent}
                label={t('dash.profileComplete')}
                hint={`${completeness.filled} of ${completeness.total} answers added`}
              />
              {data.nextSteps.length === 0 ? (
                <p className="text-sm text-muted">
                  You are all caught up. Browse Discover to find more.
                </p>
              ) : (
                <ul className="divide-y divide-line border-t border-line">
                  {data.nextSteps.map((s) => (
                    <li key={s.id}>
                      <Link
                        to={s.to}
                        className="flex min-h-11 items-center justify-between gap-3 py-2 text-sm hover:text-secondary"
                      >
                        {s.text}
                        <ArrowRight size={16} aria-hidden className="shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>

          <section aria-labelledby="activity">
            <h2 id="activity" className="mb-3 font-serif text-2xl text-heading">
              {t('dash.activity')}
            </h2>
            <Card>
              {data.activity.length === 0 ? (
                <p className="text-sm text-muted">Activity appears here once you start tracking.</p>
              ) : (
                <ul className="space-y-3">
                  {data.activity.map((a) => (
                    <li key={a.id} className="text-sm">
                      {a.text}
                      <time dateTime={a.at} className="block text-xs text-muted">
                        {formatDateTime(a.at)}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        </div>
      </div>
    </>
  )
}
