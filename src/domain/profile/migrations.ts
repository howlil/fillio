import type { StoredProfileEnvelope } from './profile-schema';

export class UnsupportedProfileSchemaVersionError extends Error {}

export function parseStoredProfile(raw: unknown): StoredProfileEnvelope {
  void raw;
  throw new Error('Not implemented');
}
