import type { HTMLAttributes } from 'react';

import { classes } from './classnames';

export function StatusMessage({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  tone?: 'neutral' | 'success' | 'danger' | 'warning';
}) {
  const toneClass = {
    neutral: 'border-app-border bg-app-muted text-app-text',
    success: 'border-app-success/30 bg-app-success-soft text-app-success',
    danger: 'border-app-danger/30 bg-app-danger-soft text-app-danger',
    warning: 'border-app-warning/30 bg-app-warning-soft text-app-warning',
  }[tone];
  return (
    <p
      className={classes(
        'm-0 w-full rounded-lg border px-2.5 py-2 text-[11px] leading-4',
        toneClass,
        className,
      )}
      {...props}
    />
  );
}
