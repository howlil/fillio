---
name: testing-browser-extension
description: Use when adding tests, fixing regressions, defining browser fixtures, changing matcher rules, schema migrations, vault behavior, DOM filling, messaging, or deciding what belongs in unit versus browser-level tests.
---

# Testing Browser Extension

## Core principle

Keep most tests fast and browser-free. Use browser automation only when the behavior genuinely depends on DOM/browser-extension runtime semantics.

## Test pyramid

### Pure/unit tests

Default for:

- schema validation and migrations
- base profile + variant resolution
- alias normalization
- matcher/confidence policy
- correction precedence
- variant recommendation
- form/field fingerprint logic on serializable inputs
- fill-plan policy
- vault crypto envelope functions

For behavior changes and bugs, write the failing test/fixture first when feasible.

### DOM integration tests

Use focused DOM fixtures for:

- label/context extraction
- native setter/event behavior
- select/radio/checkbox filling
- dynamic DOM additions
- repeated field structures

Fixtures should model patterns, not copy entire proprietary career pages.

### Extension E2E

Use sparingly for critical journeys:

- unpacked extension starts
- content/background messaging works
- profile persistence is available to the UI
- floating control appears on a representative form
- user-triggered fill updates the page
- dynamic next-step rescan works
- vault unlock/disclosure/auto-lock boundary works

Do not turn every component state into an E2E test.

## Matcher regression corpus

Maintain representative fixture cases across:

- English and Indonesian labels
- synonyms/abbreviations
- ambiguous fields
- negative collisions
- repeated education/experience records
- common controlled components
- dynamic/multi-step sections

Every new matcher alias/rule adds at least one positive and one meaningful negative/collision case when applicable.

## Bugfix rule

Preferred sequence:

```text
reproduce -> failing test/fixture -> minimal fix -> passing focused test -> broader relevant suite
```

If the failure cannot reasonably be automated, document the manual reproduction and why automation was disproportionate.

## Crypto/security tests

Do not mock away the cryptographic primitive in tests whose purpose is vault correctness. Verify wrong passphrase, tampering/authentication failure, version handling, and lock policy in addition to round trip.

## What not to test

Avoid tests that merely assert:

- private function call counts
- internal folder structure
- React implementation details with no user behavior
- constants duplicated from production code
- third-party library behavior already guaranteed upstream

## Completion evidence

Before claiming implementation complete, run the relevant focused tests plus repository-level required verification: typecheck, lint/format check, unit tests, production build, and critical browser smoke test when runtime behavior changed.
