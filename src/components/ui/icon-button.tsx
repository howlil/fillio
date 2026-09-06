import type { ButtonHTMLAttributes } from 'react';

import { classes } from './classnames';

export type IconButtonSize = 'xs' | 'sm' | 'md';
export type IconButtonTone = 'default' | 'danger';

const ICON_BUTTON_SIZE_CLASS: Record<IconButtonSize, string> = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-8 w-8',
};

const ICON_BUTTON_TONE_CLASS: Record<IconButtonTone, string> = {
  default:
    'border-app-border bg-transparent text-app-ink hover:border-app-border-strong hover:bg-app-muted',
  danger:
    'border-transparent bg-transparent text-app-danger hover:border-app-danger/30 hover:bg-app-danger-soft',
};

export function IconButton({
  className,
  type = 'button',
  size = 'md',
  tone = 'default',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: IconButtonSize;
  tone?: IconButtonTone;
}) {
  return (
    <button
      className={classes(
        'grid shrink-0 place-items-center rounded-[6px] border transition-colors duration-150 focus-visible:border-app-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-soft disabled:cursor-not-allowed disabled:opacity-50',
        ICON_BUTTON_SIZE_CLASS[size],
        ICON_BUTTON_TONE_CLASS[tone],
        className,
      )}
      type={type}
      data-icon-button
      {...props}
    />
  );
}
