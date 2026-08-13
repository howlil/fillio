# Fillio Agent Workspace

This directory is the project operating system for Fillio. Product decisions, architecture boundaries, engineering rules, iteration state, release policy, and reusable engineering skills live here.

## Product in one sentence

Fillio is a local-first browser extension that stores a canonical career profile, detects career-application forms, recommends the best application variant, and helps the user safely autofill recognized fields without auto-submitting.

## Source of truth

Read these before changing production code:

- `requirements.md` — product scope, functional/non-functional requirements, explicit non-goals.
- `design.md` — architecture, boundaries, data flow, data model, security model, extension contexts.
- `iteration-state.md` — current iteration, acceptance criteria, decisions, next work only.
- `code-patterns.md` — implementation patterns and dependency boundaries.
- `rules.md` — engineering rules and quality gates.
- `git-strategy.md` — branch/commit/PR hygiene.
- `release-strategy.md` — versioning, environments, packaging, rollback.
- `skills/` — focused reference skills used only when their trigger applies.

## Engineering posture

Fillio is an MVP, not a prototype that is expected to be thrown away. Optimize for the smallest useful implementation while preserving the boundaries that are expensive to repair later.

Priorities, in order:

1. Correct user data and safe autofill behavior.
2. Small, explicit module boundaries around volatile concerns.
3. Fast feedback through tests for pure domain logic.
4. Simple code over speculative abstractions.
5. Easy replacement of infrastructure details without rewriting domain logic.

Use YAGNI aggressively. Do not add a backend, AI model, site adapter, global learning system, analytics stack, or framework abstraction until a current requirement needs it.

## MVP architecture decision

Recommended initial stack:

- WXT
- TypeScript with strict mode
- React for popup/options/floating UI
- Manifest V3
- `chrome.storage.local` behind a storage port
- Web Crypto for the sensitive vault
- Unit tests for schema/matcher/security/pure logic; a small number of browser integration/E2E tests for critical journeys

Chrome/Chromium is the first supported target. Keep browser APIs behind narrow adapters so Firefox support can be added without rewriting domain logic.

## Change rule

When implementation reveals a requirement or architectural decision has changed, update the relevant `.agent` document in the same task. Do not create ad-hoc planning files elsewhere in the repository.
