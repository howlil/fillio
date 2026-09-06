import type { HTMLAttributes, ReactNode } from 'react';

import { classes } from './classnames';

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={classes(
        'grid gap-3 rounded-[8px] border border-app-border bg-app-surface px-3 py-3 shadow-none sm:px-4 sm:py-4',
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classes(
        'flex items-start justify-between gap-3 max-sm:flex-col max-sm:items-stretch',
        className,
      )}
    >
      <div className="grid min-w-0 gap-0.5">
        {eyebrow ? (
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
            {eyebrow}
          </p>
        ) : null}
        <div className="grid gap-0.5">
          <h2 className="m-0 text-[14px] font-semibold tracking-tight text-app-ink">
            {title}
          </h2>
          {description ? (
            <p className="m-0 max-w-3xl text-xs leading-5 text-app-subtle">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Subsection({
  title,
  action,
  children,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={classes(
        'grid gap-2 border-t border-app-border pt-3 first:border-t-0 first:pt-0',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 max-sm:items-start">
        <h3 className="m-0 text-[13px] font-semibold text-app-ink">{title}</h3>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
