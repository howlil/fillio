import type { FieldCorrection } from '../../domain/corrections/correction-schema';

export interface CorrectionRepository {
  listForOrigin(origin: string): Promise<FieldCorrection[]>;
  upsert(correction: FieldCorrection): Promise<void>;
}
