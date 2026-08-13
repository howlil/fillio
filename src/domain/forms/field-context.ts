export type ControlKind =
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file';

export type FieldOption = {
  value: string;
  label: string;
};

export type FieldContext = {
  controlKind: ControlKind;
  inputType: string;
  label: string;
  name: string;
  id: string;
  placeholder: string;
  ariaLabel: string;
  options: FieldOption[];
  sectionText: string;
  origin: string;
  formFingerprint: string;
  fieldFingerprint: string;
};
