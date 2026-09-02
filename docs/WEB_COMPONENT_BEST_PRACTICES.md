# Web Component Best Practices & Pitfalls Guide

A comprehensive guide for building robust, framework-compatible web components with Lit.

**What This Guide Covers:**
- ✅ Framework compatibility (React, Vue, etc.)
- ✅ Property initialization timing issues
- ✅ Infinite update loop prevention
- ✅ Lit Context usage patterns
- ✅ Lifecycle method best practices
- ✅ Common anti-patterns to avoid

---

## Problem 1: Framework Property Initialization Timing

When using web components in frameworks like React, there's a critical timing issue with property initialization:

### How React Handles Custom Elements:
1. Creates the DOM element first (`document.createElement('my-component')`)
2. Appends it to the DOM (triggers `connectedCallback`)
3. **Then** sets properties via property assignment (`element.prop = value`)

### The Issue:
- `connectedCallback` runs **before** React sets properties
- If you only read properties in `connectedCallback`, they're still `undefined`
- By the time the property is set, initialization has already happened

### Example of the Problem:
```typescript
// ❌ This won't work in React
@customElement('my-select')
export class MySelect extends LitElement {
  @property({ attribute: 'default-value' })
  defaultValue?: string;

  @state()
  private _value?: string;

  connectedCallback() {
    super.connectedCallback();
    this._value = this.defaultValue; // undefined in React!
  }
}
```

```jsx
// React code - defaultValue is set AFTER connectedCallback runs
<my-select defaultValue="option1">
  <option value="option1">Option 1</option>
</my-select>
```

---

## The Solution: `ControlledState` from `@red-elements/core`

> **Superseded.** Earlier revisions of this document recommended hand-rolling a
> `_hasInitialized` flag plus a `willUpdate` block, and said that was what our
> components did. **It no longer is, and you should not write it.** Every root
> now uses the `ControlledState` reactive controller. The hand-rolled version is
> preserved further down only as background on *why* the problem exists.

Use the controller. It handles late-arriving defaults, controlled vs
uncontrolled mode, and form reset/restore in one place:

```typescript
import { ControlledState } from "@red-elements/core";

private _valueState = new ControlledState<string | undefined>(this, {
  prop: () => this.value,              // controlled property; undefined = uncontrolled
  defaultValue: () => this.defaultValue, // the `default-*` property
  fallback: undefined,
  name: "_value",                      // reported to Lit so it lands in changedProperties
});

private get _value() {
  return this._valueState.value;       // controlled prop if present, else internal
}

// writing: a deliberate no-op while controlled - the consumer owns the value,
// and is expected to react to the change event you dispatch regardless.
this._valueState.set(next);
```

### Why hand-rolling this is a trap

The hand-rolled pattern put the late-init check in `willUpdate` and relied on
`changedProperties`. That is exactly where it breaks, because Lit 3 runs
controller hooks **after** `willUpdate`:

```js
this.willUpdate(changedProperties);                    // ① first
this.__controllers?.forEach((c) => c.hostUpdate?.());  // ② then
this.update(changedProperties);                        // ③ discards the map
```

A default latched in step ② can never appear in the map step ① already read, and
`update()` replaces that map before anything else sees it. The failure is
**silent**: the value latches, renders correctly, and yet every `willUpdate`
block keyed on `changed.has("_value")` is skipped for it.

That is not hypothetical — it is why `default-value` and `default-checked` once
rendered correctly on screen but never reached `ElementInternals.setFormValue`,
so forms submitted empty until the user changed something by hand.
`ControlledState` now latches in `hostUpdate` and *announces* in `hostUpdated`,
where `requestUpdate` actually schedules a follow-up cycle. See
`docs/COMPONENT_FIXES.md` §4 for the full account.

**Rule of thumb:** for anything that must not be missed, derive from the
effective value against a `_lastSynced` field rather than reading
`changedProperties` — see `dialog-root.willUpdate`.

---

## Related behaviour: auto-selecting a lone option

Not a late-init concern, but it lives next to one. `combobox-root` selects the
only option when there is exactly one and nothing else has set a value:

```typescript
protected willUpdate() {
  if (
    this._value === undefined &&
    !this._valueState.isInitialized &&   // nothing has set a value yet
    this._items.size === 1 &&
    !this.multiple
  ) {
    const [firstValue] = this._items.keys();
    if (!this._items.get(firstValue)?.disabled) this._valueState.set(firstValue);
  }
}
```

`ControlledState.isInitialized` is what makes this safe: it is true once a
default has been applied *or* the value has been set at least once, so this can
never clobber a real choice.

## Checklist for New Components

When creating any new component with state initialization:

- [ ] **Use `ControlledState`** for anything with a `default-*` / controlled pair.
      Never rely solely on `connectedCallback`, and never track initialization
      with your own flag.
- [ ] **Do not key must-not-miss logic on `changedProperties.has(...)`** for
      state a controller owns. Compare against a `_lastSynced` field instead.
- [ ] **Provide sensible defaults** when properties are undefined
- [ ] **Test in React** — that is where late property assignment shows up
- [ ] **Use `@state()` for internal state** that triggers reactive updates
- [ ] **Never update context from within context change handlers** — avoid infinite loops
- [ ] **Use `firstUpdated` for one-time context registration** — not `willUpdate`
- [ ] **Coalesce per-item state writes.** A `@state` write per registering child
      rebuilds the context every child consumes; that is O(N²) on mount.
