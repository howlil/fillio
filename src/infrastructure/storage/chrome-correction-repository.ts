import { browser } from 'wxt/browser';

import type { CorrectionRepository } from '../../application/corrections/correction-repository';
import {
  createEmptyStoredCorrections,
  parseStoredCorrections,
  type FieldCorrection,
} from '../../domain/corrections/correction-schema';

export const CORRECTION_STORAGE_KEY = 'fillio.corrections';

export class ChromeCorrectionRepository implements CorrectionRepository {
  private async load() {
    const stored = await browser.storage.local.get(CORRECTION_STORAGE_KEY);
    const value = stored[CORRECTION_STORAGE_KEY];
    return value === undefined
      ? createEmptyStoredCorrections()
      : parseStoredCorrections(value);
  }

  async listForOrigin(origin: string): Promise<FieldCorrection[]> {
    const stored = await this.load();
    return stored.entries.filter((entry) => entry.origin === origin);
  }

  async upsert(correction: FieldCorrection): Promise<void> {
    const stored = await this.load();
    const entries = stored.entries.filter(
      (entry) =>
        entry.origin !== correction.origin ||
        entry.formFingerprint !== correction.formFingerprint ||
        entry.fieldFingerprint !== correction.fieldFingerprint,
    );
    entries.push(correction);
    await browser.storage.local.set({
      [CORRECTION_STORAGE_KEY]: { schemaVersion: 1, entries },
    });
  }
}
