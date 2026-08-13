# Product Requirements

## 1. Product goal

Fillio reduces repetitive data entry in job applications. The user maintains one canonical career profile. When a career/application form is detected, Fillio maps visible form fields to canonical profile fields, recommends the most relevant application variant, and offers safe autofill.

MVP success is not "support every ATS". MVP success is: on ordinary career forms, Fillio reliably recognizes and fills a useful majority of factual fields while never silently submitting or leaking sensitive data.

## 2. Product principles

- Local-first by default.
- User remains in control of every fill operation.
- Deterministic behavior before AI.
- Facts may be autofilled; subjective/generated answers require separate treatment.
- Sensitive data requires explicit opt-in and explicit disclosure confirmation.
- Generic web-form support first; site-specific adapters only after evidence that the generic engine cannot handle a platform.
- Schema completeness may exceed MVP UI completeness. Progressive disclosure keeps onboarding usable.

## 3. MVP user journey

1. User installs the Chromium extension.
2. User creates a base career profile manually.
3. User may create one or more application variants, for example Backend Engineer and DevOps Engineer.
4. User opens a career/application page.
5. Fillio automatically scans relevant form controls and page context.
6. A small floating control appears when Fillio has useful recognized fields. The toolbar popup exposes detail and profile controls.
7. Fillio recommends an application variant from page/job context using deterministic keyword scoring. User may change it.
8. Fillio summarizes fields as Ready, Needs review, Unknown, and Sensitive.
9. User chooses Fill.
10. High-confidence safe fields are filled. Medium-confidence mappings require review. Low-confidence fields remain untouched.
11. Sensitive fields are filled only if the vault is enabled, unlocked, and the user explicitly approves disclosure to the current site.
12. Fillio never submits the form.
13. When a multi-step/dynamic form changes, Fillio automatically re-scans relevant DOM changes and offers newly recognized fields.

## 4. Functional requirements

### FR-01 Canonical career profile

The data model must support these categories from the beginning, even if some sections are initially hidden behind "Additional information":

- Personal: legal/preferred names, gender, birth place/date, nationality, marital status.
- Contact: emails, phones, WhatsApp, address, city/province/state, country, postal code.
- Identity: national ID/NIK, passport, tax ID/NPWP, other government IDs.
- Links: LinkedIn, GitHub, portfolio, personal websites, other profile URLs.
- Professional: headline, summary, experiences, education, skills, languages, certifications, projects, awards, organizations, volunteering, publications.
- Job preferences: desired roles, employment types, work arrangements, preferred locations, relocation, travel, availability, notice period.
- Compensation: current/expected compensation, currency, pay period, negotiable flag.
- Work eligibility: citizenship, authorization, visa status, sponsorship requirement.
- Documents metadata: resumes, cover letters, transcripts, certificates, photo, other documents.
- References, family/emergency contact, driving licences, physical information, country-specific demographic information.
- Reusable custom answers.

Repeated entities must be arrays/records. Do not model experience or education as numbered fields such as `company1`, `company2`.

### FR-02 Base profile + application variants

- There is one factual base profile.
- Application variants contain only contextual overrides/preferences, not full copies of the base profile.
- A resolved application profile is `base + selected variant overrides`.
- Typical variant data: target roles, headline/summary override, emphasized skills, preferred resume metadata, preferred cover letter metadata, compensation/location preferences, reusable answers.

### FR-03 Progressive profile UI

- Initial profile editing prioritizes Basic, Contact, Experience, Education, Skills, Links, Job Preferences.
- Less common/sensitive fields remain available under additional sections.
- Manual profile entry is the MVP ingestion path.
- Resume/CV import is a future ingestion adapter that must write into the same canonical profile rather than creating a parallel data model.

### FR-04 Automatic career-form detection

- Content logic detects useful application forms without requiring the user to click the toolbar first.
- Detection must not assume a particular ATS vendor.
- If there is no useful recognized form, Fillio should stay unobtrusive.

### FR-05 Floating UI + extension popup

- Floating UI provides the fast action: recognized field count, selected/recommended variant, review/fill action.
- Toolbar popup provides details: profile state, mapping summary, variant selection, vault state, skipped/review fields.
- Injected UI must be isolated from host-page CSS and must not break page layout.

### FR-06 Field discovery and context extraction

For supported controls, capture enough context to classify meaning:

- element tag/type
- label text, including associated and nearby labels
- name/id
- placeholder
- aria-label/accessible name when available
- select/radio options
- nearby section/question text when necessary

MVP controls: text-like input, textarea, select, checkbox, radio, common date inputs. File inputs are detected but not programmatically filled in MVP.

### FR-07 Field mapping

Mapping priority:

1. user site-specific correction/override
2. exact canonical/alias match
3. deterministic heuristic/fuzzy match
4. unknown

The matcher returns a canonical field, confidence band, evidence/reason, and sensitivity classification. Do not represent confidence as fake probability unless it is calibrated from data.

### FR-08 Confidence behavior

- High/Ready: eligible for fill after the user triggers Fill.
- Medium/Needs review: show recommendation and let user accept/change/skip.
- Low/Unknown: leave untouched.
- Numeric thresholds are configuration/test-corpus decisions, not hard-coded product requirements.

