interface StepProgress {
  /** Steps ticked off. */
  done: number
  total: number
  /** Whole percentage, 0 when there are no steps. */
  percent: number
  /** Index of the first step not yet done, or null when everything is done. */
  nextIndex: number | null
}

/** Ticks or unticks one step. Out-of-range indexes are ignored. The result is sorted and unique. */
export function toggleStep(done: number[], index: number, total: number): number[] {
  if (!Number.isInteger(index) || index < 0 || index >= total) return done
  const next = done.includes(index) ? done.filter((i) => i !== index) : [...done, index]
  return [...new Set(next)].sort((a, b) => a - b)
}

/** How far through an application's guide the student is. Stale indexes (steps that no longer exist) are ignored. */
export function stepProgress(done: number[], total: number): StepProgress {
  const valid = new Set(done.filter((i) => Number.isInteger(i) && i >= 0 && i < total))
  let nextIndex: number | null = null
  for (let i = 0; i < total; i += 1) {
    if (!valid.has(i)) {
      nextIndex = i
      break
    }
  }
  return {
    done: valid.size,
    total,
    percent: total === 0 ? 0 : Math.round((valid.size / total) * 100),
    nextIndex,
  }
}
