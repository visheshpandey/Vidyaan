const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** Formats a rupee amount for display, e.g. 250000 -> "₹2,50,000". */
export function formatRupees(value: number): string {
  return `₹${INR.format(value)}`
}

/** Compact lakh form used in plain-language messages, e.g. 240000 -> "₹2.4L". */
export function formatLakh(value: number): string {
  if (value < 100000) return formatRupees(value)
  return `₹${Number((value / 100000).toFixed(2))}L`
}

const PERIOD_LABELS = { 'one-time': 'one-time', yearly: 'per year', monthly: 'per month' } as const

/** Human label for how often an award is paid, e.g. "per year". */
export function periodLabel(period: keyof typeof PERIOD_LABELS): string {
  return PERIOD_LABELS[period]
}

const LEVEL_LABELS: Record<string, string> = {
  school: 'School',
  diploma: 'Diploma',
  ug: 'Undergraduate',
  pg: 'Postgraduate',
  phd: 'PhD',
}

/** Human label for an education level code. */
export function levelLabel(level: string): string {
  return LEVEL_LABELS[level] ?? level
}
