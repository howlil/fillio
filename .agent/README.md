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
- `rules.md` — engineering rules, TDD policy, delivery model, risk-based verification, and quality gates.
- `git-strategy.md` — branch/commit/PR hygiene.
- `release-strategy.md` — versioning, environments, packaging, rollback.
- `skills/` — focused reference skills used only when their trigger applies.

Root `AGENTS.md` is the entry-point/router for coding agents; it points back to these `.agent` sources rather than duplicating them.

## Engineering posture

Fillio is an MVP, not a prototype that is expected to be thrown away. Optimize for the smallest useful implementation while preserving the boundaries that are expensive to repair later.

Priorities, in order:

1. Correct user data and safe autofill behavior.
2. Privacy and sensitive-data safety.
3. Small, explicit module boundaries around volatile concerns.
4. Fast verified feedback through tests and CI.
5. Simple code over speculative abstractions.
6. Easy replacement of infrastructure details without rewriting domain logic.

Use YAGNI aggressively. Do not add a backend, AI model, site adapter, global learning system, analytics stack, or framework abstraction until a current requirement needs it.

## Delivery operating model

Default engineering loop:

```text
goal
  -> acceptance criteria
  -> RED
  -> GREEN
  -> REFACTOR
  -> focused verification
  -> PR / CI
  -> review and fixes on the same branch
  -> merge
  -> observe
```

Operational rules:

- TDD is mandatory for executable production behavior.
- Keep changes as small coherent vertical slices.
- Keep WIP low and finish a bounded task before starting unrelated work.
- Use the fastest focused test loop first, then widen verification according to risk.
- Keep CI/review fixes on the same task branch and PR.
- Use deeper design/planning only when risk justifies it: vault/crypto, permissions, storage migrations, privacy/data-flow, broad autofill/matcher behavior, or release changes.
- Do not change `iteration-state.md` merely because maintenance/policy work merged. Iteration transition requires an intentional product decision.

Delivery health is judged by cycle time, PR lead time, CI feedback time, rework, escaped defects, change failure rate, flaky tests, WIP age, and release frequency when meaningful. Commit count, branch count, PR count, and lines changed are not productivity metrics.

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

## Agent artifact discipline

`.agent` should reduce execution ambiguity, not create ceremony.

- Update an existing canonical document before creating a new one when the concept already has a home.
- Create a plan only when sequencing, risk, migration, or multi-step verification would otherwise be easy to lose.
- Do not generate checkpoint files for every command or tiny edit.
- Keep active state in `iteration-state.md`; do not create permanent iteration branches or competing state trackers.
- Prefer executable evidence (tests, CI, browser acceptance, benchmark) over prose claims.

## Change rule

When implementation reveals a requirement or architectural decision has changed, update the relevant `.agent` document in the same task. Do not create ad-hoc planning files elsewhere in the repository.
