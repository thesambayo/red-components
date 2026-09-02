# Architecture & Patterns

## Package Structure (every package follows this)

```
packages/{component}/
├── src/
│   ├── {component}.ts          # Re-exports all web component classes
│   ├── {component}-root.ts     # Root component (state owner, context provider)
│   ├── {component}-trigger.ts  # Trigger component (if applicable)
│   ├── {component}-content.ts  # Content component (if applicable)
│   ├── {component}-close.ts    # Close component (if applicable)
│   ├── context.ts              # Lit context definitions + ID generation
│                               #   NOT consistent: also {component}-context.ts
│                               #   (combobox, select, switch, tabs, avatar) and
│                               #   dropdown.context.ts. Check before importing.
│   ├── types.ts                # TypeScript interfaces
│   ├── index.ts                # React wrapper exports (@lit/react)
│   └── {component}.stories.ts  # Storybook stories
├── dist/
│   ├── {component}.js          # Web component bundle
│   └── index.js                # React wrapper bundle
├── package.json
├── tsconfig.json
└── README.md
```

## Shadow DOM vs light DOM

Most components render `html\`<slot></slot>\`` and nothing else. The consumer's
markup therefore stays in the light DOM and is styleable normally - shadow
encapsulation costs nothing because the component supplies no content of its own.

**`combobox-input` is the exception and renders into the light DOM**
(`createRenderRoot() { return this; }`). It renders a real `<input>`, and inside
a shadow root that input was unstyleable (no `part` was exposed), could not be
targeted by an external `<label for>`, and forced `combobox-content` to pierce
the shadow root to move focus. The stories had already been written with
`combobox-input input { ... }` selectors that could never have matched.

Components that still render their own content into a shadow root - `avatar-image`
(`<img>`), `toast-root` (the `<li>` items), `tooltip-arrow` - expose **no
`::part()` hooks**, so their internals are likewise unstyleable. If a consumer
needs to style them, add `part` attributes or move them to the light DOM the same
way. Nothing forces this today because no styling has been attempted against them.

## State management: why not signals

State uses `@lit/context` plus `ControlledState` from core. Signals
(`@lit-labs/signals`) were evaluated and **deliberately not adopted**.

The case for them is real but narrow: every root rebuilds its whole context
object on any change and every consumer uses `subscribe: true`, so changing one
field invalidates every subscriber. In `select`, an ArrowDown changes
`_highlightedValue` and re-renders every option's three consumers, when only two
options actually changed.

**Update:** the churn was later confirmed to be a real problem, and was fixed
without signals. Item registration is coalesced into one microtask flush (it was
O(N^2) on mount), and `combobox-item` caches what it last wrote so a re-render
with unchanged state performs no DOM writes. See `COMPONENT_FIXES.md` §3. The
conclusion below still stands; only the "never profiled" line has changed.

Reasons not to adopt:

- The remaining cost is a re-render per subscriber with no DOM writes, which has
  not been shown to matter.
- A cheaper fix remains available if it ever does: split the volatile field into
  its own context (e.g. a separate `selectHighlightContext`) so items subscribe
  only to what they read. Try this before reaching for signals.
- `@lit-labs/signals` wraps a Stage 1 proposal. Acceptable in an app; risky in a
  library, where an API break propagates to every consumer.
- It would be a third state mechanism alongside context and `ControlledState`,
  reintroducing the fragmentation the core extraction removed.

Revisit only if profiling shows context churn matters and context splitting is
not enough.

## Shared Core (`@red-elements/core`)

Primitives shared by every package. Each was previously duplicated per package
and had drifted apart.

| Export | Purpose |
| --- | --- |
| `generateId(prefix)` | Unique DOM ids; one counter across all packages |
| `ControlledState<T>` | Controlled/uncontrolled state incl. late-default init for React |
| `FloatingController` | `computePosition` + `autoUpdate` anchor tracking for floating content |
| `attachBehavior` | Observes light DOM and wires behavior onto matching elements |
| `attachPopoverToggle` | Trigger wiring that survives Popover light dismiss; reports pointer vs keyboard |
| `attachDismiss` | Outside-click + Escape dismissal for `popover="manual"`, with a caller-declared boundary |
| `dispatch` | Namespaced `{component}:{kebab-event}` CustomEvents |

## Build Output (Rollup)

Each package is built as **one multi-input bundle** with two entries:

1. **Element entry** (`{component}.ts` -> `dist/{component}.js`), exposed as
   `@red-elements/{name}/elements` - the framework-agnostic entry
2. **React entry** (`index.ts` -> `dist/index.js`), exposed as `@red-elements/{name}`

Both entries import the component classes from a **shared chunk**, so each custom
element is registered exactly once. Building them separately would give each
entry its own copy of the classes, and importing both in one app would throw
`NotSupportedError: the name "x-root" has already been used`.

`lit`, `@lit/context`, `@floating-ui/dom` and `@red-elements/core` are external
peer/real dependencies, never inlined - bundling Lit would ship a private
`ReactiveElement` per package.

`scripts/check-dist.mjs` enforces all of the above after every build; minified
via terser.

## Core Patterns

### 1. Root-Children Composition (Slot-based)

Every component follows a **Root provides, Children consume** model:

```typescript
// Root: owns state, provides context
@customElement("dialog-root")
export class DialogRoot extends LitElement {
  @provide({ context: dialogContext })
  context: DialogContextValue = { ... };

  render() {
    return html`<slot></slot>`;
  }
}

// Child: consumes context
@customElement("dialog-trigger")
export class DialogTrigger extends LitElement {
  @consume({ context: dialogContext, subscribe: true })
  @state()
  private _context!: DialogContextValue;
}
```

