# Jobflow Visual Design Contract

Jobflow uses a **Compact Workbench UI**. It should feel like a focused desktop utility: dense enough for repeated career data, calm enough for long editing sessions, and explicit around validation, documents, autofill, and sensitive data.

## 1. Hierarchy

Use three structural levels only:

1. application shell — navigation, top bar, workspace background;
2. task section — one bounded region for one meaningful job;
3. rows and controls — content inside that section.

Do not create another visual card merely because a component has a React boundary.

Repeated simple records such as languages, application rows, documents, and corrections should normally use compact rows inside one section. Large editable records such as projects, certifications, education, and experience may use one inset bounded record when collapse/expand is useful.

## 2. Density and width

Desktop targets:

```text
workspace gutter       8–12px
section padding        12–16px
section radius         8px
row vertical padding   8–10px
field gap               8px
input/button height    ~32px
label/body              12–13px
section title           13–15px
page title              15–17px
```

Touch targets may expand to 44px for coarse pointers without changing desktop density.

The options workspace uses the available canvas width, matching Pipeline. Do **not** add an arbitrary page-level `max-width` that makes Experience, Documents, or other workspaces narrower than Pipeline. Control readability with section padding, field grids, and sensible local field widths instead of shrinking the whole workspace.

## 3. Style ownership

The options/workspace visual system is **Tailwind-owned**.

- Component layout, spacing, borders, radius, color, state, and responsive behavior live in React/TSX Tailwind utility classes or shared TypeScript class constants.
- Shared visual behavior belongs in React primitives such as `Section`, `WorkspaceSection`, `RecordCard`, `Field`, `Button`, and `IconButton`.
- `src/components/ui/tailwind.css` is only the Tailwind entry point plus semantic light/dark token declarations.
- Do not add `@apply`, `@layer components`, component selectors, page selectors, or `!important` patches to the workspace stylesheet.
- Do not add a second options/workspace stylesheet.
- Marker classes used for tests or DOM identification may remain, but they must not own appearance through CSS.
- If a component looks wrong, fix the owning component or primitive rather than adding a global cascade override.

The in-page assistant is a separate Shadow DOM surface. Its scoped style mechanism must remain isolated and must never be used to patch or override the options workspace.

### Token source

Jobflow reuses the Notespace semantic design-token grammar for its application workspace. The runtime source is `src/components/ui/tailwind.css`; Tailwind aliases in `tailwind.config.ts` map Jobflow component names onto those tokens.

Canonical shared semantics:

```text
--bg           application background
--surface      panels, inputs, top bar
--sidebar      secondary navigation surface
--ink          primary text and icons
--muted        supporting text
--line         quiet 1px borders
--accent       focus, links, selected foreground
--tint         hover and selected background
--button       primary action background
--button-text  content on primary action
--danger       destructive/error state
--success      healthy/completed state
```

Jobflow may keep additional semantic state tokens such as warning or stronger borders when the domain needs them, but shared semantics must not be redefined with a competing palette.

## 4. Surfaces

Default elevation is none.

Prefer, in order:

1. spacing;
2. typography;
3. a 1px divider;
4. subtle background contrast;
5. a bounded section when the task genuinely needs one.

Shadows are for real overlays such as popovers, dialogs, and the in-page assistant. Ordinary sections, records, fields, and navigation items do not float.

Sibling top-level task sections must have visible separation. Content must never sit directly against a section border; bounded surfaces always keep explicit inset padding.

## 5. Repeated records

A repeated record must not repeat the same information twice in adjacent hierarchy levels. If `Language` and `Proficiency` are already editable fields, do not add a second summary immediately above them unless the record is collapsed.

Large records such as projects and certifications use compact summaries when collapsed. When several new blank records exist, do not automatically expand all of them. At most the newest unfinished record should open by default.

Delete actions stay inset from the record edge and should not consume a full column. Sibling records must not visually touch each other when they are meant to be independent bounded records.

## 6. Forms

- controls use 6px radius and quiet 1px borders;
- desktop controls are approximately 32px high;
- textareas start around 72px unless the task needs more room;
- labels are short nouns or direct questions;
- related fields use compact 2- or 3-column grids where width permits;
- focus uses the steel-blue accent and a clear 2px ring;
- no inset highlights, ambient control shadows, or hover lift.

## 7. Copy

Product copy should sound like a utility, not generated marketing prose.

Use direct labels and short helpers. State what the user can do, what will happen, or what constraint matters. Prefer one concise sentence over an explanatory paragraph.

Avoid filler such as:

- seamless;
- powerful;
- intelligent;
- effortless;
- smart workflow;
- built for you;
- supercharge;
- unlock your potential;
- vague “AI-powered” claims when no model behavior is being explained.

Do not repeat safety prose at every level. Keep important consent or privacy information where the decision is made.

## 8. Documents

Document storage and import are operational tools, not hero surfaces.

- stored files are compact rows;
- the CV picker is a short horizontal action surface on desktop, not a large empty dropzone;
- extraction/review state appears directly below the action;
- empty states are one line when no recovery instruction is required;
- Stored resumes, picker, and extracted-data review use consistent inset spacing and borders.

## 9. Sensitive vault

The locked state is a compact credential action: passphrase and unlock action should read as one local workflow, not two disconnected blocks.

Sensitive state, destructive reset, errors, and consent remain explicit. Compactness must never hide a security boundary.

## 10. In-page assistant

The Shadow DOM assistant follows the same workbench language while remaining an isolated overlay:

```text
panel width             ~340–360px
body/control text       12–13px
control height          ~30–32px desktop
panel radius            8–10px
```

Use one panel boundary, divider-based internal grouping, quiet selected tabs, and one overlay shadow. Do not use oversized tabs, stacked internal cards, decorative assistant chrome, or a visually unrelated design language.

The launcher remains small and identifiable. Motion is limited to open/close and meaningful view changes.

## 11. Color and interaction

The shared Notespace neutral + steel-blue palette is canonical for the workspace.

- neutral `--button` is the primary-action background;
- steel-blue `--accent` is for focus, links, active icons, and selected state;
- `--tint` is the low-emphasis hover/active background paired with accent or ink foreground;
- green, amber, and red retain semantic meanings;
- ordinary structure remains neutral.

Do not make every important control blue. Action hierarchy and selection hierarchy must remain distinguishable. Dark mode preserves the same hierarchy and density rather than switching to a different visual product.

Control motion follows the Notespace grammar: immediate local feedback is about 100ms; navigation/panel continuity may use about 160ms. Motion must respect reduced-motion preferences.

## 12. Anti-slop rules

Do not introduce:

- card inside card inside card;
- equal visual weight for parent and child containers;
- giant rounded dashboard tiles;
- repeated shadows, gradients, glow, or glass blur;
- an arbitrary page-width cap that makes sibling workspaces inconsistent;
- oversized empty states or upload areas;
- every repeated record expanded at once;
- duplicated summary text directly above the same editable value;
- arbitrary dashboard grids;
- generic hero copy inside an operational product;
- decorative motion on routine controls;
- a visually separate design system for the in-page assistant;
- global CSS patches to repair a broken component primitive;
- `!important` chains that fight component-owned Tailwind utilities.

## 13. Accessibility and product invariants

Preserve keyboard operation, visible focus, readable contrast, disabled/loading states, screen-reader labels, validation, destructive-action clarity, sensitive-data consent, explicit document attachment, application-state ownership, and reduced-motion behavior.

When extending Jobflow, prefer the smallest visual structure that makes the current task clear. More containers are not more hierarchy.
