import type { ButtonHTMLAttributes } from 'react';

import { classes } from './classnames';

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    'border-app-border bg-app-surface text-app-ink hover:border-app-border-strong hover:bg-app-muted',
  primary:
    'border-app-button bg-app-button text-app-button-text hover:brightness-95',
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
        'inline-flex h-8 min-h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-control border px-2.5 text-[13px] font-medium transition-[background-color,border-color,color,filter,transform] duration-100 ease-out focus-visible:border-app-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/25 active:scale-[0.97] motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50',
        BUTTON_VARIANT_CLASS[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
