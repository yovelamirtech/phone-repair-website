import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

const inputClass = (invalid: boolean) =>
  `min-h-12 w-full rounded-2xl border bg-bg px-4 py-3 text-base text-ink placeholder:text-muted transition-colors ${
    invalid ? 'border-danger' : 'border-line hover:border-muted focus:border-accent'
  }`;

type FieldShellProps = { id: string; label: ReactNode; hint?: ReactNode; error?: string; optional?: string; children: ReactNode };

function FieldShell({ id, label, hint, error, optional, children }: FieldShellProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-medium">
        {label}
        {optional && <span className="ms-1.5 text-sm font-normal text-muted">({optional})</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {/* live region so screen readers announce the error when it appears */}
      <p id={`${id}-error`} className="min-h-0 text-sm font-medium text-danger-ink" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; hint?: ReactNode; error?: string; optional?: string };

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, optional, id: idProp, className = '', ...rest },
  ref,
) {
  const auto = useId();
  const id = idProp ?? auto;
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClass(Boolean(error))} ${className}`}
        {...rest}
      />
    </FieldShell>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: ReactNode; hint?: ReactNode; error?: string; optional?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, optional, id: idProp, className = '', ...rest },
  ref,
) {
  const auto = useId();
  const id = idProp ?? auto;
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        ref={ref}
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClass(Boolean(error))} resize-y ${className}`}
        {...rest}
      />
    </FieldShell>
  );
});

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; error?: string };

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, error, id: idProp, ...rest }, ref) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-6 shrink-0 cursor-pointer rounded-md accent-accent-strong"
          {...rest}
        />
        <span>{label}</span>
      </label>
      <p id={`${id}-error`} className="ms-9 text-sm font-medium text-danger-ink" aria-live="polite">
        {error}
      </p>
    </div>
  );
});
