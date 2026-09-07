import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  APPLICATION_SUBSTAGES_BY_STAGE,
  type ApplicationStage,
  type ApplicationSubstage,
  type JobApplication,
} from '../../domain/applications/application-schema';
import {
  ActionRow,
  Button,
  SectionHeader,
  SelectField,
  TextareaField,
  TextField,
} from '../ui';
import {
  ACTIVE_APPLICATION_STAGES,
  applicationIsClosed,
} from './application-focus';
import {
  PRIORITY_LABELS,
  STAGE_LABELS,
  SUBSTAGE_LABELS,
  applicationHasCompletableAction,
  displayDate,
  nextActionStatus,
  nextPipelineStage,
  previousPipelineStage,
  recommendedLifecycleAction,
  stageActionLabel,
} from './application-display';

type OperationalChanges = {
  nextAction?: string;
  nextActionAt?: string;
  notes?: string;
  deadline?: string;
  appliedAt?: string;
  interviewAt?: string;
  offerAt?: string;
};

function DetailBlock({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3 border-t border-app-border pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-3">
        <h3 className="m-0 text-[13px] font-semibold uppercase tracking-[0.08em] text-app-subtle">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function DetailValue({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-[13px] font-medium text-app-subtle">{label}</span>
      <div className="text-sm text-app-text">{children}</div>
    </div>
  );
}

function ProgressTrack({ application }: { application: JobApplication }) {
  const closed = applicationIsClosed(application);
  const activeStageIndex = ACTIVE_APPLICATION_STAGES.findIndex(
    (stage) => stage === application.stage,
  );
  const reachedFromHistory = useMemo(
    () => new Set(application.stageHistory.map((entry) => entry.stage)),
    [application.stageHistory],
  );
  const lastActiveEntry = [...application.stageHistory]
    .reverse()
    .find((entry) => entry.stage !== 'closed');

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-5 gap-1" aria-label="Application progress">
        {ACTIVE_APPLICATION_STAGES.map((stage, index) => {
          const current = !closed && application.stage === stage;
          const reached = closed
            ? reachedFromHistory.has(stage)
            : activeStageIndex >= index;
          const stateLabel = current
            ? 'current'
            : reached
              ? 'reached'
              : 'not reached';
          return (
            <div
              className="grid min-w-0 gap-1"
              key={stage}
              aria-label={`${STAGE_LABELS[stage]} ${stateLabel}`}
            >
              <span
                aria-hidden="true"
                className={`h-1 rounded-full ${
                  reached ? 'bg-app-ink' : 'bg-app-border'
                }`}
              />
              <span
                className={`truncate text-[13px] font-medium ${
                  current ? 'text-app-ink' : 'text-app-subtle'
                }`}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
          );
        })}
      </div>
      {closed ? (
        <p className="m-0 text-[13px] text-app-subtle">
          Closed
          {lastActiveEntry === undefined
            ? ''
            : ` after ${STAGE_LABELS[lastActiveEntry.stage]}`}
          {application.substage === undefined
            ? '.'
            : ` · ${SUBSTAGE_LABELS[application.substage]}.`}
        </p>
      ) : null}
    </div>
  );
}

function defaultSubstageForStage(
  stage: ApplicationStage,
): ApplicationSubstage | undefined {
  if (stage === 'applying') return 'preparing_application';
  if (stage === 'applied') return 'submitted';
  if (stage === 'offer') return 'offer_received';
  return undefined;
}

export function ApplicationDetail({
  application,
  todayKey,
  onBack,
  onEdit,
  onDelete,
  onChangeStage,
  onChangeSubstage,
  onCompleteAction,
  onUpdateOperational,
}: {
  application: JobApplication;
  todayKey: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  onChangeStage: (
    stage: ApplicationStage,
    substage?: ApplicationSubstage,
  ) => void | Promise<void>;
  onChangeSubstage: (
    substage: ApplicationSubstage | undefined,
  ) => void | Promise<void>;
  onCompleteAction: () => void | Promise<void>;
  onUpdateOperational: (
    changes: OperationalChanges,
  ) => void | Promise<void>;
}) {
  const closed = applicationIsClosed(application);
  const previousStage = previousPipelineStage(application.stage);
  const nextStage = nextPipelineStage(application.stage);
  const dueStatus = closed ? null : nextActionStatus(application, todayKey);
  const suggestedAction = recommendedLifecycleAction(application);
  const substages = APPLICATION_SUBSTAGES_BY_STAGE[application.stage];
  const contact = [application.contactName, application.contactEmail]
    .filter(Boolean)
    .join(' · ');
  const hasImportantDates =
    application.deadline !== undefined ||
    application.appliedAt !== undefined ||
    application.interviewAt !== undefined ||
    application.offerAt !== undefined ||
    application.closedAt !== undefined;

  const [moreOpen, setMoreOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [actionEditing, setActionEditing] = useState(false);
  const [notesEditing, setNotesEditing] = useState(false);
  const [datesEditing, setDatesEditing] = useState(false);
  const [nextActionDraft, setNextActionDraft] = useState(
    application.nextAction ?? '',
  );
  const [nextActionAtDraft, setNextActionAtDraft] = useState(
    application.nextActionAt ?? '',
  );
  const [notesDraft, setNotesDraft] = useState(application.notes ?? '');
  const [deadlineDraft, setDeadlineDraft] = useState(
    application.deadline ?? '',
  );
  const [appliedAtDraft, setAppliedAtDraft] = useState(
    application.appliedAt ?? '',
  );
  const [interviewAtDraft, setInterviewAtDraft] = useState(
    application.interviewAt ?? '',
  );
  const [offerAtDraft, setOfferAtDraft] = useState(application.offerAt ?? '');

  useEffect(() => {
    setNextActionDraft(application.nextAction ?? '');
    setNextActionAtDraft(application.nextActionAt ?? '');
    setNotesDraft(application.notes ?? '');
    setDeadlineDraft(application.deadline ?? '');
    setAppliedAtDraft(application.appliedAt ?? '');
    setInterviewAtDraft(application.interviewAt ?? '');
    setOfferAtDraft(application.offerAt ?? '');
  }, [application]);

  async function saveNextAction() {
    await onUpdateOperational({
      nextAction: nextActionDraft,
      nextActionAt: nextActionAtDraft,
    });
    setActionEditing(false);
  }

  async function saveNotes() {
    await onUpdateOperational({ notes: notesDraft });
    setNotesEditing(false);
  }

  async function saveDates() {
    await onUpdateOperational({
      deadline: deadlineDraft,
      appliedAt: appliedAtDraft,
      interviewAt: interviewAtDraft,
      offerAt: offerAtDraft,
    });
    setDatesEditing(false);
  }

  return (
    <div
      className="grid gap-5"
      aria-label={`${application.company} application detail`}
    >
      <div>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={15} />
          Back to pipeline
        </Button>
      </div>

      <SectionHeader
        title={application.role}
        description={application.company}
        action={
          <div className="relative flex items-center gap-1.5">
            {application.jobUrl !== undefined ? (
              <a
                className="inline-flex h-9 items-center gap-1.5 rounded-control border border-app-border px-3 text-[13px] font-medium text-app-ink hover:bg-app-muted"
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open job
                <ExternalLink aria-hidden="true" size={13} />
              </a>
            ) : null}
            <Button variant="default" onClick={onEdit}>
              <Pencil aria-hidden="true" size={14} />
              Edit job
            </Button>
            <Button
              variant="ghost"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-label="More application actions"
              onClick={() => setMoreOpen((current) => !current)}
            >
              <MoreHorizontal aria-hidden="true" size={16} />
            </Button>
            {moreOpen ? (
              <div
                className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-control border border-app-border bg-app-surface p-1 shadow-sm"
                role="menu"
              >
                <button
                  className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left text-[13px] font-medium text-app-danger hover:bg-app-danger-soft"
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMoreOpen(false);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 aria-hidden="true" size={14} />
                  Delete job
                </button>
              </div>
            ) : null}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium">
        <span className="rounded-control border border-app-border px-2 py-1 text-app-ink">
          {STAGE_LABELS[application.stage]}
        </span>
        {application.substage !== undefined ? (
          <span className="rounded-control border border-app-border px-2 py-1 text-app-text">
            {SUBSTAGE_LABELS[application.substage]}
          </span>
        ) : null}
        {application.priority !== undefined ? (
          <span className="rounded-control border border-app-border px-2 py-1 text-app-text">
            {PRIORITY_LABELS[application.priority]}
          </span>
        ) : null}
      </div>

      {deleteConfirmOpen ? (
        <div
          className="grid gap-3 rounded-control border border-app-danger/30 bg-app-danger-soft p-3"
          role="alertdialog"
          aria-label="Delete application confirmation"
        >
          <div className="grid gap-1">
            <p className="m-0 text-sm font-semibold text-app-danger">
              Delete this application?
            </p>
            <p className="m-0 text-[13px] text-app-text">
              {application.company} · {application.role}. This removes its notes
              and application history.
            </p>
          </div>
          <ActionRow>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void onDelete()}>
              Delete job
            </Button>
          </ActionRow>
        </div>
      ) : null}

      <div className="grid gap-5 border-t border-app-border pt-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] xl:gap-8">
        <div className="grid content-start gap-4">
          <DetailBlock
            title="Next action"
            action={
              !closed && !actionEditing ? (
                <Button variant="ghost" onClick={() => setActionEditing(true)}>
                  Edit
                </Button>
              ) : null
            }
          >
            {actionEditing ? (
              <div className="grid gap-3">
                <TextField
                  label="Next action"
                  value={nextActionDraft}
                  onChange={(event) => setNextActionDraft(event.target.value)}
                />
                <TextField
                  label="Next action date"
                  type="date"
                  value={nextActionAtDraft}
                  onChange={(event) => setNextActionAtDraft(event.target.value)}
                />
                <ActionRow>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setNextActionDraft(application.nextAction ?? '');
                      setNextActionAtDraft(application.nextActionAt ?? '');
                      setActionEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => void saveNextAction()}>
                    Save action
                  </Button>
                </ActionRow>
              </div>
            ) : (
              <>
                {application.nextAction !== undefined ? (
                  <p className="m-0 text-base font-semibold text-app-ink">
                    {application.nextAction}
                  </p>
                ) : suggestedAction !== null ? (
                  <div className="grid gap-1">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-app-subtle">
                      Suggested next
                    </span>
                    <p className="m-0 text-sm font-medium text-app-text">
                      {suggestedAction}
                    </p>
                  </div>
                ) : (
                  <p className="m-0 text-sm text-app-subtle">
                    Lifecycle complete.
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-[13px] text-app-subtle">
                  {dueStatus !== null ? (
                    <span className="rounded-control border border-app-warning/30 bg-app-warning-soft px-2 py-1 text-app-warning">
                      {dueStatus}
                    </span>
                  ) : null}
                  {application.nextActionAt !== undefined && dueStatus === null ? (
                    <span>Due {displayDate(application.nextActionAt)}</span>
                  ) : null}
                  {application.deadline !== undefined ? (
                    <span>
                      Application deadline {displayDate(application.deadline)}
                    </span>
                  ) : null}
                </div>
                {applicationHasCompletableAction(application) ? (
                  <ActionRow>
                    <Button
                      variant="primary"
                      onClick={() => void onCompleteAction()}
                    >
                      Mark done
                    </Button>
                  </ActionRow>
                ) : null}
              </>
            )}
          </DetailBlock>

          <DetailBlock title="Pipeline">
            <ProgressTrack application={application} />

            {substages.length > 0 ? (
              <SelectField
                label="Lifecycle detail"
                value={application.substage ?? ''}
                onChange={(event) =>
                  void onChangeSubstage(
                    event.target.value === ''
                      ? undefined
                      : (event.target.value as ApplicationSubstage),
                  )
                }
              >
                {!closed ? <option value="">No lifecycle detail</option> : null}
                {substages.map((substage) => (
                  <option value={substage} key={substage}>
                    {SUBSTAGE_LABELS[substage]}
                  </option>
                ))}
              </SelectField>
            ) : null}

            {!closed ? (
              <div className="grid gap-3">
                <ActionRow>
                  {previousStage !== null ? (
                    <Button
                      variant="ghost"
                      onClick={() => void onChangeStage(previousStage)}
                    >
                      ← {STAGE_LABELS[previousStage]}
                    </Button>
                  ) : null}
                  {nextStage !== null ? (
                    <Button
                      variant="primary"
                      onClick={() =>
                        void onChangeStage(
                          nextStage,
                          defaultSubstageForStage(nextStage),
                        )
                      }
                    >
                      {stageActionLabel(nextStage)}
                    </Button>
                  ) : null}
                  {application.stage === 'offer' ? (
                    <Button
                      variant="primary"
                      onClick={() => void onChangeStage('closed', 'accepted')}
                    >
                      Mark accepted
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    aria-expanded={closeOpen}
                    onClick={() => setCloseOpen((current) => !current)}
                  >
                    Close opportunity
                  </Button>
                </ActionRow>

                {closeOpen ? (
                  <div className="grid gap-2 border-l-2 border-app-border pl-3">
                    <span className="text-[13px] text-app-subtle">
                      Record a terminal outcome without advancing the pipeline.
                    </span>
                    <ActionRow>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          void onChangeStage('closed', 'rejected')
                        }
                      >
                        Mark rejected
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          void onChangeStage('closed', 'withdrawn')
                        }
                      >
                        Withdraw
                      </Button>
                    </ActionRow>
                  </div>
                ) : null}
              </div>
            ) : null}
          </DetailBlock>

          <DetailBlock title="Activity">
            <ol className="m-0 grid list-none gap-3 p-0">
              {[...application.stageHistory].reverse().map((entry, index) => (
                <li
                  className="grid gap-1 border-l-2 border-app-border pl-3"
                  key={`${entry.enteredAt}-${entry.stage}-${index}`}
                >
                  <span className="text-sm font-medium text-app-ink">
                    {entry.substage === undefined
                      ? STAGE_LABELS[entry.stage]
                      : SUBSTAGE_LABELS[entry.substage]}
                  </span>
                  <span className="text-[13px] text-app-subtle">
                    {STAGE_LABELS[entry.stage]} · {displayDate(entry.enteredAt)}
                  </span>
                </li>
              ))}
            </ol>
          </DetailBlock>

          <DetailBlock
            title="Notes"
            action={
              !notesEditing ? (
                <Button variant="ghost" onClick={() => setNotesEditing(true)}>
                  Edit
                </Button>
              ) : null
            }
          >
            {notesEditing ? (
              <div className="grid gap-3">
                <TextareaField
                  label="Notes"
                  value={notesDraft}
                  onChange={(event) => setNotesDraft(event.target.value)}
                />
                <ActionRow>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setNotesDraft(application.notes ?? '');
                      setNotesEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => void saveNotes()}>
                    Save notes
                  </Button>
                </ActionRow>
              </div>
            ) : application.notes !== undefined ? (
              <p className="m-0 whitespace-pre-wrap text-sm leading-6 text-app-text">
                {application.notes}
              </p>
            ) : (
              <p className="m-0 text-sm text-app-subtle">No notes yet.</p>
            )}
          </DetailBlock>
        </div>

        <div className="grid content-start gap-4 xl:border-l xl:border-app-border xl:pl-8">
          <DetailBlock
            title="Important dates"
            action={
              !datesEditing ? (
                <Button variant="ghost" onClick={() => setDatesEditing(true)}>
                  Edit
                </Button>
              ) : null
            }
          >
            {datesEditing ? (
              <div className="grid gap-3">
                <TextField
                  label="Application deadline"
                  type="date"
                  value={deadlineDraft}
                  onChange={(event) => setDeadlineDraft(event.target.value)}
                />
                <TextField
                  label="Applied date"
                  type="date"
                  value={appliedAtDraft}
                  onChange={(event) => setAppliedAtDraft(event.target.value)}
                />
                <TextField
                  label="Interview date"
                  type="date"
                  value={interviewAtDraft}
                  onChange={(event) => setInterviewAtDraft(event.target.value)}
                />
                <TextField
                  label="Offer date"
                  type="date"
                  value={offerAtDraft}
                  onChange={(event) => setOfferAtDraft(event.target.value)}
                />
                <ActionRow>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDeadlineDraft(application.deadline ?? '');
                      setAppliedAtDraft(application.appliedAt ?? '');
                      setInterviewAtDraft(application.interviewAt ?? '');
                      setOfferAtDraft(application.offerAt ?? '');
                      setDatesEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => void saveDates()}>
                    Save dates
                  </Button>
                </ActionRow>
              </div>
            ) : hasImportantDates ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {application.deadline !== undefined ? (
                  <DetailValue label="Deadline">
                    {displayDate(application.deadline)}
                  </DetailValue>
                ) : null}
                {application.appliedAt !== undefined ? (
                  <DetailValue label="Applied">
                    {displayDate(application.appliedAt)}
                  </DetailValue>
                ) : null}
                {application.interviewAt !== undefined ? (
                  <DetailValue label="Interview">
                    {displayDate(application.interviewAt)}
                  </DetailValue>
                ) : null}
                {application.offerAt !== undefined ? (
                  <DetailValue label="Offer">
                    {displayDate(application.offerAt)}
                  </DetailValue>
                ) : null}
                {application.closedAt !== undefined ? (
                  <DetailValue label="Closed">
                    {displayDate(application.closedAt)}
                  </DetailValue>
                ) : null}
              </div>
            ) : (
              <p className="m-0 text-sm text-app-subtle">
                Dates are captured as this opportunity advances.
              </p>
            )}
          </DetailBlock>

          <DetailBlock title="Job context">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {application.source !== undefined ? (
                <DetailValue label="Source">{application.source}</DetailValue>
              ) : null}
              {contact !== '' ? (
                <DetailValue label="Contact">{contact}</DetailValue>
              ) : null}
              {application.jobUrl !== undefined ? (
                <DetailValue label="Job posting">
                  <a
                    className="inline-flex items-center gap-1 font-medium text-app-ink underline underline-offset-4"
                    href={application.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open job
                    <ExternalLink aria-hidden="true" size={13} />
                  </a>
                </DetailValue>
              ) : null}
            </div>
          </DetailBlock>
        </div>
      </div>
    </div>
  );
}
