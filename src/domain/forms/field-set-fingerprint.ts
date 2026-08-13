import type { FieldContext } from './field-context';

export function createFieldSetFingerprint(fields: FieldContext[]): string {
  return fields
    .map((field) => `${field.formFingerprint}:${field.fieldFingerprint}`)
    .sort()
    .join('|');
}
