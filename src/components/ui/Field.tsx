import clsx from 'clsx'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

const CONTROL =
  'h-11 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted'

interface FieldShellProps {
  id?: string
  label: string
  hint?: string
  error?: string
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

function FieldShell({ id: explicitId, label, hint, error, children }: FieldShellProps) {
  const generatedId = useId()
  const id = explicitId ?? generatedId
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  const describedBy =
    [hint && !error ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

/** Labelled text input with an optional hint and an error linked for screen readers. */
export function TextField({ id, label, hint, error, className, ...rest }: InputProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      {({ id: controlId, describedBy, invalid }) => (
        <input
          id={controlId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={clsx(CONTROL, invalid && 'border-danger', className)}
          {...rest}
        />
      )}
    </FieldShell>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

/** Native select: best keyboard, screen reader and mobile behaviour. */
export function SelectField({
  id,
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      {({ id: controlId, describedBy, invalid }) => (
        <select
          id={controlId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={clsx(CONTROL, invalid && 'border-danger', className)}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}

/** Labelled checkbox with an optional hint. */
export function CheckboxField({
  label,
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string }) {
  const id = useId()
  return (
    <div className="flex min-h-11 items-center gap-3">
      <input id={id} type="checkbox" className="size-5 accent-secondary" {...rest} />
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
    </div>
  )
}
