import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { JobApplication } from '../../domain/applications/application-schema';
import { ApplicationDetail } from './ApplicationDetail';

function renderDetail(
  application: JobApplication,
  overrides: Partial<React.ComponentProps<typeof ApplicationDetail>> = {},
) {
  const props: React.ComponentProps<typeof ApplicationDetail> = {
    application,
    todayKey: '2026-09-07',
    onBack: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onChangeStage: vi.fn(),
    onChangeSubstage: vi.fn(),
    onCompleteAction: vi.fn(),
    onUpdateOperational: vi.fn(),
    ...overrides,
  };

  render(<ApplicationDetail {...props} />);
  return props;
}

const activeApplication: JobApplication = {
  id: 'app-1',
  company: 'Gojek',
  role: 'Backend Engineer',
  stage: 'applied',
  substage: 'recruiter_review',
  stageHistory: [
    {
      stage: 'applied',
      substage: 'recruiter_review',
      enteredAt: '2026-09-01T00:00:00.000Z',
    },
  ],
  nextAction: 'Follow up recruiter',
  nextActionAt: '2026-09-07',
  notes: 'Waiting for recruiter response.',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};

describe('ApplicationDetail', () => {
  it('uses actual stage history for a closed opportunity', () => {
    renderDetail({
      ...activeApplication,
      stage: 'closed',
      substage: 'rejected',
      stageHistory: [
        {
          stage: 'saved',
          enteredAt: '2026-08-29T00:00:00.000Z',
        },
        {
          stage: 'applied',
          substage: 'submitted',
          enteredAt: '2026-08-31T00:00:00.000Z',
        },
        {
          stage: 'closed',
          substage: 'rejected',
          enteredAt: '2026-09-05T00:00:00.000Z',
        },
      ],
      closedAt: '2026-09-05',
    });

    expect(screen.getByLabelText('Saved reached')).not.toBeNull();
    expect(screen.getByLabelText('Applied reached')).not.toBeNull();
    expect(screen.getByLabelText('Interview not reached')).not.toBeNull();
    expect(screen.getByLabelText('Offer not reached')).not.toBeNull();
    expect(screen.getByText('Closed after Applied · Rejected.')).not.toBeNull();
  });

  it('persists next-action edits from the execution surface', () => {
    const onUpdateOperational = vi.fn();
    renderDetail(activeApplication, { onUpdateOperational });

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]!);
    fireEvent.change(screen.getByLabelText('Next action'), {
      target: { value: 'Send recruiter follow-up' },
    });
    fireEvent.change(screen.getByLabelText('Next action date'), {
      target: { value: '2026-09-08' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save action' }));

    expect(onUpdateOperational).toHaveBeenCalledWith({
      nextAction: 'Send recruiter follow-up',
      nextActionAt: '2026-09-08',
    });
  });

  it('requires explicit confirmation before deleting a job', () => {
    const onDelete = vi.fn();
    renderDetail(activeApplication, { onDelete });

    fireEvent.click(
      screen.getByRole('button', { name: 'More application actions' }),
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete job' }));

    expect(onDelete).not.toHaveBeenCalled();
    expect(
      screen.getByRole('alertdialog', {
        name: 'Delete application confirmation',
      }),
    ).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Delete job' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
