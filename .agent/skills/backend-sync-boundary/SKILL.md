---
name: backend-sync-boundary
description: Use when Fillio is about to add accounts, cloud backup, cross-device sync, remote APIs, authentication, server persistence, or any backend component.
---

# Backend and Sync Boundary

## Core principle

Fillio has no backend in MVP. Add one only when a current product requirement needs remote persistence/account/sync. The backend extends the canonical local-first model; it does not replace it.

## Before adding backend code

Confirm all of these exist:

- explicit user problem requiring remote capability
- defined data that will leave the device
- authentication requirement
- offline behavior
- conflict-resolution behavior
- privacy/security model
- migration compatibility with existing local profiles

If those are not defined, do not scaffold a server "for later".

## Data-model rule

The canonical versioned profile remains the domain contract.

```text
local canonical profile
        |
        +-> LocalProfileRepository      (MVP)
        +-> SyncedProfileRepository     (future)
```

Do not create separate frontend/backend career-profile schemas that drift independently.

## Local-first behavior

Future sync must not make ordinary autofill depend on network availability. Local data remains sufficient for the extension's core behavior.

A reasonable future sync pipeline is:

```text
local write
 -> durable local state
 -> async sync attempt
 -> server acknowledgement/conflict
 -> deterministic reconciliation
```

Do not block profile editing or form filling on server round trips unless a future requirement explicitly demands it.

## API design

Prefer a small resource-oriented or RPC surface shaped around actual sync/account use cases. Do not introduce microservices, event buses, CQRS, GraphQL, or message brokers without demonstrated need.

Keep server infrastructure replaceable behind application boundaries. Domain types and validation rules should be shared/generated deliberately where practical, not copied manually.

## Security/privacy

Before transmission, decide explicitly which fields may sync and whether sensitive-vault data is:

- local-only, or
- client-side encrypted before upload.

Do not send vault plaintext merely because TLS exists.

Never ship telemetry or remote AI under the label of "sync".

## Conflict handling

Do not use naive last-write-wins for all data without considering repeated profile records and multi-device edits. Define conflict semantics before implementation; start with the simplest behavior consistent with real usage.

## Common mistakes

- scaffolding Nest/Fastify/DB before sync is required
- server becoming required for local autofill
- duplicating canonical types in an unrelated backend model
- adding auth and database complexity to solve a local-only MVP
- silently uploading sensitive data
- over-designing distributed-system concerns for one user/device
