import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { classes } from '../ui/classnames';

type HelpPopoverProps = {
  title: ReactNode;
  help?: ReactNode;
};

const WORKSPACE_CONTENT_STYLES = [
  '[&_.workspace-card]:relative [&_.workspace-card]:grid [&_.workspace-card]:gap-3 [&_.workspace-card]:rounded-lg [&_.workspace-card]:border [&_.workspace-card]:border-app-border [&_.workspace-card]:bg-app-surface [&_.workspace-card]:p-3 [&_.workspace-card]:shadow-none',
  '[&_.workspace-brand__mark]:grid [&_.workspace-brand__mark]:h-9 [&_.workspace-brand__mark]:w-9 [&_.workspace-brand__mark]:place-items-center [&_.workspace-brand__mark]:rounded-control [&_.workspace-brand__mark]:bg-app-ink [&_.workspace-brand__mark]:text-xs [&_.workspace-brand__mark]:font-bold [&_.workspace-brand__mark]:text-app-surface',
  '[&_.cv-dropzone]:grid [&_.cv-dropzone]:min-h-0 [&_.cv-dropzone]:rounded-lg [&_.cv-dropzone]:border [&_.cv-dropzone]:border-dashed [&_.cv-dropzone]:border-app-border-strong [&_.cv-dropzone]:bg-app-muted [&_.cv-dropzone]:p-3 [&_.cv-dropzone]:text-left [&_.cv-dropzone]:shadow-none',
  '[&_.cv-dropzone__content]:grid [&_.cv-dropzone__content]:w-full [&_.cv-dropzone__content]:grid-cols-[auto_minmax(0,1fr)_auto] [&_.cv-dropzone__content]:grid-rows-[auto_auto] [&_.cv-dropzone__content]:items-center [&_.cv-dropzone__content]:gap-x-2.5 [&_.cv-dropzone__content]:gap-y-1',
  '[&_.cv-dropzone__content>.workspace-brand__mark]:col-start-1 [&_.cv-dropzone__content>.workspace-brand__mark]:row-span-2',
  '[&_.cv-dropzone__content>h3]:col-start-2 [&_.cv-dropzone__content>h3]:row-start-1 [&_.cv-dropzone__content>h3]:m-0 [&_.cv-dropzone__content>h3]:text-[12px] [&_.cv-dropzone__content>h3]:font-semibold',
  '[&_.cv-dropzone__content>p]:col-start-2 [&_.cv-dropzone__content>p]:row-start-2 [&_.cv-dropzone__content>p]:m-0 [&_.cv-dropzone__content>p]:text-[10px] [&_.cv-dropzone__content>p]:leading-4 [&_.cv-dropzone__content>p]:text-app-text',
  '[&_.cv-dropzone__content>:last-child]:col-start-3 [&_.cv-dropzone__content>:last-child]:row-span-2 [&_.cv-dropzone__content>:last-child]:row-start-1 [&_.cv-dropzone__content>:last-child]:justify-self-end',
  '[&_.cv-preview]:grid [&_.cv-preview]:gap-0',
  '[&_.cv-preview__row]:grid [&_.cv-preview__row]:grid-cols-[auto_minmax(120px,0.6fr)_minmax(0,1.4fr)] [&_.cv-preview__row]:items-start [&_.cv-preview__row]:gap-2.5 [&_.cv-preview__row]:border-b [&_.cv-preview__row]:border-app-border [&_.cv-preview__row]:py-2.5 [&_.cv-preview__row]:text-[11px] [&_.cv-preview__row:last-child]:border-b-0',
  '[&_.cv-preview__value]:min-w-0 [&_.cv-preview__value]:text-[11px] [&_.cv-preview__value]:leading-4 [&_.cv-preview__value]:text-app-text',
  '[&_.document-list]:grid [&_.document-list]:gap-0',
  '[&_.document-row]:flex [&_.document-row]:items-start [&_.document-row]:justify-between [&_.document-row]:gap-3 [&_.document-row]:border-b [&_.document-row]:border-app-border [&_.document-row]:py-2.5 [&_.document-row]:text-[11px] [&_.document-row:last-child]:border-b-0',
  '[&_.document-row__meta]:grid [&_.document-row__meta]:min-w-0 [&_.document-row__meta]:gap-1 [&_.document-row__meta]:text-[11px] [&_.document-row__meta]:leading-4 [&_.document-row__meta]:text-app-text',
  'max-[720px]:[&_.cv-dropzone__content]:grid-cols-[auto_minmax(0,1fr)] max-[720px]:[&_.cv-dropzone__content>:last-child]:col-span-2 max-[720px]:[&_.cv-dropzone__content>:last-child]:col-start-1 max-[720px]:[&_.cv-dropzone__content>:last-child]:row-start-3 max-[720px]:[&_.cv-dropzone__content>:last-child]:mt-1.5 max-[720px]:[&_.cv-dropzone__content>:last-child]:justify-self-stretch',
  'max-[720px]:[&_.cv-preview__row]:grid-cols-[auto_minmax(0,1fr)] max-[720px]:[&_.cv-preview__value]:col-start-2',
  'md:[&>label.max-w-md]:inline-grid md:[&>label.max-w-md]:mr-2 md:[&>label.max-w-md]:w-[28rem] md:[&>label.max-w-md+button]:inline-flex',
].join(' ');

