import { useEffect, useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';

import {
  APPLICATION_PRIORITIES,
  APPLICATION_STAGES,
  APPLICATION_SUBSTAGES_BY_STAGE,
  type ApplicationPriority,
  type ApplicationStage,
  type ApplicationSubstage,
  type JobApplication,
} from '../../domain/applications/application-schema';
import type {
  ApplicationDraft,
  ApplicationService,
} from '../../application/applications/application-service';
import {
  ActionRow,
  Button,
  EmptyState,
  FieldGrid,
  Section,
  SectionHeader,
  SelectField,
  StatusMessage,
  TextField,
  TextareaField,
} from '../ui';
import { ApplicationDetail } from './ApplicationDetail';
import {
  ACTIVE_APPLICATION_STAGES,
  CLOSED_APPLICATION_SUBSTAGES,
  applicationIsClosed,
  applicationNeedsAction,
  focusApplications,
  localDateKey,
  type ApplicationView,
} from './application-focus';
import {
  PRIORITY_LABELS,
  STAGE_LABELS,
  SUBSTAGE_LABELS,
  displayDate,
  nextActionStatus,
} from './application-display';

const EMPTY_DRAFT: ApplicationDraft = {
  company: '',
  role: '',
  jobUrl: '',
  stage: 'saved',
  notes: '',
  source: '',
  contactName: '',
  contactEmail: '',
  nextAction: '',
  nextActionAt: '',
  deadline: '',
  appliedAt: '',
  interviewAt: '',
  offerAt: '',
  closedAt: '',
};

function draftFromApplication(application: JobApplication): ApplicationDraft {
  return {
    company: application.company,
    role: application.role,
    jobUrl: application.jobUrl ?? '',
    stage: application.stage,
    substage: application.substage,
    priority: application.priority,
    notes: application.notes ?? '',
    source: application.source ?? '',
    contactName: application.contactName ?? '',
    contactEmail: application.contactEmail ?? '',
    nextAction: application.nextAction ?? '',
    nextActionAt: application.nextActionAt ?? '',
    deadline: application.deadline ?? '',
    appliedAt: application.appliedAt ?? '',
    interviewAt: application.interviewAt ?? '',
    offerAt: application.offerAt ?? '',
    closedAt: application.closedAt ?? '',
  };
}

function PipelineCard({
  application,
  todayKey,
  showStage,
  showFollowUpNote,
  onOpen,
}: {
  application: JobApplication;
  todayKey: string;
  showStage: boolean;
  showFollowUpNote: boolean;
  onOpen: (application: JobApplication) => void;
}) {
  const closed = applicationIsClosed(application);
  const dueStatus = closed ? null : nextActionStatus(application, todayKey);
  const urgent =
    dueStatus === 'Due today' || dueStatus?.startsWith('Overdue') === true;
  const lifecycleLabel =
    application.substage !== undefined
      ? SUBSTAGE_LABELS[application.substage]
      : showStage
        ? STAGE_LABELS[application.stage]
        : null;
  const contextualDetail = application.contactName
    ? `Contact · ${application.contactName}`
    : application.source
      ? `Source · ${application.source}`
      : null;
  const followUpNote = application.notes?.trim();

  return (
    <article
      className={`group relative grid gap-2.5 rounded-control border bg-app-surface px-3 py-3 text-left transition-[background-color,border-color,box-shadow] duration-150 hover:border-app-border-strong hover:bg-app-muted focus-within:border-app-accent focus-within:ring-2 focus-within:ring-app-accent-soft ${
        urgent ? 'border-app-warning/40' : 'border-app-border'
      }`}
    >
      <button
        aria-label={`View ${application.company} ${application.role} details`}
        className="absolute inset-0 z-10 cursor-pointer rounded-control focus-visible:outline-none"
        onClick={() => onOpen(application)}
        type="button"
      />

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="grid min-w-0 gap-0.5">
          <strong className="truncate text-[13px] font-semibold text-app-ink">
            {application.role}
          </strong>
          <span className="truncate text-xs font-medium text-app-subtle">
            {application.company}
          </span>
        </div>
        <ChevronRight
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-app-subtle transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-app-text"
          size={15}
        />
      </div>

      {application.nextAction ? (
        <p className="m-0 rounded-[6px] bg-app-muted px-2.5 py-2 text-[13px] font-medium leading-5 text-app-ink">
          Next: {application.nextAction}
        </p>
      ) : !closed ? (
        <p className="m-0 text-[13px] text-app-subtle">No next action set</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-app-subtle">
        {dueStatus !== null ? (
          <span
            className={
              urgent
                ? 'rounded-control border border-app-warning/30 bg-app-warning-soft px-2 py-1 text-app-warning'
                : 'rounded-control border border-app-border bg-app-muted px-2 py-1 text-app-text'
            }
          >
            {dueStatus}
          </span>
        ) : null}
        {application.priority !== undefined ? (
          <span className="rounded-control border border-app-border px-2 py-1 text-app-ink">
            {PRIORITY_LABELS[application.priority]}
          </span>
        ) : null}
        {lifecycleLabel !== null ? (
          <span className="rounded-control border border-app-border px-2 py-1 text-app-text">
            {lifecycleLabel}
          </span>
        ) : null}
      </div>

      {showFollowUpNote && followUpNote ? (
        <p className="m-0 whitespace-pre-wrap border-t border-app-border pt-2 text-[13px] leading-5 text-app-text">
          {followUpNote}
        </p>
      ) : null}

      {application.deadline || contextualDetail !== null ? (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-app-border pt-2 text-xs text-app-subtle">
          {application.deadline ? (
            <span>Deadline {displayDate(application.deadline)}</span>
          ) : (
            <span />
          )}
          {contextualDetail !== null ? <span>{contextualDetail}</span> : null}
        </div>
      ) : null}
    </article>
  );
}

export function ApplicationsWorkspace({
  service,
}: {
  service: ApplicationService;
}) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [draft, setDraft] = useState<ApplicationDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [applicationView, setApplicationView] =
    useState<ApplicationView>('board');

  async function reload(active = true) {
    try {
      const next = await service.list();
      if (!active) return;
      setApplications(next);
      setError(null);
    } catch {
      if (active) setError('Could not load saved applications.');
    } finally {
      if (active) setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void reload(active);
    return () => {
      active = false;
    };
  }, [service]);

  function resetForm() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(false);
    setError(null);
  }

  function openCreateForm() {
    setSelectedApplicationId(null);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(true);
    setStatus(null);
    setError(null);
  }

  function openApplicationDetail(application: JobApplication) {
    setSelectedApplicationId(application.id);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(false);
    setStatus(null);
    setError(null);
  }

  function backToPipeline() {
    setSelectedApplicationId(null);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(false);
    setError(null);
  }

  function openEditForm(application: JobApplication) {
    setEditingId(application.id);
    setDraft(draftFromApplication(application));
    setFormOpen(true);
    setStatus(null);
    setError(null);
  }

  function updateDraft(changes: Partial<ApplicationDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
    setStatus(null);
    setError(null);
  }

  async function submitDraft() {
    try {
      if (editingId === null) {
        await service.create(draft);
        setStatus('Job added to pipeline.');
      } else {
        await service.update(editingId, draft);
        setStatus('Job updated.');
      }
      setDraft(EMPTY_DRAFT);
      setEditingId(null);
      setFormOpen(false);
      await reload();
    } catch {
      setError(
        'Company, role, a valid URL, and a compatible lifecycle state are required before saving.',
      );
    }
  }

  async function changeStage(
    id: string,
    stage: ApplicationStage,
    substage?: ApplicationSubstage,
  ) {
    try {
      await service.changeStage(id, stage, substage);
      setStatus(
        stage === 'closed' && substage !== undefined
          ? `Closed as ${SUBSTAGE_LABELS[substage]}.`
          : `Moved to ${STAGE_LABELS[stage]}.`,
      );
      await reload();
    } catch {
      setError('Could not update this job lifecycle.');
    }
  }

  async function changeSubstage(
    id: string,
    substage: ApplicationSubstage | undefined,
  ) {
    try {
      await service.update(id, { substage });
      setStatus(
        substage === undefined
          ? 'Lifecycle detail cleared.'
          : `Lifecycle detail: ${SUBSTAGE_LABELS[substage]}.`,
      );
      await reload();
    } catch {
      setError('Could not update this lifecycle detail.');
    }
  }

  async function completeFollowUp(id: string) {
    try {
      await service.update(id, { nextAction: '', nextActionAt: '' });
      setStatus('Follow-up completed.');
      await reload();
    } catch {
      setError('Could not complete this follow-up.');
    }
  }

  async function updateOperational(
    id: string,
    changes: Partial<ApplicationDraft>,
  ) {
    try {
      await service.update(id, changes);
      setStatus('Application updated.');
      await reload();
    } catch {
      setError('Could not update these application details.');
    }
  }

  async function deleteApplication(id: string) {
    try {
      await service.delete(id);
      if (editingId === id) resetForm();
      if (selectedApplicationId === id) setSelectedApplicationId(null);
      setStatus('Job deleted.');
      await reload();
    } catch {
      setError('Could not delete this job.');
    }
  }

  const todayKey = localDateKey(new Date());
  const activeCount = applications.filter(
    (application) => !applicationIsClosed(application),
  ).length;
  const closedCount = applications.length - activeCount;
  const actionableCount = applications.filter((application) =>
    applicationNeedsAction(application, todayKey),
  ).length;
  const opportunityLabel = activeCount === 1 ? 'opportunity' : 'opportunities';
  const visibleApplications = focusApplications(applications, {
    query,
    view: applicationView,
    todayKey,
  });
  const selectedApplication =
    selectedApplicationId === null
      ? null
      : (applications.find(
          (application) => application.id === selectedApplicationId,
        ) ?? null);
  const substageOptions = APPLICATION_SUBSTAGES_BY_STAGE[draft.stage];

  const form = formOpen ? (
    <div className="grid gap-3 rounded-control border border-app-border bg-app-surface p-3">
      <div className="grid gap-1">
        <h3 className="m-0 text-sm font-semibold text-app-ink">
          {editingId === null ? 'Add job' : 'Edit job'}
        </h3>
        <p className="m-0 text-[13px] text-app-subtle">
          Capture only the context needed to decide and execute the next move.
        </p>
      </div>
      <FieldGrid>
        <TextField
          label="Company"
          value={draft.company}
          onChange={(event) => updateDraft({ company: event.target.value })}
        />
        <TextField
          label="Role"
          value={draft.role}
          onChange={(event) => updateDraft({ role: event.target.value })}
        />
        <TextField
          label="Job URL"
          type="url"
          value={draft.jobUrl ?? ''}
          onChange={(event) => updateDraft({ jobUrl: event.target.value })}
        />
        <SelectField
          label="Stage"
          value={draft.stage}
          onChange={(event) =>
            updateDraft({
              stage: event.target.value as ApplicationStage,
              substage: undefined,
            })
          }
        >
          {APPLICATION_STAGES.map((stage) => (
            <option value={stage} key={stage}>
              {STAGE_LABELS[stage]}
            </option>
          ))}
        </SelectField>
        {substageOptions.length > 0 ? (
          <SelectField
            label="Lifecycle detail"
            value={draft.substage ?? ''}
            onChange={(event) =>
              updateDraft({
                substage:
                  event.target.value === ''
                    ? undefined
                    : (event.target.value as ApplicationSubstage),
              })
            }
          >
            {draft.stage !== 'closed' ? (
              <option value="">No lifecycle detail</option>
            ) : (
              <option value="" disabled>
                Choose outcome
              </option>
            )}
            {substageOptions.map((substage) => (
              <option value={substage} key={substage}>
                {SUBSTAGE_LABELS[substage]}
              </option>
            ))}
          </SelectField>
        ) : null}
        <SelectField
          label="Priority"
          value={draft.priority ?? ''}
          onChange={(event) =>
            updateDraft({
              priority:
                event.target.value === ''
                  ? undefined
                  : (event.target.value as ApplicationPriority),
            })
          }
        >
          <option value="">No priority</option>
          {APPLICATION_PRIORITIES.map((priority) => (
            <option value={priority} key={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </SelectField>
        <TextField
          label="Next action"
          placeholder="Tailor resume, follow up, prepare interview..."
          value={draft.nextAction ?? ''}
          onChange={(event) => updateDraft({ nextAction: event.target.value })}
        />
        <TextField
          label="Next action date"
          type="date"
          value={draft.nextActionAt ?? ''}
          onChange={(event) =>
            updateDraft({ nextActionAt: event.target.value })
          }
        />
        <TextField
          label="Application deadline"
          type="date"
          value={draft.deadline ?? ''}
          onChange={(event) => updateDraft({ deadline: event.target.value })}
        />
        <TextField
          label="Applied date"
          type="date"
          value={draft.appliedAt ?? ''}
          onChange={(event) => updateDraft({ appliedAt: event.target.value })}
        />
        <TextField
          label="Interview date"
          type="date"
          value={draft.interviewAt ?? ''}
          onChange={(event) => updateDraft({ interviewAt: event.target.value })}
        />
        <TextField
          label="Offer date"
          type="date"
          value={draft.offerAt ?? ''}
          onChange={(event) => updateDraft({ offerAt: event.target.value })}
        />
        <TextField
          label="Closed date"
          type="date"
          value={draft.closedAt ?? ''}
          onChange={(event) => updateDraft({ closedAt: event.target.value })}
        />
        <TextField
          label="Source"
          value={draft.source ?? ''}
          onChange={(event) => updateDraft({ source: event.target.value })}
        />
        <TextField
          label="Contact name"
          value={draft.contactName ?? ''}
          onChange={(event) => updateDraft({ contactName: event.target.value })}
        />
        <TextField
          label="Contact email"
          type="email"
          value={draft.contactEmail ?? ''}
          onChange={(event) =>
            updateDraft({ contactEmail: event.target.value })
          }
        />
      </FieldGrid>
      <TextareaField
        label="Notes"
        value={draft.notes ?? ''}
        onChange={(event) => updateDraft({ notes: event.target.value })}
      />
      <ActionRow>
        <Button variant="primary" onClick={() => void submitDraft()}>
          {editingId === null ? 'Add to pipeline' : 'Save changes'}
        </Button>
      </ActionRow>
    </div>
  ) : null;

  const feedback = (
    <>
      {error !== null ? (
        <StatusMessage tone="danger" role="alert">
          {error}
        </StatusMessage>
      ) : null}
      {status !== null ? (
        <StatusMessage tone="success" role="status">
          {status}
        </StatusMessage>
      ) : null}
    </>
  );

  if (
    selectedApplication !== null &&
    formOpen &&
    editingId === selectedApplication.id
  ) {
    return (
      <Section id="applications">
        <SectionHeader
          title="Edit job"
          description={`${selectedApplication.company} · ${selectedApplication.role}`}
          action={
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          }
        />
        {feedback}
        {form}
      </Section>
    );
  }

  if (selectedApplication !== null) {
    return (
      <Section id="applications">
        {feedback}
        <ApplicationDetail
          application={selectedApplication}
          todayKey={todayKey}
          onBack={backToPipeline}
          onEdit={() => openEditForm(selectedApplication)}
          onDelete={() => deleteApplication(selectedApplication.id)}
          onChangeStage={(stage, substage) =>
            changeStage(selectedApplication.id, stage, substage)
          }
          onChangeSubstage={(substage) =>
            changeSubstage(selectedApplication.id, substage)
          }
          onCompleteAction={() => completeFollowUp(selectedApplication.id)}
          onUpdateOperational={(changes) =>
            updateOperational(selectedApplication.id, changes)
          }
        />
      </Section>
    );
  }

  return (
    <Section id="applications">
      <SectionHeader
        title="Job pipeline"
        description="See what needs attention, move opportunities forward, and keep the next action explicit."
        action={
          formOpen ? (
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          ) : (
            <Button variant="primary" onClick={openCreateForm}>
              <Plus aria-hidden="true" size={15} />
              Add job
            </Button>
          )
        }
      />

      {feedback}
      {form}

      <div className="grid gap-2 border-y border-app-border py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <TextField
            className="min-w-0 flex-1 lg:max-w-sm"
            label="Search jobs"
            placeholder="Company or role"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div
            aria-label="Pipeline view"
            className="flex shrink-0 flex-wrap gap-1.5"
            role="group"
          >
            <Button
              aria-pressed={applicationView === 'board'}
              variant={applicationView === 'board' ? 'primary' : 'ghost'}
              onClick={() => setApplicationView('board')}
            >
              Board
            </Button>
            <Button
              aria-pressed={applicationView === 'needs-action'}
              variant={applicationView === 'needs-action' ? 'primary' : 'ghost'}
              onClick={() => setApplicationView('needs-action')}
            >
              Needs action {actionableCount}
            </Button>
            <Button
              aria-pressed={applicationView === 'closed'}
              variant={applicationView === 'closed' ? 'primary' : 'ghost'}
              onClick={() => setApplicationView('closed')}
            >
              Closed {closedCount}
            </Button>
          </div>
        </div>
        <p className="m-0 text-xs text-app-subtle">
          {activeCount} active {opportunityLabel}
          {actionableCount > 0 ? ` · ${actionableCount} need action` : ''}
        </p>
      </div>

      {loading ? (
        <p className="m-0 text-[13px] text-app-text">Loading pipeline...</p>
      ) : applications.length === 0 ? (
        <EmptyState>No jobs in your pipeline yet.</EmptyState>
      ) : visibleApplications.length === 0 ? (
        <EmptyState>No jobs match this view.</EmptyState>
      ) : applicationView === 'board' ? (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[1100px] grid-cols-5 divide-x divide-app-border">
            {ACTIVE_APPLICATION_STAGES.map((stage) => {
              const items = visibleApplications.filter(
                (application) => application.stage === stage,
              );
              return (
                <section
                  className="grid content-start gap-2.5 px-3 first:pl-0 last:pr-0"
                  key={stage}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-app-border pb-2">
                    <h3 className="m-0 text-[13px] font-semibold text-app-ink">
                      {STAGE_LABELS[stage]}
                    </h3>
                    <span className="inline-flex min-w-6 items-center justify-center rounded-control bg-app-muted px-1.5 py-0.5 text-xs font-medium text-app-subtle">
                      {items.length}
                    </span>
                  </div>
                  {items.length === 0 ? (
                    <p className="m-0 py-3 text-xs text-app-subtle">No jobs</p>
                  ) : (
                    <div className="grid gap-2">
                      {items.map((application) => (
                        <PipelineCard
                          key={application.id}
                          application={application}
                          todayKey={todayKey}
                          showStage={false}
                          showFollowUpNote={false}
                          onOpen={openApplicationDetail}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      ) : applicationView === 'needs-action' ? (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {visibleApplications.map((application) => (
            <PipelineCard
              key={application.id}
              application={application}
              todayKey={todayKey}
              showStage
              showFollowUpNote
              onOpen={openApplicationDetail}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-app-border">
          {CLOSED_APPLICATION_SUBSTAGES.map((substage) => {
            const items = visibleApplications.filter(
              (application) => application.substage === substage,
            );
            return (
              <section
                className="grid content-start gap-2.5 border-t border-app-border pt-3 first:border-t-0 first:pt-0 lg:border-t-0 lg:px-3 lg:pt-0 lg:first:pl-0 lg:last:pr-0"
                key={substage}
              >
                <div className="flex items-center justify-between gap-3 border-b border-app-border pb-2">
                  <h3 className="m-0 text-[13px] font-semibold text-app-ink">
                    {SUBSTAGE_LABELS[substage]}
                  </h3>
                  <span className="inline-flex min-w-6 items-center justify-center rounded-control bg-app-muted px-1.5 py-0.5 text-xs font-medium text-app-subtle">
                    {items.length}
                  </span>
                </div>
                {items.length === 0 ? (
                  <p className="m-0 py-3 text-xs text-app-subtle">No jobs</p>
                ) : (
                  <div className="grid gap-2">
                    {items.map((application) => (
                      <PipelineCard
                        key={application.id}
                        application={application}
                        todayKey={todayKey}
                        showStage={false}
                        showFollowUpNote={false}
                        onOpen={openApplicationDetail}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </Section>
  );
}
