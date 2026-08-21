# Engineering Rules

These rules are defaults for all implementation work unless a requirement explicitly overrides them.

## Delivery operating model

Optimize for **fast verified delivery**, not raw coding activity. The preferred loop is:

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

- Keep work in the smallest coherent vertical slice that produces useful behavior or removes a measured risk.
- Keep WIP low. One agent should normally drive one coherent task end-to-end before starting unrelated implementation work.
- Prefer the shortest safe feedback loop: focused tests during development, then broader gates according to risk before merge.
- Stay on the same task branch and PR through RED/GREEN cycles, CI failures, review fixes, and small same-task follow-ups.
- Do not over-plan trivial low-risk work. Use deeper design work for storage-schema changes, browser permissions, vault/crypto, privacy/data-flow boundaries, broad matcher behavior, and release changes.
- Apply YAGNI aggressively. Delivery speed never justifies weakening correctness, privacy, sensitive-data handling, migration safety, or explicit-user-action guarantees.

## Delivery metrics

Use metrics to improve the engineering system, never to score developer/agent activity.

Prefer:

- cycle time
- PR lead time
- CI feedback time
- change failure rate
- escaped defect rate
- rework rate
- flaky-test rate
- WIP age
- release/deployment frequency when a reliable release signal exists

Commit count, branch count, PR count, lines changed, and generated-code volume are **not productivity KPIs**. A fast change with high rework, regressions, or privacy/correctness failures is unhealthy delivery. When flow degrades, inspect scope size, CI latency, flaky tests, architecture coupling, review latency, or unclear acceptance criteria before pushing more work into the system.

## Product and scope

1. Build the smallest end-to-end behavior required by the current iteration.
2. Do not implement future roadmap items because the architecture can support them.
3. No backend, account, cloud sync, AI, application tracker, job search, or auto-submit during MVP iterations unless `iteration-state.md` is deliberately changed first.
4. Generic form behavior comes before ATS-specific behavior.
5. A site-specific adapter requires a reproducible failing case and a test/fixture that demonstrates why generic logic is insufficient.

## Architecture

6. Domain logic must not import React, WXT, Chrome/browser APIs, or DOM types.
7. Keep scanner, extractor, matcher, fill planner, filler, corrections, variant recommendation, and vault concerns independently understandable/testable.
8. Use abstractions only at known volatile boundaries. Do not create interfaces merely for aesthetic symmetry.
9. Prefer data + pure functions over deep class hierarchies.
10. Never duplicate an entire base profile into an application variant.
11. Persist versioned envelopes. Any stored-schema change must include a migration or an explicit backward-compatibility decision.

## Browser extension safety

12. Use Manifest V3 patterns. No remotely hosted executable code, `eval`, `new Function`, or arbitrary string execution.
13. Request only permissions required by current behavior. Any new permission must be justified in the task/PR.
14. Treat all page text, attributes, and DOM structures as untrusted input.
15. Inject Fillio UI in an isolated way; never let extension CSS intentionally style the host page.
16. Do not keep busy polling loops. Prefer browser events, observers, and debounced work.
17. Mutation observers must ignore irrelevant changes and avoid feedback caused by Fillio's own UI.

## Autofill correctness

18. Matching and filling are separate decisions. A match never directly mutates DOM.
19. Unknown fields fail closed: skip.
20. Medium-confidence fields require review.
21. Sensitive fields require vault access plus user disclosure approval.
22. Never click Submit, Apply, Next, or equivalent navigation controls in MVP.
23. Never silently overwrite a non-empty user-entered field unless the current UX explicitly asks for replacement.
24. Filling one field must not abort the remaining approved fill plan if that field fails.
25. Never label heuristic scores as probabilities unless calibrated.

## Sensitive data

26. Vault is disabled by default.
27. Never persist the vault passphrase.
28. Never log vault plaintext, derived keys, government IDs, compensation values, reference/family data, or document contents.
29. Decrypted vault data must not be exposed wholesale to content scripts. Resolve only values needed for an approved fill operation.
30. Vault unlock expires after 30 minutes of Fillio inactivity.
31. Resetting a vault is destructive and requires explicit confirmation.
32. No password recovery in MVP. Do not build a fake recovery path that weakens encryption.
33. Use standard Web Crypto primitives; never design custom cryptography.

## Privacy

34. MVP sends no career/profile/form data to a server.
35. Do not add telemetry that records input values, page form text, resumes, URLs containing candidate tokens, or sensitive identifiers.
36. A future network feature requires an explicit privacy/data-flow design before code.

