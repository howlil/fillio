# Iteration 3 — Dynamic Forms + Correction Memory

Goal: support dynamic/multi-step forms and remember user mapping corrections for the exact site/form/field.

Rules: mandatory RED → GREEN → REFACTOR; local-first; no backend/AI/vault/site-specific ATS adapter; no auto-fill after DOM mutation; no auto-submit/next/file upload; persisted corrections are versioned and store mapping metadata only.

## Slice 1 — correction domain + persistence
- Add versioned `StoredCorrectionEnvelope { schemaVersion: 1, entries[] }`.
- Correction key: exact `origin + formFingerprint + fieldFingerprint`.
- Target: supported non-sensitive canonical field or `ignore`.
- Add `CorrectionRepository.listForOrigin()` and `upsert()` plus Chrome storage adapter.
- RED tests first: scoped precedence over matcher, ignore => Unknown, other origin/form/field cannot apply, invalid/future envelope rejected, upsert replaces only same key.

## Slice 2 — dynamic form identity + watcher
- Make form fingerprint stable across unrelated control additions/removals while still distinguishing labeled/actioned forms.
- Add order-insensitive field-set analysis fingerprint.
- Add stoppable `MutationObserver` watcher with relevance filter + debounce; ignore Fillio host and irrelevant text mutations.
- RED tests first for all behavior.

## Slice 3 — Review UI + orchestration
- Floating UI shows Review for ambiguous fields.
- User chooses a supported mapping and explicitly remembers it, or ignores the field.
- React UI owns no storage/browser APIs.
- Content script composes corrections + analysis + watcher + rerender.
- Relevant debounced DOM changes only re-analyze when semantic field-set fingerprint changes.
- Correction save immediately re-analyzes; never fills automatically.
- Popup current-page summary must reflect latest analysis.

## Slice 4 — Chromium acceptance
- Extend local fixture to multi-step dynamic form.
- Verify correction is remembered on revisit/reload for the same site/form/field.
- Verify unrelated origin/form does not inherit correction.
- Verify site-owned Next causes automatic debounced re-analysis of new fields but zero auto-fill/auto-next/submit.
- Final gates: npm ci, tests, typecheck, lint, format, build, manifest invariants, Chromium E2E, package.
- Only after all green: update `.agent/iteration-state.md`, review diff, open one PR, squash merge, verify final `master` CI.

Implementation remains deliberately simple: debounced full semantic rescan after relevant mutations, not an incremental DOM diff engine, until profiling proves otherwise.
