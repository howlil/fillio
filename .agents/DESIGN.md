# Jobflow Visual Design Contract

This file is the visual source of truth for Jobflow. Product behavior lives in `PROJECT.md`; software/runtime boundaries live in `ARCHITECTURE.md`.

## 1. Design direction

Jobflow uses **Soft Skeuomorphic Bento UI**: a calm career workspace built from softly elevated modular surfaces, large rounded geometry, restrained pastel depth, and clear task-oriented hierarchy.

The reference character is closer to a polished desktop file/storage utility than a generic SaaS dashboard:

- warm cloud-gray workspace background;
- white/near-white raised tiles;
- large rounded cards and containers;
- very soft ambient shadows plus subtle inner highlights;
- selective blue as the primary product accent;
- low-saturation semantic colors for warning/error/success states;
- simplified object-like visual treatment where it improves recognition;
- compact operational content inside visually calm bento surfaces.

This is **not** glassmorphism. Ordinary surfaces are opaque and do not depend on backdrop blur. It is also not full neumorphism: controls must retain enough boundary contrast, focus visibility, and semantic clarity to remain usable.

## 2. Product adaptation

The style must serve Jobflow's actual jobs: manage applications, maintain reusable profile data, import documents, review autofill state, and handle sensitive fields safely.

Therefore:

- bento grouping may change visual hierarchy, never workflow ownership;
- critical state, consent, validation, and destructive actions remain explicit;
- low contrast is used for ambient structure, not for important text or controls;
- decorative pastel color never substitutes for semantic state;
- forms stay dense enough for real career-data editing;
- the in-page assistant remains an overlay and never reflows the host page.

## 3. Foundation palette

Runtime tokens remain centralized in the shared UI layer.

### Light

```text
background        #EBECE9
surface           #F7F8F6
surface-raised    #FFFFFF
surface-muted     #F1F3EF
border            #E0E3DD
border-strong     #C9CEC5
ink               #2A3037
text              #59616B
subtle            #858D96
accent            #4C91D6
accent-strong     #2B74BC
accent-soft       #DDECF9
success           #2D9C6A
warning           #C98A2D
danger            #D65A5A
info               #4C91D6
```

### Dark

Dark mode preserves the same soft-depth model rather than falling back to flat black.

```text
background        #171A1D
surface           #1E2226
surface-raised    #252A2F
surface-muted     #20252A
border            #343A40
border-strong     #4A525A
ink               #F4F6F7
text              #C1C7CD
subtle            #8E969E
accent            #76B5ED
accent-strong     #9BCBFA
accent-soft       #24394C
```

## 4. Geometry

Canonical geometry:

```text
workspace outer radius      24–30px
first-level bento card      20–24px
record / inset entity       14–18px
input / button              10–12px
pill                         999px
control height              36px minimum
coarse-pointer target       44px minimum
```

Rounded geometry is a primary visual device in this system, but nesting still needs restraint. A field inside a record inside a bento card should not gain another decorative wrapper unless that wrapper has an interaction or grouping purpose.

## 5. Depth model

Depth should feel soft and diffuse.

Use three levels:

1. **Workspace canvas** — large cloud-gray inset container.
2. **Raised bento tile** — white/near-white card with soft ambient shadow and faint top highlight.
3. **Inset control/entity** — shallow boundary, soft inner highlight, little or no ambient shadow.

Typical raised-card shadow:

```css
0 1px 2px rgb(31 41 55 / 0.04),
0 14px 32px rgb(31 41 55 / 0.07)
```

Do not use hard drop shadows, black halos, large glow fields, or glass blur as default hierarchy.

## 6. Application shell

### Desktop

- The workspace uses a padded outer canvas instead of edge-to-edge structural chrome.
- The collapsed navigation rail remains explicit and user-controlled.
- Expanded navigation still overlays the workspace rather than resizing application content.
- Sidebar, header, and active workspace canvas are distinct soft surfaces.
- Navigation remains compact; the design must not trade workspace width for decoration.

### Mobile

- Use the same navigation owner and destinations.
- The mobile navigation block becomes a rounded raised surface.
- Workspace gutters shrink, but cards keep enough radius and padding to preserve the design language.

## 7. Bento composition

Jobflow's bento system is **functional**, not a decorative dashboard grid.

Use cards for independently understandable modules such as:

- pipeline summaries and views;
- profile sections;
- document import and document records;
- application records;
- backup/recovery operations;
- autofill-memory records;
- sensitive-data workflows.

Cards may remain single-column when the task requires width. Do not force every route into a 3-column dashboard. Responsive bento composition means modular raised surfaces with deliberate sizing, not arbitrary masonry.

