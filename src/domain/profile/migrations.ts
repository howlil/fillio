import {
  StoredProfileEnvelopeSchema,
  type StoredProfileEnvelope,
} from './profile-schema';

export class UnsupportedProfileSchemaVersionError extends Error {
  constructor(readonly schemaVersion: number) {
    super(`Unsupported profile schema version: ${schemaVersion}`);
    this.name = 'UnsupportedProfileSchemaVersionError';
  }
}

function readSchemaVersion(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) {
    return undefined;
  }

  return Reflect.get(raw, 'schemaVersion');
}

export function parseStoredProfile(raw: unknown): StoredProfileEnvelope {
  const schemaVersion = readSchemaVersion(raw);

  if (typeof schemaVersion === 'number' && schemaVersion !== 1) {
    throw new UnsupportedProfileSchemaVersionError(schemaVersion);
  }

  return StoredProfileEnvelopeSchema.parse(raw);
}
