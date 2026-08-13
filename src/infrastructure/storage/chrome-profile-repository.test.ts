import { beforeEach, describe, expect, it } from 'vitest';
import { browser } from 'wxt/browser';
import { fakeBrowser } from 'wxt/testing/fake-browser';

import { createEmptyStoredProfile } from '../../domain/profile/create-empty-profile';
import {
  ChromeProfileRepository,
  PROFILE_STORAGE_KEY,
} from './chrome-profile-repository';

describe('ChromeProfileRepository', () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it('returns null when no profile has been persisted', async () => {
    const repository = new ChromeProfileRepository();

    await expect(repository.load()).resolves.toBeNull();
  });

  it('round-trips a schema-valid profile through local extension storage', async () => {
    const repository = new ChromeProfileRepository();
    const profile = createEmptyStoredProfile('2026-08-13T00:00:00.000Z');
    profile.baseProfile.personal.legalName.first = 'Ulil';

    await repository.save(profile);

    await expect(repository.load()).resolves.toEqual(profile);
  });

  it('rejects invalid persisted payload instead of passing corrupted data through', async () => {
    await browser.storage.local.set({
      [PROFILE_STORAGE_KEY]: {
        schemaVersion: 1,
        baseProfile: {},
        variants: [],
        preferences: {},
        metadata: {},
      },
    });

    const repository = new ChromeProfileRepository();

    await expect(repository.load()).rejects.toThrow();
  });
});
