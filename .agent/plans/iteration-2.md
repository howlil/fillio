# Iteration 2 — Generic Form Analysis and Safe Autofill

Status: completed and verified.

Execution mode: one short-lived task branch. Production behavior followed mandatory RED → GREEN → REFACTOR.

Goal achieved: detect representative static career forms, extract serializable field context, map common factual fields deterministically, produce an explicit fill plan, and fill only user-authorized Ready fields without submitting the page.

## Delivered scope

1. Serializable form/field domain contracts and stable semantic fingerprints.
2. DOM scanner/extractor for text-like input, textarea, select, checkbox, radio, date, and file detection.
3. Normalization + Indonesian/English alias catalog for common factual career fields.
4. Deterministic matcher with Ready / Needs review / Unknown bands and explicit reasons.
5. Resolved-profile value lookup for supported canonical fields.
6. Fill-plan generation that separates Ready / Needs review / Unknown and never authorizes sensitive fields.
7. Generic DOM filler using native value setters and input/change events.
8. Content-script orchestration and isolated Shadow DOM floating control.
9. Popup current-page analysis summary through extension messaging.
10. Representative static career-form fixture and Chromium end-to-end verification.

## Non-scope preserved

- dynamic MutationObserver rescan pipeline (Iteration 3)
- correction memory (Iteration 3)
- sensitive vault/disclosure (Iteration 4)
- site-specific ATS adapters
- AI/LLM
- automatic file upload
- automatic submit/next/apply clicks

## Acceptance evidence

- automatic content script detects the representative static career form in Chromium
- common name/email/phone/location/LinkedIn/GitHub fields are recognized deterministically
- high-confidence safe mappings fill only after explicit Fill action
- review/unknown/file/sensitive fields are not silently filled
- text/textarea/select/checkbox/radio/date filling primitives have deterministic adapter tests
- filling dispatches normal browser events and the Chromium fixture records zero form submissions
- in-page UI is mounted through WXT Shadow DOM UI infrastructure and remains absent when no useful fields are recognized
- popup current-page Ready / Needs review / Unknown rendering is unit tested; real content-script summary messaging is Chromium verified
- domain matcher/fill-plan contracts contain no DOM/browser objects
- generated manifest keeps normal extension permissions at `storage`, has no separate `host_permissions`, and explicitly verifies only HTTP/HTTPS content-script matches
- 43 unit/UI tests, typecheck, lint, format, production build, manifest checks, Chromium E2E, and package all pass in read-only CI

## TDD execution record

### Slice 1 — form contracts, normalization, fingerprints

RED: tests introduced serializable context, normalization, and stable fingerprint expectations before implementation.

GREEN: pure domain contracts, normalization, and semantic fingerprinting implemented.

### Slice 2 — deterministic matcher

RED: exact/common aliases, bilingual mapping, structured signals, ambiguity, sensitive fail-closed behavior, and unknown cases failed before implementation.

GREEN: centralized deterministic aliases/config and conservative matcher implemented.

### Slice 3 — resolved value lookup + fill plan

RED: fill-plan test required available Ready values while excluding review, unknown, and missing-profile values.

GREEN: explicit fill-plan generation implemented without DOM mutation.

### Slice 4 — DOM extractor + filler

RED: extraction/filling tests first failed on missing modules and then `Not implemented` skeletons.

GREEN: labels, options, radio grouping, form fingerprints, native setters, event dispatch, select/checkbox/radio/date behavior, per-field failure isolation, and no-submit behavior implemented.

### Slice 5 — content script + floating UI + popup messaging

RED: page-analysis, floating explicit-fill action, and popup current-page summary tests failed before implementation.

GREEN: pure analysis orchestration, isolated floating React UI, popup message contract, and content-script composition implemented.

### Slice 6 — Chromium acceptance corpus

RED 1: real Chromium exposed synchronous content-script messaging returning `undefined`.

GREEN 1: listener changed to asynchronous promise response.

Fixture correction: `display_name` was correctly interpreted as a preferred-name signal and therefore was not a valid ambiguity fixture. It was replaced with truly generic `name` metadata; matcher behavior/assertions were not weakened.

GREEN final: Chromium verifies persisted profile integration, automatic form detection, Ready / Needs review / Unknown counts, explicit safe filling, select mapping, unchanged sensitive/file/unknown fields, browser events, and zero form submissions.

## Implementation constraints verified

- raw DOM elements never cross into domain/application matching contracts
- content script reads profile data through the existing repository boundary
- matching never mutates DOM
- filler never decides semantics
- no site hostname branches
- no network calls
- no auto-submit
- broad static content-script matching is limited to HTTP/HTTPS and is asserted in generated-manifest CI
