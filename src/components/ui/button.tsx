import type { ButtonHTMLAttributes } from 'react';

import { classes } from './classnames';

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    'border-app-border bg-app-surface text-app-ink hover:border-app-border-strong hover:bg-app-muted',
  primary:
    'border-app-accent bg-app-accent text-white hover:border-app-accent-strong hover:bg-app-accent-strong',
  ghost:
    'border-transparent bg-transparent text-app-text hover:border-app-border hover:bg-app-muted hover:text-app-ink',
  danger:
    'border-app-danger bg-app-danger text-white hover:brightness-95 focus-visible:border-app-danger',
};

export function Button({
  variant = 'default',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={classes(
        'inline-flex h-[34px] min-h-[34px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] border px-2.5 text-[13px] font-medium shadow-none transition-colors duration-[120ms] focus-visible:border-app-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-soft disabled:cursor-not-allowed disabled:opacity-50',
        BUTTON_VARIANT_CLASS[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