### 2. Context Pattern (@lit/context)

Context is defined in the package's context module (see the naming caveat above):

```typescript
import { createContext } from "@lit/context";
import type { ComponentContextValue } from "./types";

export const componentContext = createContext<ComponentContextValue>("component");

let idCounter = 0;
export function generateId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
```

Context values include state + callbacks:

```typescript
export interface DialogContextValue {
  open: boolean;
  contentId: string;
  titleId: string;
  descriptionId: string;
  modal: boolean;
  onOpen: () => void;
  onClose: () => void;
  triggerRef: HTMLElement | null;
  contentRef: HTMLDialogElement | null;
}
```

### 3. Controlled / Uncontrolled State

All stateful root components support both patterns, via the `ControlledState`
controller from core. Do not hand-roll an `_isControlled` getter or a
`_hasInitialized` flag — that is what this replaced.

```typescript
@property({ type: Boolean, attribute: "default-open" })
defaultOpen = false;

/** Controlled. JS-only: no HTML attribute (see "Controlled mode is JS-only"). */
@property({ type: Boolean, attribute: false })
open?: boolean;

private _openState = new ControlledState<boolean>(this, {
  prop: () => this.open,                 // undefined ⇒ uncontrolled
  defaultValue: () => this.defaultOpen,
  fallback: false,
  name: "_isOpen",                       // so it appears in changedProperties
});

private get _isOpen(): boolean {
  return this._openState.value;
}
```

The controller also covers **late-arriving defaults**: React assigns properties
after the element connects, so `defaultOpen` is usually not readable in
`connectedCallback`.

Writing while controlled is a deliberate no-op — the consumer owns the value and
is expected to react to the change event, which you dispatch either way:

```typescript
this._openState.set(true);
this._dispatchOpenChange();   // always, regardless of the return value
```

**Two traps**, both of which have bitten this codebase:

- Lit runs `willUpdate` *before* controller `hostUpdate`, so state a controller
  owns can miss `changedProperties` entirely. For anything that must not be
  missed, derive from the effective value against a `_lastSynced` field — see
  `dialog-root.willUpdate`. (`docs/COMPONENT_FIXES.md` §4.)
- A component in controlled mode genuinely does nothing until the consumer
  writes the value back. That is correct, not broken. (§7 of the same document.)

### 4. Custom Events

Events bubble and compose (cross shadow DOM):

```typescript
this.dispatchEvent(
  new CustomEvent("openChange", {
    detail: { open: true },
    bubbles: true,
    composed: true,
  })
);
```

Common events:
- `openChange` - `{ open: boolean }` (Dialog, Tooltip, Dropdown)
- `change` - `string[]` (Accordion)
- `valueChange` - varies (Select)

### 5. Data Attributes for Styling (Unstyled Philosophy)

Components expose state via data attributes instead of built-in styles:

- `data-state="open"` / `data-state="closed"`
- `data-disabled`
- `data-selected`
- `data-highlighted`
- `data-placeholder`

Users style with CSS selectors:
```css
dialog-content[data-state="open"] { ... }
select-item[data-highlighted] { ... }
```

### 6. Native API Usage

| Component  | Native API                                         |
| ---------- | -------------------------------------------------- |
| Dialog     | `<dialog>` element, `showModal()`, `show()`        |
| Alert Dialog | `<dialog>` element (always modal, no escape close) |
| Dropdown   | Popover API (`popover="auto"`, `showPopover()`)    |
| Select     | ElementInternals (form participation)              |
| Tooltip    | @floating-ui/dom for positioning                   |

### 7. React Wrapper Pattern

All React wrappers use `createComponent` from `@lit/react`:

```typescript
import React from "react";
import { createComponent, EventName } from "@lit/react";
import { DialogRoot as DialogRootElement } from "./dialog-root";

export const DialogRoot = createComponent({
  tagName: "dialog-root",
  elementClass: DialogRootElement,
  react: React,
  events: {
    onOpenChange: "openChange" as EventName<CustomEvent<{ open: boolean }>>,
  },
});
```

### 8. Accessibility

- ARIA attributes set dynamically (`aria-expanded`, `aria-controls`, `aria-selected`, etc.)
- `role` attributes on interactive elements
- Keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Focus management (trap focus in modals, restore focus on close)
- ID linking via `aria-labelledby` / `aria-describedby`

### 9. Lifecycle Hooks Used

```typescript
connectedCallback()    // Setup event listeners, query children, init context
disconnectedCallback() // Cleanup listeners, clear timers
willUpdate(changed)    // Update context when deps change
firstUpdated()         // One-time setup after first render
updated()              // Update after every render
render()               // Always returns html`<slot></slot>`
```

### 10. Naming Conventions

| Context       | Convention   | Example                          |
| ------------- | ------------ | -------------------------------- |
| Web Component | kebab-case   | `<dialog-root>`, `<select-item>` |
| Custom Element Class | PascalCase | `DialogRoot`, `SelectItem`   |
| React Wrapper | PascalCase   | `DialogRoot`, `SelectItem`       |
| Package Name  | kebab-case   | `@red-elements/dialog`           |
| Events        | camelCase    | `openChange`, `valueChange`      |
| Attributes    | kebab-case   | `default-open`, `default-value`  |
