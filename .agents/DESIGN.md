# Jobflow Visual Design Contract

This file is the visual source of truth for Jobflow. Product behavior lives in `PROJECT.md`; software/runtime boundaries live in `ARCHITECTURE.md`.

## 1. Design direction

Jobflow uses a **Compact Workbench UI**: dense, calm, operational, and hierarchy-first. The product should feel closer to a professional desktop utility or editor than a decorative SaaS dashboard.

The visual system prioritizes:

- compact information density;
- flat structural hierarchy;
- clear grouping through spacing and 1px dividers;
- small radii used only where a container truly needs a boundary;
- minimal elevation;
- selective blue for active state and primary action;
- stable alignment across forms, records, and workspace tools.

The design must not rely on repeated rounded cards, ambient shadows, decorative gradients, or nested surfaces to create hierarchy.

## 2. Core hierarchy

Use only three structural levels:

1. **Application shell** — sidebar, top bar, workspace background.
2. **Task section** — one bounded region for a meaningful module.
3. **Row / field / control** — content inside the section.

Repeated records inside a section are rows separated by dividers, not another layer of floating cards.

A subsection inside a section should normally use a heading + top divider. Do not wrap it in another rounded surface unless it is an independent interaction boundary.

## 3. Foundation palette

### Light

```text
background        #F6F7F8
surface           #FFFFFF
surface-muted     #F2F4F6
border            #E2E5E9
border-strong     #C7CCD3
ink               #1F242B
text              #535B66
subtle            #808893
accent            #3D7EC1
accent-strong     #27629E
accent-soft       #E6EFF8
success           #278F5F
warning           #B7791C
danger            #C94343
```

### Dark

```text
background        #141619
surface           #1B1E22
surface-raised    #1E2226
surface-muted     #22262B
border            #30353B
border-strong     #484F57
ink               #F2F4F6
text              #BCC2C9
subtle            #89919A
accent            #68A5DD
accent-strong     #8BBBE7
accent-soft       #233444
```

Semantic colors keep their normal meanings. Decorative color is not a hierarchy primitive.

## 4. Geometry

Canonical geometry:

```text
application shell          0px radius
first-level section        8–10px radius
subsection                  0px; divider-based
record row                  0px; divider-based
input / button              6–8px radius
pill                        999px only for true tags/status
control height              ~34–36px desktop
coarse-pointer target       44px minimum where needed
```

Large 16–30px radii are not part of the default product language.

## 5. Elevation

Default elevation is **none**.

Use borders, background contrast, spacing, and typography before shadows. Shadows are reserved for surfaces that physically overlay another surface, such as popovers, dialogs, or the temporarily expanded desktop navigation.

Never stack shadows between parent section, child subsection, repeated record, and control.

## 6. Application shell

### Desktop

- navigation rail remains 56px collapsed;
- expanded navigation overlays content rather than resizing it;
- expanded navigation width stays compact, approximately 224px;
- top bar is approximately 48px high;
- sidebar and top bar are edge-aligned structural chrome, not floating cards;
- workspace starts immediately below the top bar;
- outer workspace padding is small, normally 12px;
- no rounded outer workspace canvas.

### Mobile

- navigation uses the same destinations and ownership;
- remove floating-card shell treatment;
- workspace gutter is normally 8px;
- controls remain readable and tappable.

## 7. Sections and records

### First-level section

Use one section boundary per independently understandable task area:

- 1px border;
- 8–10px radius;
- no ambient shadow;
- 12–16px padding;
- 8–12px internal gap.

### Subsection

Use:

- top divider;
- compact heading;
- 8–12px spacing.

Do not create a card inside a card for ordinary subsection grouping.

### Repeated records

Use list rows:

- top divider between records;
- transparent or parent surface background;
- no radius;
- no shadow;
- approximately 10px vertical padding.

This rule applies to application records, experience, education, documents, corrections, and similar repeated entities unless the record is itself an independent draggable/interactive object.

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
body/control/table      13–14px
section title           14–15px
supporting text         12–13px
technical mono          12–13px
page title              15–18px
```

Avoid oversized headings inside operational surfaces.

## 9. Controls

### Primary action

- blue fill;
- white text;
- 6–8px radius;
- no glow or ambient shadow;
- one dominant primary action per local workflow.

### Secondary/default

- surface or transparent background;
- 1px border where needed;
- no shadow;
- subtle background change on hover.

### Inputs

- 6–8px radius;
- 1px border;
- no inset highlight or ambient shadow;
- blue 2px focus ring;
- compact horizontal padding.

### Danger

Danger remains semantic red. Never recolor destructive actions as the product accent.

## 10. Navigation

- collapsed navigation is icon-first and keyboard accessible;
- active destination uses a quiet blue tint, not a raised tile;
- inactive destinations stay transparent until hover;
- no hover lift or hover shadow;
- group headings are compact metadata;
- generic icons come from `lucide-react`;
- icon-only controls require accessible labels/titles.

## 11. Motion

Use Motion for React only where it clarifies spatial change:

- sidebar expansion/collapse;
- overlay/panel enter and exit;
- meaningful view transitions.

Do not animate routine cards, rows, fields, or hover elevation. Keep transitions short and respect reduced motion.

## 12. In-page assistant

The assistant remains isolated in Shadow DOM and overlays the host page.

When visually converged, apply the same compact rules:

- one panel boundary;
- compact tabs and controls;
- minimal shadow only because the panel overlays the host page;
- blue active/primary states;
- divider-based internal grouping;
- explicit semantic warning and sensitive states.

Do not convert it into a permanent host-page sidebar or decorative chat surface.

## 13. Accessibility and safety invariants

The visual system must preserve:

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

Compact must never mean ambiguous or undersized to the point of harming operation.

## 14. Anti-patterns

Do not introduce:

- card-inside-card-inside-card hierarchy;
- equal visual weight for parent and child containers;
- large rounded bento tiles as the default layout;
- repeated ambient shadows;
- decorative gradients or glow;
- glassmorphism/backdrop blur as a primary surface language;
- hover lift on routine controls;
- arbitrary dashboard grids;
- excessive whitespace between related fields;
- oversized product headings;
- pastel color without semantic meaning;
- hidden validation, failure, destructive, or sensitive state.

## 15. Ownership rule

When adding or changing UI:

1. Reuse shared tokens and primitives first.
2. Prefer spacing/dividers over another container.
3. Keep one strong boundary per task region.
4. Keep workflow semantics and safety behavior unchanged unless explicitly requested.
5. Update this contract when intentionally changing the design language.
6. Verify typecheck, tests, lint/format, and production build for the affected extension surface.

Target: **compact shell, one section boundary, flat repeated rows, small controls, selective blue emphasis, and no decorative container stacking.**
