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

## The Solution: Late Initialization Pattern

### Pattern 1: Track Initialization + willUpdate (Recommended)

This is the most robust approach used in our components:

```typescript
@customElement('my-component')
export class MyComponent extends LitElement {
  @property({ attribute: 'default-value' })
  defaultValue?: string;

  @state()
  private _value?: string;

  /** Track if we've initialized from defaultValue */
  private _hasInitialized = false;

  connectedCallback() {
    super.connectedCallback();

    // Initialize with default value if available
    if (this.defaultValue !== undefined) {
      this._value = this.defaultValue;
      this._hasInitialized = true;
    }

    this._updateContext();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Handle late initialization of defaultValue (for React compatibility)
    // React often sets properties after the element is connected
    if (
      changed.has('defaultValue') &&
      !this._hasInitialized &&
      this.defaultValue !== undefined &&
      this._value === undefined
    ) {
      this._value = this.defaultValue;
      this._hasInitialized = true;
    }

    // Update context when relevant properties change
    if (changed.has('_value') || changed.has('otherProp')) {
      this._updateContext();
    }
  }
}
```

### Pattern 2: Auto-Select Fallback

Provide sensible defaults when no value is specified:

```typescript
private _registerItem(value: string) {
  this._registeredItems = new Set(this._registeredItems).add(value);

  // Auto-select first item if no value is set
  // This ensures an item is always selected even without defaultValue
  if (this._value === undefined && this._registeredItems.size === 1) {
    this._value = value;
    this._hasInitialized = true;
  }
}
```

### Pattern 3: Property Setters (Alternative)

Use custom setters for immediate handling:

```typescript
private _defaultValue?: string;
private _value?: string;
private _hasInitialized = false;

@property({ attribute: 'default-value' })
set defaultValue(value: string | undefined) {
  const oldValue = this._defaultValue;
  this._defaultValue = value;

  // Initialize if not yet done
  if (!this._hasInitialized && value !== undefined) {
    this._value = value;
    this._hasInitialized = true;
  }

  this.requestUpdate('defaultValue', oldValue);
}

get defaultValue() {
  return this._defaultValue;
}
```

### Pattern 4: Microtask Delay (Last Resort)

For simple cases, defer initialization:

```typescript
connectedCallback() {
  super.connectedCallback();

  // Wait a microtask for properties to be set
  queueMicrotask(() => {
    if (this._value === undefined && this.defaultValue !== undefined) {
      this._value = this.defaultValue;
    }
  });
}
```

---

## Complete Example: Tabs Component

Here's how we implemented this in the tabs component:

```typescript
@customElement('tabs-root')
export class TabsRoot extends LitElement {
  @property({ attribute: 'default-value' })
  defaultValue?: string;

  @state()
  private _value?: string;

  @state()
  private _registeredContents = new Set<string>();

  /** Track if we've initialized from defaultValue */
  private _hasInitialized = false;

  connectedCallback() {
    super.connectedCallback();

    // Initialize with default value if available
    if (this.defaultValue !== undefined) {
      this._value = this.defaultValue;
      this._hasInitialized = true;
    }

    this._updateContext();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Handle late initialization of defaultValue (for React compatibility)
    if (
      changed.has('defaultValue') &&
      !this._hasInitialized &&
      this.defaultValue !== undefined &&
      this._value === undefined
    ) {
      this._value = this.defaultValue;
      this._hasInitialized = true;
    }

    // Update context when any relevant property changes
    if (
      changed.has('_value') ||
      changed.has('orientation') ||
      changed.has('_registeredContents')
    ) {
      this._updateContext();
    }
  }

  private _registerContent(value: string) {
    this._registeredContents = new Set(this._registeredContents).add(value);

    // Auto-select first tab if no value is set
    if (this._value === undefined && this._registeredContents.size === 1) {
      this._value = value;
      this._hasInitialized = true;
    }
  }
}
```

---

## Checklist for New Components

When creating any new component with state initialization:

- [ ] **Never rely solely on `connectedCallback`** for property initialization
- [ ] **Use `willUpdate`** to catch late property setting from React
- [ ] **Track initialization state** with `_hasInitialized` flag
- [ ] **Provide sensible defaults** when properties are undefined
- [ ] **Test in React** to verify initialization works correctly
- [ ] **Use `@state()` for internal state** that triggers reactive updates
- [ ] **Use `willUpdate` for derived state** instead of computed properties
- [ ] **Never update context from within context change handlers** - avoid infinite loops
- [ ] **Use `firstUpdated` for one-time context registration** - not `willUpdate`
- [ ] **Watch for Lit update warnings** in console during development

---

## Components Status

### ✅ Implemented Correctly:
- **Accordion** - Uses proper initialization pattern
- **Tabs** - Fixed with late initialization handling
- **Avatar** - Simple component, no initialization issues
- **Dialog** - Handles initialization correctly
- **Dropdown** - Handles initialization correctly
- **Combobox** - Fixed infinite loop issues, proper disabled item handling

### 🔜 Apply to Future Components:
- Select
- Radio Group
- Checkbox Group
- Toggle Group
- Slider
- Any component with `defaultValue`, `defaultChecked`, `defaultOpen`, etc.

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
