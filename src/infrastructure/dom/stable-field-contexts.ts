import type { FieldContext } from '../../domain/forms/field-context';
import { scanDomFields } from './extract-field-contexts';

function hashText(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function clean(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function stableFormFingerprint(control: Element): string {
  const form = control.closest('form');
  if (form === null) return `form_${hashText('document')}`;

  const heading = form.querySelector(
    ':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > legend',
  );
  const identity = [
    form.id,
    form.getAttribute('name'),
    form.getAttribute('action'),
    form.getAttribute('method'),
    form.getAttribute('aria-label'),
    heading?.textContent,
  ].map(clean);

  if (identity.every((part) => part === '')) {
    const forms = Array.from(control.ownerDocument.querySelectorAll('form'));
    identity.push(`index:${forms.indexOf(form)}`);
  }

  return `form_${hashText(identity.join('::'))}`;
}

export function extractStableFieldContexts(
  root: ParentNode,
  origin: string,
): FieldContext[] {
  return scanDomFields(root, origin).map((field) => {
    const control = field.controls[0];
    if (control === undefined) return field.context;
    return {
      ...field.context,
      formFingerprint: stableFormFingerprint(control),
    };
  });
}
