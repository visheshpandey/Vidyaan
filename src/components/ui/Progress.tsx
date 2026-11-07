/** Accessible progress bar with a visible numeric label. */
export function Progress({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2 rounded-full bg-line"
      >
        <div
          className="h-2 rounded-full bg-secondary transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
