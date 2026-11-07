import { ListChecks } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import { useTrackerStore } from '@/store/trackerStore'
import { stepProgress } from './steps'

/** One shared empty list: a selector that returns a new `[]` each time makes the store re-render forever. */
const NO_STEPS_DONE: number[] = []

/**
 * The application guide as a checklist: tick each step as you finish it. Progress is saved with the
 * application and the next step is highlighted so the student always knows what to do now.
 */
export function StepChecklist({
  applicationId,
  steps,
}: {
  applicationId: string
  steps: string[]
}) {
  const done = useTrackerStore(
    (s) => s.applications.find((a) => a.id === applicationId)?.stepsDone ?? NO_STEPS_DONE,
  )
  const toggleStep = useTrackerStore((s) => s.toggleStep)
  const progress = stepProgress(done, steps.length)

  if (steps.length === 0) {
    return (
      <p className="text-sm text-muted">
        This scholarship has no guide steps yet. Check the official site.
      </p>
    )
  }

  return (
    <div>
      <Progress
        value={progress.percent}
        label={`${progress.done} of ${progress.total} steps done`}
      />
      {progress.nextIndex !== null ? (
        <p className="mt-2 flex items-start gap-2 text-sm text-ink">
          <ListChecks size={16} aria-hidden className="mt-0.5 shrink-0 text-secondary" />
          <span>
            <span className="font-medium">Next step:</span> {steps[progress.nextIndex]}
          </span>
        </p>
      ) : (
        <p className="mt-2 text-sm font-medium text-success">
          Every step is done. Check the official site for your result.
        </p>
      )}
      <ol className="mt-3 space-y-1">
        {steps.map((step, index) => {
          const id = `step-${applicationId}-${index}`
          return (
            <li key={id} className="flex min-h-11 items-start gap-3">
              <input
                id={id}
                type="checkbox"
                checked={done.includes(index)}
                onChange={() => toggleStep(applicationId, index, steps.length)}
                className="mt-1 size-5 shrink-0 accent-secondary"
              />
              <label htmlFor={id} className="pt-0.5 text-sm text-ink">
                <span className="text-muted">Step {index + 1}.</span> {step}
              </label>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
