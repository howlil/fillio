# Git Strategy

Fillio uses a lightweight trunk-based workflow optimized for a solo/small-team MVP. The goal is a readable default branch, not ceremony.

Current default branch: `master`.

## Core rules

1. One task/bugfix = at most one working branch.
2. Do not create a new branch because a test failed or a small follow-up was discovered; continue the same task branch.
3. Do not create permanent iteration branches, environment branches, or speculative experiment branches.
4. Short-lived branch names only when a branch is useful:
   - `feat/<short-topic>`
   - `fix/<short-topic>`
   - `chore/<short-topic>`
5. Tiny low-risk repository maintenance/documentation may go directly to `master` when review/CI isolation has no value.
6. Non-trivial feature/bug work should use one short-lived branch and one PR.

## Commit hygiene

Working-branch commits are allowed to support TDD and safe checkpoints, but they are not a public diary.

Good commit intent:

- one coherent behavior or checkpoint
- imperative, specific message
- no generated noise

Avoid separate commits solely for:

- formatting after the task
- typo in the immediately previous commit
- CI retry
- "fix previous commit"
- console-log removal
- tiny test adjustment that belongs to the same change

Fold those into the current task history when practical.

Do not rewrite history on `master`.

## TDD history

RED/GREEN intermediate commits are acceptable on a task branch when useful for safety or review. Before integrating normal task work, prefer squash merge so `master` receives one coherent commit per task.

The value is TDD behavior, not preserving every RED/GREEN commit forever.

## Pull requests

Create a PR when it provides actual value:

- non-trivial feature
- bugfix affecting behavior/security/data
- CI/review needed
- risky permission/storage/schema/crypto change

Do not create a second PR for revisions to the same task. Push revisions to the existing branch/PR.

PR description should contain:

- problem/goal
- user-visible behavior
- important architectural/security decision if any
- verification performed
- schema/permission/release impact when applicable

Do not copy the entire implementation plan into the PR.

## Merge policy

Default: squash merge.

Merge when:

- acceptance criteria are met
- relevant tests/typecheck/lint/build are green
- mandatory CI is green
- no unresolved blocking review exists

For a task already requested for implementation, merge once those gates are satisfied; do not add a redundant confirmation gate solely for ceremony.

After merge, delete the task branch when tooling allows.

## Branch cleanup

Before starting major new work, check for stale task branches.

- merged branch -> delete
- abandoned branch -> delete after confirming no unique work is needed
- active branch -> keep only if a current task owns it

Do not accumulate `test-*`, `fix-2-*`, `iteration-*`, `final-final-*`, or backup branches. Git history is the backup.

## Direct-to-master exceptions

Direct commits are reasonable for truly small low-risk changes such as:

- typo/docs correction
- initial repository bootstrap
- metadata with no runtime impact

Do not use this exception for:

- vault/crypto
- permissions
- schema migrations
- form filling behavior
- matcher changes with broad impact
- release workflow changes

Those deserve a task branch + verification.

## Release commits

Do not create release branches. A release tag points to an already verified `master` commit.

Avoid manual "version bump" commit spam for every development change. Version only when preparing an actual release.

## Conflict strategy

Keep branches short-lived and update from `master` when necessary. Resolve conflicts in the task branch. Never create a new branch merely to resolve a conflict.

## Emergency fixes

For a released regression:

1. create one `fix/<issue>` branch from current `master`
2. reproduce regression where feasible
3. implement minimal fix
4. run focused + mandatory verification
5. squash merge
6. release a patch version if user-facing distribution is affected

No separate hotfix branch hierarchy is needed for 0.x MVP development.