## Code quality

37. TypeScript strict mode stays enabled. Do not solve typing problems with broad `any` or blanket casts.
38. Validate data at persistence/message/external boundaries.
39. Avoid generic `utils`, `helpers`, `manager`, and `service` dumping grounds.
40. Do not add a state-management library until React/local state clearly stops being sufficient.
41. Do not add a dependency for behavior the browser platform already provides cleanly.
42. Keep public module contracts small. Internal implementation may change without forcing unrelated callers to change.
43. Comments explain why, constraints, or non-obvious browser behavior; they do not narrate obvious code.
44. Remove dead code rather than commenting it out.
45. No premature caching. Measure before optimizing except for obvious DOM-mutation hot paths.

## Testing — TDD is mandatory

46. **All production behavior changes must use TDD.** Feature work, bug fixes, domain changes, browser behavior, storage/migration behavior, matcher rules, vault behavior, and refactors that alter observable behavior must follow RED → GREEN → REFACTOR.
47. **RED first:** before writing or changing production logic, add the smallest automated test or fixture that expresses the intended behavior and run it to confirm it fails for the expected reason. A test written after the implementation does not count as TDD.
48. **GREEN second:** write only the minimum production code required to make the new failing test pass. Do not implement adjacent future cases during GREEN.
49. **REFACTOR last:** improve structure only after the relevant tests are green, while keeping them green throughout the refactor.
50. For every bug fix, reproduce the bug with a failing regression test before changing production code. If reproduction is genuinely impossible at the automated-test layer, document the concrete technical reason in the task/PR and use the nearest executable verification fixture before the fix.
51. Do not use “too small”, “obvious change”, “MVP”, or “we will add tests later” as reasons to skip TDD. MVP scope may be rough; production behavior still requires a test-first cycle.
52. Purely non-executable changes such as documentation, comments, repository metadata, or formatting do not require an artificial test. Build/tooling configuration changes require executable verification appropriate to that configuration, and production behavior introduced through configuration still requires a failing check first where technically possible.
53. Test public behavior and invariants, not private implementation details.
54. Keep most tests fast and browser-free. Use browser/integration/E2E tests only where DOM, WXT, Chrome/extension runtime, permissions, or browser messaging behavior is the subject.
55. Every new canonical alias/matcher rule must have representative positive and collision/negative fixtures written before the rule implementation.
56. Crypto changes require test-first coverage for round-trip, wrong passphrase, tampering/authentication failure, version parsing, and unique-nonce handling as relevant to the change—not only the happy path.
57. Do not weaken, delete, skip, or rewrite a valid failing test merely to make implementation or CI green unless the requirement itself changed and the corresponding `.agent` requirement is updated in the same task.
58. A task is not implementation-complete if its production behavior was written first and tests were added afterward. Correct the workflow by establishing the missing failing behavior test before further production changes.

### Verification by risk

All executable behavior still follows TDD; the tiers below decide how far verification expands before merge.

- **Low risk:** docs, repository metadata, formatting, or behavior-preserving local refactor. Run the smallest relevant static/focused checks; do not invent expensive tests with no signal.
- **Medium risk:** matcher/scanner/extractor/filler behavior, correction memory, popup/options UI behavior, browser messaging, or normal storage behavior. Run focused unit/component tests plus the relevant browser/integration journey when the runtime boundary is touched.
- **High risk:** vault/crypto, sensitive disclosure, browser permissions, schema migration/backward compatibility, destructive reset, privacy/data-flow changes, or broad autofill safety invariants. Require focused RED/GREEN evidence, negative-path/security coverage, migration/backward-compatibility verification when relevant, browser acceptance for the affected critical journey, and the full mandatory CI suite.

Treat flaky tests and slow CI as delivery-system defects. Do not normalize rerunning nondeterministic gates until they happen to pass.

## Documentation

59. `.agent` is the home for agent/development operating documentation. Do not create random planning files in root/source folders.
60. When a task changes a locked requirement, architecture boundary, release policy, or iteration status, update the relevant `.agent` document in the same task.
61. Keep documentation aligned with actual behavior; remove obsolete decisions rather than stacking contradictory notes.

## Completion

62. Do not claim a task is complete until relevant tests, typecheck, lint, and build have actually been run successfully.
63. Do not merge with unresolved required review comments or failing mandatory checks.
64. A partially implemented future abstraction is not completion. Prefer a smaller finished vertical slice.
