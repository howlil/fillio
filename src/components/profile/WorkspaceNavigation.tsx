import {
  BriefcaseBusiness,
  ClipboardList,
  FileArchive,
  FileText,
  GraduationCap,
  History,
  ListChecks,
  MapPin,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { SelectField } from '../ui';
import type { WorkspaceSection } from './workspace-sections';

const groups = [
  {
    label: 'Work',
    items: [{ id: 'applications', label: 'Pipeline', icon: ClipboardList }],
  },
  {
    label: 'Career',
    items: [
      { id: 'personal', label: 'Profile', icon: UserRound },
      { id: 'experience', label: 'Experience', icon: BriefcaseBusiness },
      { id: 'education', label: 'Education', icon: GraduationCap },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'variants', label: 'Application Profiles', icon: ListChecks },
    ],
  },
  {
    label: 'Settings & data',
    items: [
      { id: 'preferences', label: 'Preferences', icon: MapPin },
      { id: 'sensitive', label: 'Privacy & Sensitive', icon: ShieldCheck },
      { id: 'corrections', label: 'Autofill Memory', icon: History },
      { id: 'backup', label: 'Backup & Recovery', icon: FileArchive },
    ],
  },
] as const;

type WorkspaceNavigationProps = {
  activeSection: WorkspaceSection;
  onChange: (section: WorkspaceSection) => void;
};

const navItemBase =
  'jobflow-nav-item relative flex h-9 min-h-9 w-9 items-center justify-center rounded-control border text-left text-[11px] font-medium transition-[width,padding,gap,background-color,border-color,color] duration-[160ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent group-data-[expanded=true]/sidebar:w-full group-data-[expanded=true]/sidebar:justify-start group-data-[expanded=true]/sidebar:gap-2 group-data-[expanded=true]/sidebar:px-2';

export function WorkspaceNavigation({
  activeSection,
  onChange,
}: WorkspaceNavigationProps) {
  return (
    <div>
      <SelectField
        className="md:hidden"
        label="Section"
        selectClassName="text-[11px]"
        value={activeSection}
        onChange={(event) => onChange(event.target.value as WorkspaceSection)}
      >
        {groups.map((group) => (
          <optgroup label={group.label} key={group.label}>
            {group.items.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </optgroup>
        ))}
      </SelectField>

      <nav
        className="hidden space-y-2 md:block"
        aria-label="Jobflow workspace sections"
      >
        {groups.map((group) => (
          <div className="pt-1.5 first:pt-0" key={group.label}>
            <p className="pointer-events-none m-0 max-h-0 overflow-hidden px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-app-subtle opacity-0 transition-[max-height,margin,opacity] duration-[160ms] ease-out group-data-[expanded=true]/sidebar:mb-1 group-data-[expanded=true]/sidebar:max-h-4 group-data-[expanded=true]/sidebar:opacity-100">
              {group.label}
            </p>
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    className={`${navItemBase} ${
                      active
                        ? 'border-app-accent/20 bg-app-muted text-app-accent'
                        : 'border-transparent bg-transparent text-app-text hover:bg-app-muted hover:text-app-ink'
                    }`}
                    type="button"
                    key={item.id}
                    aria-current={active ? 'page' : undefined}
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => onChange(item.id)}
                  >
                    <Icon
                      className="shrink-0"
                      aria-hidden="true"
                      size={18}
                      strokeWidth={active ? 2 : 1.8}
                    />
                    <span className="pointer-events-none max-w-0 overflow-hidden truncate whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-[160ms] ease-out group-data-[expanded=true]/sidebar:max-w-[152px] group-data-[expanded=true]/sidebar:opacity-100">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
