import type { ButtonHTMLAttributes } from 'react';

import { classes } from './classnames';

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'primary'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md';

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  default:
    'border-app-border bg-app-surface text-app-ink hover:border-app-accent hover:bg-app-muted',
  secondary:
    'border-app-border bg-app-surface text-app-ink hover:border-app-accent hover:bg-app-muted',
  primary:
    'border-transparent bg-app-button text-app-button-text hover:opacity-90',
  ghost:
    'border-transparent bg-transparent text-app-text hover:bg-app-muted hover:text-app-ink',
  danger:
    'border-transparent bg-app-danger text-white hover:brightness-95',
};

const BUTTON_SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-7 px-2.5',
  md: 'min-h-8 px-3',
};

export function Button({
  variant = 'default',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={classes(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-control border text-[11px] font-medium transition-[color,background-color,border-color,opacity,filter,transform] duration-100 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        BUTTON_SIZE_CLASS[size],
        BUTTON_VARIANT_CLASS[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
