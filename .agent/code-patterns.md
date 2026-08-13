# Code Patterns

## 1. Default style

Prefer small modules, explicit data flow, pure functions for domain logic, and boring TypeScript. Clean code means easy to change and test, not maximizing abstractions.

Use these principles pragmatically:

- YAGNI: do not build future features early.
- KISS: prefer the simplest design that satisfies current behavior.
- DRY only after duplication represents the same concept; do not abstract merely similar code prematurely.
- SRP at module/function boundaries, not one class per noun.
- Dependency inversion only at volatile external boundaries.
- Functional core, imperative shell.
- Parse/validate at boundaries; keep trusted domain data internally.
- Make invalid states difficult to represent with discriminated unions/value constraints where useful.

## 2. Dependency direction

Allowed direction:

```text
UI/entrypoints -> application -> domain
infrastructure -> domain/application ports
```

Forbidden:

```text
domain -> React
domain -> WXT
domain -> chrome.*
domain -> document/window/HTMLElement
matching -> DOM mutation
filler -> profile persistence
```

## 3. Module boundaries

### Domain

Owns meaning and policy:

- canonical profile structures
- application variants
- normalized semantic field keys
- confidence bands
- matching rules
- correction precedence
- fill-plan decisions
- vault policy/state types, but not Web Crypto calls

Prefer pure functions and plain data.

### Application

Owns use-case orchestration:

- analyze form contexts
- resolve selected variant
- prepare fill plan
- save mapping correction
- unlock/lock vault through ports

Application code may coordinate repositories/services but should not manipulate DOM.

### Infrastructure

Owns implementation details:

- Chrome/WXT APIs
- storage serialization
- Web Crypto
- alarms/session storage
- DOM extraction/filling
- browser messaging

Infrastructure may depend on domain contracts, not vice versa.

### UI

Owns presentation and user interaction. It consumes application-facing state/actions. Avoid embedding matcher/storage/crypto rules directly in React components.

## 4. Prefer plain functions over service classes

Good:

```ts
export function resolveProfile(base: BaseProfile, variant?: ApplicationVariant): ResolvedProfile {
  // pure transformation
}
```

Avoid classes that only group stateless functions:

```ts
class ProfileResolverService {
  resolve(...) {}
}
```

Use a class/object when it genuinely owns stateful resource behavior or a replaceable runtime adapter.

## 5. Ports only where change is expected

Good candidates:

```ts
interface ProfileRepository {
  load(): Promise<StoredProfileEnvelope | null>
  save(profile: StoredProfileEnvelope): Promise<void>
}

interface VaultStore {
  loadEncrypted(): Promise<EncryptedVaultEnvelope | null>
  saveEncrypted(envelope: EncryptedVaultEnvelope): Promise<void>
  clear(): Promise<void>
}
```

Do not create interfaces such as `SkillRepository`, `EducationRepository`, or `NameProvider` without a real second implementation/change pressure.

## 6. Canonical semantic field keys

Use stable semantic paths, not website vocabulary:

```text
personal.name.first
personal.name.last
contact.email.primary
contact.phone.primary
location.city
experience[].company
education[].institution
application.compensation.expected
workEligibility.sponsorshipRequired
identity.nationalId
```

Website aliases map into these keys. Never rename canonical keys just to match one ATS label.

## 7. Field context must be serializable

DOM extraction converts browser objects into a plain shape before matching:

```ts
type FieldContext = {
  controlKind: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox'
  inputType?: string
  label?: string
  name?: string
  id?: string
  placeholder?: string
  ariaLabel?: string
  options?: string[]
  sectionText?: string
  origin: string
  formFingerprint: string
  fieldFingerprint: string
}
```

Do not put `HTMLElement` into matcher/domain types.

## 8. Match results are explicit

Prefer a discriminated union or an explicit result object:

```ts
type MatchResult =
  | { status: 'ready'; field: CanonicalField; reason: MatchReason; sensitivity: Sensitivity }
  | { status: 'review'; candidates: CandidateMatch[]; reason: MatchReason; sensitivity: Sensitivity }
  | { status: 'unknown'; reason: MatchReason }
```

