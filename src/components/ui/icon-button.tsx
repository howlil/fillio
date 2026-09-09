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
    'border-transparent bg-transparent text-app-text hover:bg-app-muted hover:text-app-ink',
  danger:
    'border-transparent bg-transparent text-app-danger hover:bg-app-danger-soft',
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
        'grid shrink-0 place-items-center rounded-control border transition-[background-color,border-color,color,transform] duration-100 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
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
