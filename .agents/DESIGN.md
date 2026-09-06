# Jobflow Visual Design Contract

Jobflow uses a **Compact Workbench UI**. It should feel like a focused desktop utility: dense enough for repeated career data, calm enough for long editing sessions, and explicit around validation, documents, autofill, and sensitive data.

## 1. Hierarchy

Use three structural levels only:

1. application shell — navigation, top bar, workspace background;
2. task section — one bounded region for one meaningful job;
3. rows and controls — content inside that section.

Do not create another visual card merely because a component has a React boundary.

Repeated records such as projects, certifications, languages, applications, documents, and corrections should normally be divider rows. A record may collapse when its edit form is large.

## 2. Density

Desktop targets:

```text
workspace gutter       8–12px
section padding        12–14px
section radius         8px
row vertical padding   8px
field gap               8px
input/button height    ~32px
label/body              12–13px
section title           13–15px
page title              15–17px
```

Touch targets may expand to 44px for coarse pointers without changing the desktop density.

Long editor pages should use a readable working width instead of stretching controls across arbitrary ultrawide screens. The normal maximum content width is about `1180px`.

## 3. Surfaces

Default elevation is none.

Prefer, in order:

1. spacing;
2. typography;
3. a 1px divider;
4. subtle background contrast;
5. a bounded section when the task genuinely needs one.

Shadows are for real overlays such as popovers, dialogs, and the in-page assistant. Ordinary sections, records, fields, and navigation items do not float.

## 4. Repeated records

A repeated record must not repeat the same information twice in adjacent hierarchy levels. If `Language` and `Proficiency` are already editable fields, do not add a second summary immediately above them unless the record is collapsed.

Large records such as projects and certifications use compact summaries when collapsed. When several new blank records exist, do not automatically expand all of them. At most the newest unfinished record should open by default.

Delete actions stay aligned to the record edge and should not consume a full column.

## 5. Forms

- controls use 6px radius and quiet 1px borders;
- desktop controls are approximately 32px high;
- textareas start around 72px unless the task needs more room;
- labels are short nouns or direct questions;
- related fields use compact 2- or 3-column grids where width permits;
- focus uses the product blue and a clear 2px ring;
- no inset highlights, ambient control shadows, or hover lift.

## 6. Copy

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

## 7. Documents

Document storage and import are operational tools, not hero surfaces.

- stored files are compact rows;
- the CV picker is a short horizontal action surface on desktop, not a large empty dropzone;
- extraction/review state appears directly below the action;
- empty states are one line when no recovery instruction is required.

## 8. Sensitive vault

The locked state is a compact credential action: passphrase and unlock action should read as one local workflow, not two disconnected blocks.

Sensitive state, destructive reset, errors, and consent remain explicit. Compactness must never hide a security boundary.

## 9. In-page assistant

The Shadow DOM assistant follows the same workbench language while remaining an overlay:

```text
panel width             ~340–360px
body/control text       12–13px
control height          ~30–32px desktop
panel radius            8–10px
```

Use one panel boundary, divider-based internal grouping, quiet blue selected tabs, and one overlay shadow. Do not use a black chat-like surface as the default light-mode experience, oversized tabs, stacked internal cards, or decorative assistant chrome.

The launcher remains small and identifiable. Motion is limited to open/close and meaningful view changes.

## 10. Color

Blue is reserved for primary action, focus, selection, and product state. Green, amber, and red retain semantic meanings. Neutral structure should remain neutral.

Dark mode preserves the same hierarchy and density rather than switching to a different visual product.

## 11. Anti-slop rules

Do not introduce:

- card inside card inside card;
- equal visual weight for parent and child containers;
- giant rounded dashboard tiles;
- repeated shadows, gradients, glow, or glass blur;
- full-width inputs on very wide monitors without a working-width reason;
- oversized empty states or upload areas;
- every repeated record expanded at once;
- duplicated summary text directly above the same editable value;
- arbitrary dashboard grids;
- generic hero copy inside an operational product;
- decorative motion on routine controls;
- a visually separate design system for the in-page assistant.

## 12. Accessibility and product invariants

Preserve keyboard operation, visible focus, readable contrast, disabled/loading states, screen-reader labels, validation, destructive-action clarity, sensitive-data consent, explicit document attachment, application-state ownership, and reduced-motion behavior.

When extending Jobflow, prefer the smallest visual structure that makes the current task clear. More containers are not more hierarchy.
