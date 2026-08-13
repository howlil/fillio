import { beforeEach, describe, expect, it } from 'vitest';
import { browser } from 'wxt/browser';
import { fakeBrowser } from 'wxt/testing/fake-browser';

import type { FieldCorrection } from '../../domain/corrections/correction-schema';
import {
  ChromeCorrectionRepository,
  CORRECTION_STORAGE_KEY,
} from './chrome-correction-repository';

function entry(overrides: Partial<FieldCorrection> = {}): FieldCorrection {
  return {
    origin: 'https://jobs.example.test',
    formFingerprint: 'form-a',
    fieldFingerprint: 'field-a',
    target: 'personal.legalName.first',
    updatedAt: '2026-08-13T12:00:00.000Z',
    ...overrides,
  };
}

describe('ChromeCorrectionRepository', () => {
  beforeEach(() => fakeBrowser.reset());

  it('returns an empty list when nothing is stored', async () => {
    const repository = new ChromeCorrectionRepository();
    await expect(repository.listForOrigin('https://jobs.example.test')).resolves.toEqual([]);
  });

  it('replaces only the same origin/form/field key', async () => {
    const repository = new ChromeCorrectionRepository();
    await repository.upsert(entry());
    await repository.upsert(entry({ fieldFingerprint: 'field-b', target: 'contact.email.primary' }));
    await repository.upsert(entry({ origin: 'https://other.example.test', target: 'links.github' }));
    await repository.upsert(entry({ target: 'contact.phone.primary', updatedAt: '2026-08-13T12:30:00.000Z' }));

    await expect(repository.listForOrigin('https://jobs.example.test')).resolves.toEqual([
      entry({ target: 'contact.phone.primary', updatedAt: '2026-08-13T12:30:00.000Z' }),
      entry({ fieldFingerprint: 'field-b', target: 'contact.email.primary' }),
    ]);
  });

  it('rejects malformed persisted data', async () => {
    await browser.storage.local.set({
      [CORRECTION_STORAGE_KEY]: { schemaVersion: 1, entries: [{}] },
    });
    const repository = new ChromeCorrectionRepository();
    await expect(repository.listForOrigin('https://jobs.example.test')).rejects.toThrow();
  });
});