### FR-09 Site-specific correction memory

- User may correct a wrong mapping.
- Corrections are scoped to the relevant site/form/field fingerprint, not learned globally in MVP.
- Fingerprints must not depend only on fragile CSS selectors.
- Corrections take priority over the generic matcher.

### FR-10 Dynamic and multi-step forms

- Observe relevant DOM changes.
- Debounce/rescan rather than processing every mutation.
- Compare form/field fingerprints so unchanged content is not repeatedly processed.
- A new step may update the floating UI to indicate newly fillable fields.
- Rescan never implies automatic filling.

### FR-11 Generic autofill engine

- Generic DOM filling is the default.
- Correctly trigger the browser/page events needed by controlled form components where practical.
- The filler must be separate from matching and extraction logic.
- Site-specific adapters may be added only after a reproducible incompatibility is documented.

### FR-12 Variant recommendation

MVP recommendation is deterministic, using signals such as job title, page title, headings, and selected job-description keywords. It ranks available variants and suggests one; the user can always change it. Low-confidence recommendation falls back to the user's default/general variant rather than pretending certainty.

### FR-13 Sensitive Data Vault

- Vault is disabled by default.
- User explicitly enables it and creates a passphrase.
- Sensitive values are encrypted at rest.
- Passphrase is never stored.
- Vault unlock state expires after 30 minutes of Fillio inactivity.
- Forgetting the passphrase has no recovery in MVP; reset deletes encrypted sensitive data.
- Enabling/unlocking the vault does not grant blanket permission to disclose data.
- Before sensitive data is filled, show the current origin and the sensitive fields/values categories that will be disclosed. User approves or skips.
- Sensitive disclosure confirmation may be grouped for the current fill operation to avoid repeated prompts.

Sensitive examples include government IDs, passport/tax identifiers, date of birth where configured, compensation, family/reference details, demographic data, and sensitive documents.

### FR-14 Document handling

Recommended MVP boundary:

- Keep document metadata/variant preference in the profile.
- Detect file-upload questions and tell the user which configured document is preferred.
- Actual file selection/upload remains an explicit user action in MVP.
- Do not block the text-field MVP on automatic file upload.

### FR-15 No automatic submission

Fillio must not click Submit/Apply/Next on behalf of the user in MVP. Navigation and final submission remain explicit user actions.

### FR-16 No AI dependency in MVP

The core product must work with AI completely absent. AI/semantic models may later be added behind matcher/generative-answer boundaries for ambiguous classification and subjective questions, without changing canonical profile or filler contracts.

## 5. Non-functional requirements

### NFR-01 Privacy

- No backend and no account in MVP.
- No profile/field data leaves the device.
- No telemetry containing form values, profile values, page content, or sensitive identifiers.
- Any future network feature requires an explicit design change and user-visible consent.

### NFR-02 Security

- Use least extension permissions compatible with automatic detection.
- Never use remote executable code.
- Keep vault plaintext and unlock key material out of content-script storage.
- Treat host-page DOM/text as untrusted input.
- Never log sensitive values.

### NFR-03 Performance

- Page scanning must not materially degrade browsing.
- Mutation handling must be filtered/debounced.
- Matching should be pure/local and fast enough to run interactively.
- Do not keep a busy background loop.

### NFR-04 Reliability

- A failure to match one field must not abort the entire form scan/fill.
- Unknown or unsupported controls fail closed: skip them.
- User data persists across browser restarts except unlock session state.
- Stored schema is versioned and migratable.

### NFR-05 Maintainability

- Domain logic must not import React, WXT, `chrome.*`, or DOM APIs.
- Browser/storage/crypto APIs sit behind narrow adapters where replacement is expected.
- Scanner, extractor, matcher, filler, correction memory, variant recommendation, and vault remain separately testable.
- Avoid speculative framework layers.

### NFR-06 Accessibility and UX

- Popup/options/floating controls are keyboard accessible.
- Status is not communicated by color alone.
- Extension UI must not steal focus unexpectedly.
- Sensitive disclosure and destructive vault reset require explicit wording.

## 6. Explicit MVP non-goals

Do not build these unless the iteration state is deliberately changed:

- backend/account/cloud sync
- AI/LLM dependency
- job discovery/recommendation
- application tracker
- resume builder
- interview preparation
- automatic form submission
- global collaborative mapping learning
- automatic CV parsing
- automatic file upload
- Safari support
- sophisticated ATS-specific adapters without a failing test/case
- analytics platform

## 7. Initial browser support

Chrome/Chromium desktop first. Keep browser-specific APIs isolated so Firefox can be evaluated later. Cross-browser support is an architectural option, not an MVP acceptance criterion.

## 8. MVP acceptance outcome

A usable first release must demonstrate, on a small maintained corpus of real or representative career forms:

- profile creation and persistence
- base profile + variant resolution
- automatic form detection and floating UI
- deterministic field recognition with review/unknown states
- successful fill of common text/select/radio/checkbox/date fields
- dynamic-step rescan
- site-specific correction memory
- vault enable/unlock/auto-lock/encrypted persistence/sensitive disclosure confirmation
- no auto-submit and no network transmission of career data
