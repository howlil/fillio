# Release Strategy

Fillio starts as a fast-moving `0.x` browser-extension product. Releases should be reproducible and boring. Do not build a release platform before users need one.

## Versioning

Use Semantic Versioning with `0.x` expectations:

- `0.MINOR.0` — meaningful MVP capability/breaking stored-schema behavior that is migrated safely
- `0.x.PATCH` — bug/security/compatibility fix without intentional feature expansion
- prerelease suffixes when useful: `0.1.0-alpha.1`, `0.1.0-beta.1`

Before `1.0.0`, internal APIs may change freely, but persisted user data and user-visible behavior still require deliberate migration/release notes.

## Environments

Keep only environments that have a real purpose:

### Development

- WXT dev mode/unpacked extension
- local test fixtures
- no production publishing

### Release build

- deterministic production build from a tagged `master` commit
- extension package ZIP
- source commit/tag recorded

Do not create separate dev/staging/prod backend environments while there is no backend.

A store-unlisted/beta channel may be introduced later if actual external testers need it.

## Release channels

Recommended progression:

1. Local unpacked builds during early iterations.
2. GitHub prerelease ZIP for trusted testers.
3. Chrome Web Store test/unlisted channel when external installation friction matters.
4. Public stable listing only after permission/privacy/security behavior is ready for review.

Firefox packaging is future work and must not block Chromium MVP.

## Source of version

Use one canonical application version source and let the extension build manifest derive from it. Do not maintain independent manual version numbers in multiple files.

## CI release gates

Before creating a release artifact, verify at minimum:

- clean install from lockfile
- unit tests
- typecheck
- lint/format check as configured
- production extension build
- targeted browser integration/E2E smoke journey
- no unexpected increase in extension permissions
- persisted-schema migration tests when schema changed
- vault/security tests when crypto/sensitive flow changed

A release workflow should fail closed; do not publish a package after a required verification failure.

## Artifact strategy

For a release, produce only useful artifacts:

- extension ZIP suitable for the target distribution flow
- checksum if distributed directly from GitHub
- concise release notes

Do not commit generated extension bundles to source control unless a distribution channel explicitly requires it.

## Release notes

Keep notes user-oriented:

- Added
- Fixed
- Security/Privacy changes
- Known limitations when material

Call out explicitly:

- new browser permissions
- stored-data migration
- vault behavior changes
- behavior that may change autofill mappings

Do not dump commit history as release notes.

## Store permission/privacy gate

Before any Chrome Web Store publication, perform a manual release checklist:

- every requested permission is mapped to a current feature
- broad host access is explained by automatic form detection
- no remote executable code
- no profile/form data is transmitted in MVP
- sensitive vault behavior matches user-facing disclosure
- extension does not auto-submit applications
- privacy policy/store copy matches actual data flow

## Rollback

Browser-extension distribution can lag and users may remain on old versions. Therefore:

- persisted schema migrations must be forward-safe within the current version
- never assume every user upgrades instantly
- do not publish a release that irreversibly destroys prior user data without an explicit migration and backup/export design

If a release is bad:

1. stop/promote no further distribution if the channel allows
2. fix on `master`
3. verify
4. issue a patch release

Do not mutate or silently replace an already tagged release artifact. Tags/releases are immutable history; supersede them with a new version.

## Release automation

Start small. A GitHub Actions release workflow is justified when manual packaging becomes repetitive or external testers depend on artifacts.

Do not add release-please, changesets, multi-channel deployment automation, or release branches before there is a concrete need.

Recommended first automation later:

```text
manual/tag trigger
 -> install locked dependencies
 -> test/typecheck/lint
 -> build extension
 -> smoke test
 -> package ZIP
 -> attach to GitHub Release
```

Store publishing automation can be added separately once store credentials and release cadence make it worthwhile.

## First release target

The first distributable MVP should be `0.1.0` only after the Iteration 5 acceptance outcome is met. Earlier test packages should use prerelease versions rather than pretending production stability.
