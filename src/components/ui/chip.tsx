import type { HTMLAttributes } from 'react';

import { classes } from './classnames';

export function Chip({
  strong = false,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { strong?: boolean }) {
  return (
    <span
      className={classes(
        'inline-flex min-h-5 items-center gap-1 rounded-full border border-app-border bg-app-muted px-2 py-0.5 text-[10px] font-medium leading-4 text-app-text',
        strong &&
          'border-app-border-strong bg-app-surface font-semibold text-app-ink',
        className,
      )}
      {...props}
    />
  );
}