- [ ] **Watch for Lit update warnings** in the console during development

---

## Why This Matters

### Framework Differences:

**Vanilla HTML:**
```html
<!-- Attributes set before element connects -->
<tabs-root default-value="tab1"></tabs-root>
```

**React:**
```jsx
// Properties set AFTER element connects
<tabs-root defaultValue="tab1"></tabs-root>
```

**Vue:**
```vue
<!-- Similar to React - props set after connection -->
<tabs-root :default-value="'tab1'"></tabs-root>
```

### The Root Cause:

React and other frameworks optimize by:
1. Creating and mounting elements first (faster initial render)
2. Setting properties in a second pass (allows batching)

This is different from how HTML attributes work, where they're available before connection.

---

## Additional Best Practices

### 1. Always Use Reactive Property Updates
```typescript
// ✅ Good - Reactive
protected willUpdate(changed: Map<string, unknown>) {
  if (changed.has('someProperty')) {
    this._updateDerivedState();
  }
}

// ❌ Bad - Not reactive
@property()
set someProperty(value: string) {
  this._updateDerivedState(); // Might run at wrong time
}
```

### 2. Provide Sensible Defaults
```typescript
// ✅ Good - Component works without configuration
@property({ type: String })
orientation: 'horizontal' | 'vertical' = 'horizontal';

// ✅ Good - Auto-select first item
private _registerItem(value: string) {
  if (this._value === undefined && this._items.size === 0) {
    this._value = value;
  }
}
```

### 3. Document React Usage
```typescript
/**
 * @example React
 * ```jsx
 * <tabs-root defaultValue="tab1">
 *   <tabs-list>
 *     <tab-trigger value="tab1">Tab 1</tab-trigger>
 *   </tabs-list>
 * </tabs-root>
 * ```
 */
```

---

## Common Pitfalls & Anti-Patterns

### ⚠️ Pitfall 1: Infinite Update Loops with Lit Context

**The Problem:**

When using `@lit/context` with `subscribe: true`, changes to the context trigger `willUpdate` in consuming components. If you call methods that update the context from within `willUpdate`, you create an infinite loop.

**Example of the Problem:**

```typescript
// ❌ This creates an infinite loop!
@customElement('combobox-item')
export class ComboboxItem extends LitElement {
  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  protected willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('_context')) {
      // ❌ BAD: This calls registerItem, which updates context,
      // which triggers willUpdate again, which calls registerItem...
      this._context.registerItem(this.value, { /* ... */ });
      this._updateSelectionState();
      this._updateVisibility();
    }
  }
}
```

**What Happens:**
1. Context changes (e.g., selected value updates)
2. `willUpdate` runs with `_context` in changedProperties
3. `registerItem()` updates the context
4. Context change triggers `willUpdate` again
5. Infinite loop → browser hangs

**The Solution:**

Only **read** from context in `willUpdate`, never write to it. Initialize once in `firstUpdated`:

```typescript
// ✅ Good - No infinite loop
@customElement('combobox-item')
export class ComboboxItem extends LitElement {
  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  protected firstUpdated() {
    // ✅ Register once when element is first rendered
    // Context is guaranteed to be available here
    this._context.registerItem(this.value, {
      value: this.value,
      textContent: this.textContent?.trim() || '',
      disabled: this.disabled,
      element: this,
    });
  }

  protected willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('_context')) {
      // ✅ Only READ from context, never write
      this._updateSelectionState();
      this._updateVisibility();
      this._updateHighlightState();
    }

    if (changedProperties.has('disabled')) {
      // ✅ Update registration when properties change, not when context changes
      this._context.registerItem(this.value, {
        value: this.value,
        textContent: this.textContent?.trim() || '',
        disabled: this.disabled,
        element: this,
      });
    }
  }
}
```

**Key Rules:**

1. **Initialize in `firstUpdated`** - Register with context when element is ready
2. **Only read in `willUpdate`** - Use context data to update local state
3. **Write on property changes** - Update context when your own properties change, not when context changes
4. **Never write in context change handler** - Don't call context methods when `changedProperties.has('_context')`

**Real-World Discovery:**

This issue was discovered in the combobox component and caused:
- Browser hanging/freezing
- Page not rendering
- Console warning: "Element scheduled an update after an update completed"
- Infinite update cycle

**Console Warning to Watch For:**

```
Element combobox-item scheduled an update (generally because a property was
set) after an update completed, causing a new update to be scheduled. This is
inefficient and should be avoided unless the next update can only be scheduled
as a side effect of the previous update.
```

If you see this warning, check for circular dependencies in your `willUpdate` lifecycle method.

---

## Testing Strategy

### Test in Multiple Environments:
1. **Vanilla JS** - Properties set before/during/after connection
2. **React** - Properties set after connection
3. **Vue** - Similar to React
4. **Storybook** - Simulates framework usage

### Key Test Cases:
- Component works without `defaultValue` (fallback)
- Component works with `defaultValue` set immediately
- Component works with `defaultValue` set after connection (React)
- Multiple instances don't interfere with each other
- Changing `defaultValue` after initialization doesn't break state

---

## References

- [Lit Reactive Update Cycle](https://lit.dev/docs/components/lifecycle/#reactive-update-cycle)
- [React Custom Elements](https://react.dev/reference/react-dom/components#custom-html-elements)
- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/)

---

**Last Updated:** 2026-01-23
**Components Affected:** Tabs, Select, Combobox, Radio Group, and all stateful components with context