## 8. Typography

Primary family remains:

```text
Inter Variable -> Inter -> system sans
```

Technical identifiers may use:

```text
IBM Plex Mono -> system monospace
```

Targets:

```text
body/control/table      14–15px
section title           15–17px
supporting text         13px
technical mono          12–13px
page/object title       18–22px
```

The soft visual treatment must not reduce text contrast below comfortable reading levels.

## 9. Controls

### Primary action

- blue accent surface;
- white text;
- soft blue shadow;
- 10–12px radius;
- restrained hover lift/darken;
- one dominant primary action per local workflow.

### Secondary/default

- raised light surface;
- quiet border;
- shallow ambient shadow;
- no unnecessary accent fill.

### Inputs

- raised/inset white surface;
- low-contrast border;
- faint inner top highlight;
- clear blue focus boundary/ring;
- disabled state remains visibly non-editable.

### Danger

Danger remains semantic red. Never recolor destructive actions blue merely for visual consistency.

## 10. Cards and records

### First-level bento card

- 20–24px radius;
- raised surface;
- low-contrast border;
- soft ambient shadow;
- 16–20px internal padding;
- clear title/context/action ownership.

### Repeated record

- 14–18px radius;
- raised or slightly inset surface;
- 1px subtle boundary;
- smaller shadow than its parent;
- compact 12–14px padding.

Avoid stacking several equally strong shadows. Parent depth should be stronger than child depth.

## 11. Color usage

Blue is the product accent for:

- primary actions;
- selected navigation;
- focus;
- active tabs;
- intentional highlighted objects.

Pastel pink, lilac, and related soft tones may be used only for secondary visualization or categorical distinction where meaning is clear. They are not default decoration for every card.

Semantic colors retain their meanings:

- green = success;
- amber = warning/due attention;
- red = destructive/error;
- blue = product action/info.

Never rely on color alone for critical states.

## 12. Navigation

- Collapsed navigation remains icon-first and keyboard accessible.
- Active destination uses a soft blue selected tile rather than monochrome inversion.
- Expanded labels appear within the same raised sidebar surface.
- Group headings are quiet metadata, not hard section bars.
- Generic UI icons come from `lucide-react`.
- Icon-only controls require accessible labels/titles.

## 13. Motion

Use Motion for React only where it clarifies spatial change:

- sidebar width transition;
- overlay/panel enter and exit;
- meaningful view transitions.

CSS transitions handle:

- hover lift;
- shadow change;
- border/focus changes;
- button press feedback.

Motion should be short and damped. The style is soft, not floaty. Respect `prefers-reduced-motion` everywhere.

## 14. In-page assistant

The assistant remains isolated in Shadow DOM and overlays the host page.

Its visual direction should converge on the same system:

- rounded raised panel;
- soft border and shadow;
- blue active/primary states;
- white/near-white controls;
- compact information density;
- semantic warnings and sensitive states remain explicit.

Do not convert it into a permanent sidebar, full-screen sheet, glass panel, or decorative chat assistant.

## 15. Accessibility and safety invariants

The visual refactor must preserve:

- keyboard operation;
- visible focus;
- readable text contrast;
- explicit disabled/loading states;
- screen-reader labels;
- error and validation visibility;
- sensitive-data consent boundaries;
- explicit document attachment actions;
- explicit application-state changes;
- reduced-motion behavior.

Soft visual hierarchy may never obscure a safety or consent boundary.

## 16. Anti-patterns

Do not introduce:

- glassmorphism/backdrop blur as the main surface language;
- hard black shadows;
- glowing neon accents;
- gradient text;
- giant marketing-style hero typography inside the product;
- arbitrary 3-column dashboards for workflows that need full width;
- pastel color on every card without meaning;
- unreadably pale body text;
- deeply nested rounded containers with equal visual weight;
- decorative animation loops;
- duplicated navigation trees;
- hidden validation, failure, destructive, or sensitive state.

## 17. Ownership rule

When adding or changing UI:

1. Reuse shared tokens and primitives first.
2. Preserve the soft-bento depth hierarchy: canvas -> card -> inset entity/control.
3. Keep workflow semantics and safety behavior unchanged unless the product change explicitly requires it.
4. Update this contract when intentionally changing the design language.
5. Verify typecheck, tests, lint/format, and production build for the affected extension surface.

The target is one coherent Jobflow workspace: **soft gray canvas, raised rounded bento surfaces, selective blue emphasis, calm pastel depth, readable operational density, and no loss of product clarity.**