Do not use `null`, magic numbers, or exceptions for ordinary "unknown field" behavior.

## 9. Confidence is a policy, not fake probability

Internal scorers may use numbers, but product behavior uses named bands. A heuristic score of `0.82` must not be presented as "82% probability" unless calibrated empirically.

Keep scoring constants centralized in matcher configuration and covered by fixture tests.

## 10. Normalize before matching

Create small deterministic normalizers for:

- Unicode/case
- whitespace/punctuation
- common abbreviations
- Indonesian/English aliases
- phone/email/location terminology

Do not hide normalization inside every matcher rule.

## 11. Site overrides are data, not scattered `if` statements

Bad:

```ts
if (hostname.includes('company-x.com') && label === 'CTC') { ... }
```

Prefer persisted/user-defined correction entries or, only when truly necessary, a single site-adapter registry with explicit ownership and tests.

## 12. DOM filler contract

Matching produces intent. Filling executes intent.

```ts
type FillInstruction = {
  fieldFingerprint: string
  value: string | boolean | string[]
  controlKind: ControlKind
}
```

The DOM layer resolves the current live element from the fingerprint/context and applies the value. This reduces stale-element references after re-render.

For text/select controls, update through browser-native setters/events expected by modern controlled frameworks. Do not use `innerHTML` or arbitrary script evaluation.

## 13. Dynamic-page observer pattern

Keep observation separate from analysis:

```text
MutationObserver -> collect signal -> debounce -> analyze relevant region -> compare fingerprints -> publish new analysis
```

Never call the whole application pipeline synchronously for every mutation callback.

## 14. React state

Start with component/local feature state plus small hooks. Do not add Redux/Zustand/global state library until shared state becomes genuinely painful.

Extension state that must persist belongs in repositories, not a global React store.

Use controlled forms where validation/editing needs them; do not build a generic form framework before the profile UI proves a need.

## 15. Runtime validation and migrations

Persisted data is untrusted because versions change and storage may be manually modified/corrupted.

Pattern:

```text
raw storage
 -> envelope/version parse
 -> sequential migration if old
 -> runtime validation
 -> typed domain object
```

Never cast storage data with `as Profile` and assume it is valid.

Migrations must be pure and fixture-tested.

## 16. Vault crypto pattern

Keep primitives in infrastructure and policy in domain/application.

```text
application unlock use case
 -> key derivation/encryption adapter
 -> session-key adapter
 -> encrypted vault store
```

Do not make React components call `crypto.subtle` directly.

Crypto envelope contains version, algorithms/parameters, salt, IV/nonce, and ciphertext. Never invent custom cryptographic algorithms.

## 17. Error style

Use exceptions for unexpected infrastructure failures. Use explicit result states for expected domain outcomes such as:

- unknown field
- review required
- vault locked
- invalid passphrase
- unsupported control

Do not wrap every function in a custom `Result<T,E>` unless the project demonstrates that it materially improves composition.

## 18. Naming

Use names that describe domain meaning:

- `extractFieldContext`
- `matchField`
- `prepareFillPlan`
- `resolveApplicationVariant`
- `saveSiteCorrection`

Avoid vague names:

- `handleData`
- `processForm`
- `utils.ts`
- `helpers.ts`
- `manager.ts`

A shared utility file is acceptable only for genuinely cross-domain primitives; prefer colocated helpers.

## 19. File size and decomposition

Do not split files by arbitrary line counts. Split when a module has more than one reason to change or mixes layers.

Warning signs:

- one content script owns scanning, matching, filling, storage, and UI
- a component contains persistence/crypto logic
- a matcher file contains website-specific DOM queries
- a generic `utils.ts` grows unrelated helpers

## 20. Dependency additions

Before adding a runtime dependency, ask:

1. Does a current requirement need it?
2. Does the platform already provide the capability?
3. Is it smaller/safer than maintaining our own implementation?
4. Does it execute remote code or require excessive permissions?
5. Can it be isolated behind an existing boundary if replacement becomes necessary?

Prefer platform APIs for browser storage/crypto/events. Use libraries where they remove meaningful complexity, not to avoid writing ten lines of straightforward code.
