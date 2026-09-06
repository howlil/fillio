import type { ButtonHTMLAttributes } from 'react';

import { classes } from './classnames';

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    'border-app-border bg-app-raised text-app-ink shadow-[0_1px_2px_rgb(31_41_55/0.05),inset_0_1px_0_rgb(255_255_255/0.8)] hover:border-app-border-strong hover:bg-app-muted',
  primary:
    'border-app-accent bg-app-accent text-white shadow-[0_8px_18px_rgb(var(--app-accent)/0.22),inset_0_1px_0_rgb(255_255_255/0.22)] hover:border-app-accent-strong hover:bg-app-accent-strong',
  ghost:
    'border-transparent bg-transparent text-app-text shadow-none hover:border-app-border hover:bg-app-raised hover:text-app-ink',
  danger:
    'border-app-danger bg-app-danger text-white shadow-[0_8px_18px_rgb(var(--app-danger)/0.16)] hover:brightness-95 focus-visible:border-app-danger',
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
        'inline-flex h-9 min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border px-3 text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-150 focus-visible:border-app-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent-soft active:translate-y-px disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50',
        BUTTON_VARIANT_CLASS[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
