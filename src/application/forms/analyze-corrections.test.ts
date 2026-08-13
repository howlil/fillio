import { expect, it } from 'vitest';
import { createEmptyStoredProfile } from '../../domain/profile/create-empty-profile';
import { analyzeFieldContexts } from './analyze-field-contexts';

it('uses a stored ignore decision during analysis', () => {
  const profile = createEmptyStoredProfile().baseProfile;
  const context = {
    controlKind: 'input' as const,
    inputType: 'text',
    label: 'Name',
    name: '',
    id: '',
    placeholder: '',
    ariaLabel: '',
    options: [],
    sectionText: '',
    origin: 'https://jobs.example.test',
    formFingerprint: 'form-1',
    fieldFingerprint: 'field-1',
  };
  const result = analyzeFieldContexts([context], profile, [
    {
      origin: context.origin,
      formFingerprint: context.formFingerprint,
      fieldFingerprint: context.fieldFingerprint,
      target: 'ignore',
      updatedAt: '2026-08-13T12:00:00.000Z',
    },
  ]);
  expect(result.summary).toMatchObject({ needsReview: 0, unknown: 1 });
});
