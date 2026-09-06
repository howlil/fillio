import type { HTMLAttributes, ReactNode } from 'react';

import { classes } from './classnames';

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={classes(
        'jobflow-bento-card grid gap-4 px-4 py-4 sm:px-5 sm:py-5',
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
      <div className="grid min-w-0 gap-1">
        {eyebrow ? (
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
            {eyebrow}
          </p>
        ) : null}
        <div className="grid gap-1">
          <h2 className="m-0 text-[15px] font-semibold tracking-tight text-app-ink">
            {title}
          </h2>
          {description ? (
            <p className="m-0 max-w-3xl text-[13px] leading-5 text-app-subtle">
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
        'grid gap-3 rounded-[16px] border border-app-border/80 bg-app-muted/70 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 max-sm:items-start">
        <h3 className="m-0 text-sm font-semibold text-app-ink">{title}</h3>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
