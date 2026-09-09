import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { classes } from './classnames';

type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> & {
  label: ReactNode;
  className?: string;
};

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField({ label, className, ...props }, ref) {
    return (
      <label
        className={classes(
          'inline-flex min-h-8 items-center gap-2 text-[11px] font-medium text-app-text',
          className,
        )}
      >
        <input
          ref={ref}
          className="h-4 w-4 shrink-0 rounded-[4px] border-app-border-strong accent-app-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
          type="checkbox"
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  },
);
