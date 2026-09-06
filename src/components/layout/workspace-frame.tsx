import { useEffect, useState, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type WorkspaceFrameProps = {
  navigation: ReactNode;
  children: ReactNode;
  title: string;
  eyebrow?: string;
  meta?: ReactNode;
};

const SIDEBAR_COLLAPSED_WIDTH = 56;
const SIDEBAR_EXPANDED_WIDTH = 224;
const DESKTOP_QUERY = '(min-width: 768px)';

function useDesktopLayout(): boolean {
  const [desktop, setDesktop] = useState(() => {
    if (typeof window === 'undefined' || window.matchMedia === undefined) {
      return true;
    }
    return window.matchMedia(DESKTOP_QUERY).matches;
  });

  useEffect(() => {
    if (window.matchMedia === undefined) return undefined;
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return desktop;
}

const SIDEBAR_BUTTON_CLASS =
  'grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border border-app-border bg-app-surface text-app-text transition-colors duration-150 hover:border-app-border-strong hover:bg-app-muted focus-visible:border-app-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-soft';

export function WorkspaceFrame({
  navigation,
  children,
  title,
  eyebrow = 'Career workspace',
  meta = 'Stored locally',
}: WorkspaceFrameProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const desktop = useDesktopLayout();
  const reduceMotion = useReducedMotion();

  const sidebarTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 520, damping: 42, mass: 0.72 };

  return (
    <div className="min-h-screen bg-app-bg font-sans text-app-ink md:grid md:grid-cols-[56px_minmax(0,1fr)]">
      {desktop ? (
        <aside
          className="group/sidebar relative z-40 h-screen w-14 overflow-visible bg-transparent md:sticky md:top-0"
          aria-label="Job Flow sidebar"
          data-expanded={sidebarExpanded}
        >
          <motion.div
            className="absolute inset-y-0 left-0 overflow-hidden border-r border-app-border bg-app-surface shadow-none"
            animate={{
              width: sidebarExpanded
                ? SIDEBAR_EXPANDED_WIDTH
                : SIDEBAR_COLLAPSED_WIDTH,
            }}
            initial={false}
            transition={sidebarTransition}
          >
            <div className="flex h-12 w-56 items-center gap-2 border-b border-app-border px-2.5">
              {sidebarExpanded ? (
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-app-accent text-xs font-bold text-white"
                  aria-hidden="true"
                >
                  J
                </span>
              ) : (
                <button
                  className={SIDEBAR_BUTTON_CLASS}
                  type="button"
                  aria-label="Expand sidebar"
                  aria-expanded={false}
                  title="Expand sidebar"
                  onClick={() => setSidebarExpanded(true)}
                >
                  <PanelLeftOpen
                    aria-hidden="true"
                    size={17}
                    strokeWidth={1.8}
                  />
                </button>
              )}

              <AnimatePresence initial={false}>
                {sidebarExpanded ? (
                  <motion.div
                    className="min-w-0 flex-1"
                    initial={reduceMotion ? false : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -3 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.12, ease: 'easeOut' }
                    }
                  >
                    <p className="m-0 truncate text-sm font-semibold tracking-tight text-app-ink">
                      Job Flow
                    </p>
                    <p className="m-0 text-xs font-medium text-app-subtle">
                      Career workspace
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {sidebarExpanded ? (
                <button
                  className={SIDEBAR_BUTTON_CLASS}
                  type="button"
                  aria-label="Collapse sidebar"
                  aria-expanded={true}
                  title="Collapse sidebar"
                  onClick={() => setSidebarExpanded(false)}
                >
                  <PanelLeftClose
                    aria-hidden="true"
                    size={17}
                    strokeWidth={1.8}
                  />
                </button>
              ) : null}
            </div>

            <div className="h-[calc(100vh-3rem)] w-56 overflow-y-auto px-2 py-2">
              {navigation}
            </div>
          </motion.div>
        </aside>
      ) : (
        <aside
          className="border-b border-app-border bg-app-surface px-3 py-2"
          aria-label="Job Flow sidebar"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-app-accent text-xs font-bold text-white"
              aria-hidden="true"
            >
              J
            </span>
            <div className="min-w-0">
              <p className="m-0 truncate text-sm font-semibold tracking-tight text-app-ink">
                Job Flow
              </p>
              <p className="m-0 text-xs font-medium text-app-subtle">
                Career workspace
              </p>
            </div>
          </div>
          {navigation}
        </aside>
      )}

      <div className="min-w-0 bg-app-bg">
        <header className="sticky top-0 z-30 overflow-hidden border-b border-app-border bg-app-surface shadow-none">
          <div className="flex min-h-12 items-center justify-between gap-3 px-3 sm:px-4">
            <div className="min-w-0 py-1.5">
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
                {eyebrow}
              </p>
              <h1 className="m-0 truncate text-[15px] font-semibold tracking-tight text-app-ink">
                {title}
              </h1>
            </div>
            {meta === null ? null : (
              <div className="shrink-0 text-xs font-medium text-app-subtle max-sm:hidden">
                {meta}
              </div>
            )}
          </div>
        </header>

        <main className="min-h-[calc(100vh-3rem)] w-full overflow-x-hidden bg-app-bg p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