function helpLabel(title: ReactNode): string {
  return typeof title === 'string' ? `About ${title}` : 'About this section';
}

function fallbackHelp(title: ReactNode): ReactNode {
  return typeof title === 'string'
    ? `How ${title.toLowerCase()} is used by Job Flow.`
    : 'More about this section.';
}

function HelpPopover({ title, help }: HelpPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div
      className="relative inline-flex"
      ref={rootRef}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="grid h-7 w-7 place-items-center rounded-control border border-transparent bg-transparent text-app-subtle transition-[background-color,color] duration-100 hover:bg-app-muted hover:text-app-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
        aria-label={helpLabel(title)}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <CircleHelp aria-hidden="true" size={14} strokeWidth={1.8} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="absolute left-0 top-8 z-50 w-60 max-w-[calc(100vw-2rem)] rounded-lg border border-app-border bg-app-surface p-2.5 text-left shadow-overlay"
            role="dialog"
            aria-label={helpLabel(title)}
            initial={reduceMotion ? false : { opacity: 0, y: -3, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: -2, scale: 0.99 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.16, ease: 'easeOut' }
            }
          >
            <p className="m-0 text-[10px] font-normal leading-4 text-app-text">
              {help ?? fallbackHelp(title)}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type WorkspaceSectionProps = Omit<
  HTMLAttributes<HTMLDetailsElement>,
  'open'
> & {
  defaultOpen?: boolean;
};

export function WorkspaceSection({
  className,
  defaultOpen = true,
  ...props
}: WorkspaceSectionProps) {
  return (
    <details
      className={classes(
        'group rounded-lg border border-app-border bg-app-surface px-3 pb-3 shadow-none sm:px-4 sm:pb-4',
        WORKSPACE_CONTENT_STYLES,
        className,
      )}
      open={defaultOpen}
      {...props}
    />
  );
}

export function WorkspaceSectionHeader({
  title,
  description,
  help,
  eyebrow,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  help?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const helpContent = help ?? description;

  return (
    <summary
      className={classes(
        '-mx-3 mb-0 flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 border-b border-transparent px-3 py-2.5 outline-none transition-colors hover:bg-app-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-app-accent group-open:mb-3 group-open:border-app-border sm:-mx-4 sm:px-4 [&::-webkit-details-marker]:hidden',
        className,
      )}
    >
      <div className="grid min-w-0 gap-0.5">
        {eyebrow ? (
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.07em] text-app-subtle">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex min-w-0 items-center gap-1">
          <h2 className="m-0 min-w-0 truncate text-[13px] font-semibold tracking-tight text-app-ink">
            {title}
          </h2>
          <HelpPopover title={title} help={helpContent} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {action ? (
          <div onClick={(event) => event.stopPropagation()}>{action}</div>
        ) : null}
        <span
          className="grid h-7 w-7 place-items-center text-app-subtle transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          <ChevronDown size={14} strokeWidth={1.8} />
        </span>
      </div>
    </summary>
  );
}

export function WorkspaceSubsection({
  title,
  help,
  action,
  children,
  className,
  defaultOpen = true,
}: {
  title: ReactNode;
  help?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className={classes(
        'group rounded-lg border border-app-border bg-app-surface px-3 pb-3 shadow-none sm:px-4 sm:pb-4',
        className,
      )}
      open={defaultOpen}
    >
      <summary className="-mx-3 mb-0 flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 border-b border-transparent px-3 py-2.5 outline-none transition-colors hover:bg-app-muted/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-app-accent group-open:mb-3 group-open:border-app-border sm:-mx-4 sm:px-4 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-1">
          <h3 className="m-0 min-w-0 truncate text-[12px] font-semibold text-app-ink">
            {title}
          </h3>
          <HelpPopover title={title} help={help} />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {action ? (
            <div onClick={(event) => event.stopPropagation()}>{action}</div>
          ) : null}
          <span
            className="grid h-7 w-7 place-items-center text-app-subtle transition-transform group-open:rotate-180"
            aria-hidden="true"
          >
            <ChevronDown size={14} strokeWidth={1.8} />
          </span>
        </div>
      </summary>
      {children}
    </details>
  );
}
