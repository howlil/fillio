import type { FillInstruction } from '../../application/prepare-fill/prepare-fill-plan';

export type FillResult = {
  fieldFingerprint: string;
  status: 'filled' | 'not-found' | 'unsupported';
};

export function applyFillInstructions(
  _root: ParentNode,
  _origin: string,
  _instructions: FillInstruction[],
): FillResult[] {
  throw new Error('Not implemented');
}
