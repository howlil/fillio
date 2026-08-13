# Iteration 2 — Generic Form Analysis and Safe Autofill

Execution mode: one short-lived task branch. Production behavior follows mandatory RED → GREEN → REFACTOR.

Goal: detect representative static career forms, extract serializable field context, map common factual fields deterministically, produce an explicit fill plan, and fill only user-authorized Ready fields without submitting the page.

## Scope

1. Serializable form/field domain contracts and fingerprints.
2. DOM scanner/extractor for text-like input, textarea, select, checkbox, radio, date, and file detection.
3. Normalization + Indonesian/English alias catalog for common factual career fields.
4. Deterministic matcher with Ready / Needs review / Unknown bands and explicit reasons.
5. Resolved-profile value lookup for supported canonical fields.
6. Fill-plan generation that separates Ready / Needs review / Unknown and never authorizes sensitive fields.
7. Generic DOM filler using native value setters and input/change events.
8. Content-script orchestration and isolated Shadow DOM floating control.
9. Popup current-page analysis summary through extension messaging.
10. Representative fixture corpus and Chromium end-to-end smoke verification.

## Non-scope

- dynamic MutationObserver rescan pipeline (Iteration 3)
- correction memory (Iteration 3)
- sensitive vault/disclosure (Iteration 4)
- site-specific ATS adapters
- AI/LLM
- automatic file upload
- automatic submit/next/apply clicks

## Acceptance criteria

- automatic content script detects a representative static career form
- common name/email/phone/location/LinkedIn/GitHub/headline fields are recognized deterministically
- high-confidence safe mappings can be filled only after explicit Fill action
- review/unknown/file/sensitive fields are not silently filled
- select/checkbox/radio/date filling is covered by deterministic tests where supported in the fixture corpus
- filling dispatches normal browser events and does not submit the form
- injected UI is isolated in Shadow DOM and stays hidden when no useful fields are recognized
- popup can show current-page Ready / Needs review / Unknown counts
- domain matcher/fill-plan logic contains no DOM/browser imports
- generated manifest permissions remain minimal and justified
- unit/UI tests, typecheck, lint, format, build, manifest checks, Chromium E2E, and package all pass

## TDD slices

### Slice 1 — form contracts, normalization, fingerprints
RED first for serializable FieldContext, normalization behavior, and stable fingerprints. GREEN with pure domain modules.

### Slice 2 — deterministic matcher
RED first for exact aliases, structured heuristic collisions, review state, unknown state, and sensitive fail-closed behavior. GREEN with centralized alias/config tables.

### Slice 3 — resolved value lookup + fill plan
RED first for supported canonical values, missing values, review/unknown exclusion, file detection, and sensitive exclusion. GREEN with pure application/domain logic.

### Slice 4 — DOM extractor + filler
RED first with jsdom fixtures for labels/name/id/placeholder/aria/options and native event behavior for text/select/checkbox/radio/date. GREEN in infrastructure/dom only.

### Slice 5 — content script + floating UI + popup messaging
RED first for analysis summary/fill action orchestration. GREEN with WXT content script running in isolated world and a Shadow DOM mount.

### Slice 6 — Chromium acceptance corpus
Build representative static career-form fixtures and verify extension detection, isolated floating control, explicit fill, no-submit behavior, popup summary, and persistence/profile integration in real Chromium.

## Implementation constraints

- raw DOM elements never cross into domain/application matching contracts
- content script does not own profile persistence rules; it reads through the existing repository boundary
- matching never mutates DOM
- filler never decides semantics
- no site hostname branches
- no network calls
- no auto-submit
- broad content-script match scope, if required for automatic detection, is the only new host-access surface and must be asserted in manifest verification
