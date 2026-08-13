import type {
  ControlKind,
  FieldContext,
  FieldOption,
} from '../../domain/forms/field-context';
import { createFieldFingerprint } from '../../domain/forms/fingerprints';
import { normalizeFieldText } from '../../domain/matching/normalize-field-text';

type LiveControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type ScannedDomField = {
  context: FieldContext;
  controls: LiveControl[];
};

const UNSUPPORTED_INPUT_TYPES = new Set([
  'hidden',
  'submit',
  'button',
  'reset',
  'image',
]);

function hashText(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function cleanText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function inputType(control: LiveControl): string {
  if (control instanceof HTMLInputElement) {
    return control.type || 'text';
  }
  return control instanceof HTMLTextAreaElement ? 'textarea' : 'select';
}

function controlKind(control: LiveControl): ControlKind {
  if (control instanceof HTMLTextAreaElement) return 'textarea';
  if (control instanceof HTMLSelectElement) return 'select';
  if (control.type === 'checkbox') return 'checkbox';
  if (control.type === 'radio') return 'radio';
  if (control.type === 'file') return 'file';
  return 'input';
}

function explicitLabel(control: LiveControl): string {
  if (control.id) {
    const labels = control.ownerDocument.querySelectorAll('label');
    const matching = Array.from(labels).find(
      (label) => label.htmlFor === control.id,
    );
    if (matching !== undefined) return cleanText(matching.textContent);
  }

  return cleanText(control.closest('label')?.textContent);
}

function radioGroupLabel(control: HTMLInputElement): string {
  const fieldset = control.closest('fieldset');
  const legend = fieldset?.querySelector(':scope > legend');
  return cleanText(legend?.textContent) || explicitLabel(control);
}

function optionLabel(control: HTMLInputElement): string {
  return explicitLabel(control) || control.value;
}

function selectOptions(control: HTMLSelectElement): FieldOption[] {
  return Array.from(control.options).map((option) => ({
    value: option.value,
    label: cleanText(option.textContent),
  }));
}

function sectionText(control: LiveControl): string {
  const container = control.closest('section, article, fieldset, form');
  if (container === null) return '';

  const heading = container.querySelector(
    ':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > legend',
  );
  return cleanText(heading?.textContent);
}

function formFingerprint(control: LiveControl): string {
  const form = control.closest('form');
  const scope: ParentNode = form ?? control.ownerDocument;
  const descriptors = Array.from(
    scope.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('input, textarea, select'),
  )
    .filter(
      (candidate) =>
        !(candidate instanceof HTMLInputElement) ||
        !UNSUPPORTED_INPUT_TYPES.has(candidate.type),
    )
    .map((candidate) =>
      [
        candidate.tagName.toLowerCase(),
        inputType(candidate),
        normalizeFieldText(candidate.getAttribute('name') ?? ''),
        normalizeFieldText(explicitLabel(candidate)),
      ].join(':'),
    );

  const action = form?.getAttribute('action') ?? '';
  const method = form?.getAttribute('method') ?? '';
  return `form_${hashText(`${action}::${method}::${descriptors.join('|')}`)}`;
}

function baseContext(
  control: LiveControl,
  origin: string,
  options: FieldOption[],
  label: string,
): FieldContext {
  const context: FieldContext = {
    controlKind: controlKind(control),
    inputType: inputType(control),
    label,
    name: control.getAttribute('name') ?? '',
    id: control.id,
    placeholder: control.getAttribute('placeholder') ?? '',
    ariaLabel: control.getAttribute('aria-label') ?? '',
    options,
    sectionText: sectionText(control),
    origin,
    formFingerprint: formFingerprint(control),
    fieldFingerprint: '',
  };

  return {
    ...context,
    fieldFingerprint: createFieldFingerprint(context),
  };
}

function isSupported(control: LiveControl): boolean {
  if (control instanceof HTMLInputElement) {
    return !UNSUPPORTED_INPUT_TYPES.has(control.type);
  }
  return true;
}

export function scanDomFields(
  root: ParentNode,
  origin: string,
): ScannedDomField[] {
  const controls = Array.from(
    root.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >('input, textarea, select'),
  ).filter(isSupported);

  const fields: ScannedDomField[] = [];
  const handledRadioGroups = new Set<string>();

  for (const control of controls) {
    if (control instanceof HTMLInputElement && control.type === 'radio') {
      const formKey = formFingerprint(control);
      const groupKey = `${formKey}::${control.name || control.id}`;
      if (handledRadioGroups.has(groupKey)) continue;
      handledRadioGroups.add(groupKey);

      const groupControls = controls.filter(
        (candidate): candidate is HTMLInputElement =>
          candidate instanceof HTMLInputElement &&
          candidate.type === 'radio' &&
          formFingerprint(candidate) === formKey &&
          candidate.name === control.name,
      );
      const options = groupControls.map((candidate) => ({
        value: candidate.value,
        label: optionLabel(candidate),
      }));
      fields.push({
        context: baseContext(
          control,
          origin,
          options,
          radioGroupLabel(control),
        ),
        controls: groupControls,
      });
      continue;
    }

    const options =
      control instanceof HTMLSelectElement ? selectOptions(control) : [];
    fields.push({
      context: baseContext(control, origin, options, explicitLabel(control)),
      controls: [control],
    });
  }

  return fields;
}

export function extractFieldContexts(
  root: ParentNode,
  origin: string,
): FieldContext[] {
  return scanDomFields(root, origin).map((field) => field.context);
}
