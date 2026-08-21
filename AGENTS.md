# Fillio Agent Entry Point

This repository uses `.agent/` as the project-local engineering source of truth.

Before production work, read only the relevant canonical files rather than loading every historical artifact:

1. `.agent/iteration-state.md` for the current product iteration and allowed scope.
2. `.agent/rules.md` for engineering, TDD, delivery, privacy, security, and verification rules.
3. `.agent/design.md` and `.agent/code-patterns.md` when architecture or dependency boundaries matter.
4. `.agent/git-strategy.md` for branch/PR/merge discipline.
5. `.agent/release-strategy.md` for packaging/release work.
6. A specific `.agent/plan` or skill only when the current task actually requires it.

Default execution model is **fast verified delivery**:

```text
goal -> acceptance criteria -> RED -> GREEN -> REFACTOR -> focused verification -> PR/CI -> merge -> observe
```

Do not interpret “fast” as permission to bypass Fillio’s fail-closed autofill behavior, explicit user action, privacy rules, sensitive-data controls, migration safety, browser-permission review, or mandatory CI. Use the smallest safe vertical slice and widen verification according to risk.

Iteration state does not advance automatically because maintenance, tooling, documentation, or policy work merged. Product iteration changes must be intentional and recorded in `.agent/iteration-state.md`.

Never claim tests, browser verification, CI, merge, release, or deployment happened unless the current runtime actually performed or observed it.
