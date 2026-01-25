# Popover API Migration Summary

## Overview
Successfully migrated **dropdown**, **tooltip**, **select**, and **combobox** components to use the native **Popover API**, eliminating custom portal solutions while retaining `@floating-ui/dom` for positioning.

## Key Architectural Decisions

### 1. Popover API Usage
- **Dropdown**: `popover="auto"` - native light dismiss (click outside, Escape key)
- **Select**: `popover="auto"` - native light dismiss, fully controlled open/close state
- **Combobox**: `popover="manual"` - programmatic control for search interactions
- **Tooltip**: `popover="manual"` - programmatic control via hover/focus
- **Toast**: No changes - works well with `position: fixed`

### 2. Positioning Strategy
- Keep `@floating-ui/dom` for positioning (flip, shift, offset middleware)
- CSS Anchor Positioning not used due to limited browser support (~27%)
- Popover API handles top-layer rendering automatically

### 3. Portal Removal
- Removed `dropdown-portal.ts` component entirely
- Popover API's top-layer eliminates need for DOM cloning
- Simplified component structure: `root > trigger + content`

## Dropdown Component

### Component Structure
```
dropdown-root          // Coordinates trigger and content
├── dropdown-trigger   // Opens dropdown (supports as-child)
└── dropdown-content   // Menu container (popover="auto")
    ├── dropdown-item
    ├── dropdown-label
    └── dropdown-separator
```

### Key Files & Changes

#### `dropdown-content.ts`
- Uses `popover="auto"` for automatic light dismiss
- Listens to `toggle` event instead of manual click-outside
- Calls `showPopover()`/`hidePopover()` methods
- CSS: `:popover-open` pseudo-class replaces z-index hacks
- Data attributes: `data-state="open|closed"`, `data-side`, `data-align`
- Keyboard navigation: ArrowUp/Down, Home/End, Escape

#### `dropdown-trigger.ts`
- **`as-child` attribute**: Pass behavior to slotted child element
- Without `as-child`: Component acts as trigger itself
- With `as-child`: Behavior delegated to slotted `<button>` or element
- Calls `content.togglePopover()` on click
- Data attributes: `data-state="open|closed"`
- ARIA: `aria-haspopup="menu"`, `aria-expanded`

#### `dropdown-root.ts`
- Generates unique ID for dropdown instance
- Listens to content's `toggle` event
- Updates trigger state via `trigger.updateState()`
- Dispatches custom events: `dropdown:open`, `dropdown:close`
- Returns focus to trigger on close

#### `dropdown-item.ts`
- Data attributes: `data-disabled` when disabled
- ARIA: `aria-disabled="true"` when disabled
- Auto-closes dropdown on selection
- Dispatches `dropdown:item-select` event with value

#### `dropdown-separator.ts`
- Data attributes: `data-orientation="horizontal|vertical"`
- ARIA: `aria-orientation` attribute

#### `dropdown-context.ts` (simplified)
```typescript
export const DROPDOWN_EVENTS = {
  OPEN: "dropdown:open",
  CLOSE: "dropdown:close",
  ITEM_SELECT: "dropdown:item-select",
};

export function generateDropdownId(): string {
  return `dropdown-${++idCounter}`;
}
```

### Usage Examples

**Basic (without as-child)**
```html
<dropdown-root>
  <dropdown-trigger>Open Menu</dropdown-trigger>
  <dropdown-content side="bottom" align="start">
    <dropdown-item value="edit">Edit</dropdown-item>
    <dropdown-item value="delete">Delete</dropdown-item>
  </dropdown-content>
</dropdown-root>
```

**With as-child**
```html
<dropdown-root>
  <dropdown-trigger as-child>
    <button class="custom-button">Open Menu</button>
  </dropdown-trigger>
  <dropdown-content side="bottom" align="start">
    <dropdown-item value="edit">Edit</dropdown-item>
  </dropdown-content>
</dropdown-root>
```

### API Properties

**dropdown-content**
- `side`: "top" | "right" | "bottom" | "left" (default: "bottom")
- `align`: "start" | "center" | "end" (default: "start")
- `side-offset`: number (default: 4)
- `align-offset`: number (default: 0)

**dropdown-trigger**
- `as-child`: boolean (default: false)

**dropdown-item**
- `value`: string (optional)
- `disabled`: boolean (default: false)

**dropdown-separator**
- `orientation`: "horizontal" | "vertical" (default: "horizontal")

### Events
- `dropdown:open` - Fired when dropdown opens
- `dropdown:close` - Fired when dropdown closes
- `dropdown:item-select` - Fired when item selected (detail: {dropdownId, value})

## Select Component

### Component Structure
```
select-root               // State management, form integration, context provider
├── select-trigger        // Opens/closes select (supports value display)
│   └── select-value      // Displays selected value(s)
└── select-content        // Options container (popover="auto")
    ├── select-item       // Selectable option
    ├── select-group      // Group of items
    └── select-label      // Group label
```

### Key Files & Changes

#### `select-root.ts`
- Context-based architecture using `@lit/context`
- Form integration via ElementInternals API
- Supports both controlled (`value`, `open`) and uncontrolled (`defaultValue`, `defaultOpen`) modes
- Handles single and multiple selection
- **CRITICAL**: Element setters (setTriggerElement, setContentElement, etc.) do NOT call `_updateContext()`
  - These are just internal references for positioning/focus management
  - Calling `_updateContext()` would trigger infinite update loops
- Form callbacks: `formResetCallback()`, `formDisabledCallback()`, `formStateRestoreCallback()`
- Multiple values submit as FormData (like native `<select multiple>`)

#### `select-content.ts`
- Uses `popover="auto"` for automatic light dismiss
- **Host element IS the popover** (not a child element)
- Listens to `toggle` event for popover state changes
- Syncs back to root context when user dismisses via Escape/click outside
- Floating UI positioning with middleware:
  - `offset()` - distance from trigger
  - `flip()` - flip to opposite side if no room
  - `shift()` - shift along axis to stay in viewport
  - `size()` - set CSS variables for responsive sizing
- Keyboard navigation: ArrowUp/Down, Home/End, Enter/Space, Escape, Tab
- Auto-focuses first selected item on open (or first enabled item)
- CSS variables exposed: `--select-trigger-width`, `--select-available-height`, etc.

#### `select-trigger.ts`
- Registers with root in `firstUpdated()` lifecycle
- Uses `@state()` for context consumption (not `@property()`)
- Updates ARIA attributes: `aria-expanded`, `aria-controls`, `aria-disabled`
- Data attributes: `data-state="open|closed"`, `data-disabled`, `data-placeholder`
- Keyboard support: Space, Enter, ArrowDown/Up open select; Escape closes

#### `select-item.ts`
- Provides own context via `selectItemContext` for children (checkbox, indicator, etc.)
- **CRITICAL**: Only has `@property({ attribute: false })` for context, NOT `@state()`
  - Having both decorators causes infinite loops
- Updates item context only when selection state actually changes
- Registers/unregisters with root in lifecycle methods
- Updates registration when `disabled` property changes

#### `select-value.ts`
- Displays selected item text(s)
- Supports placeholder when no selection
- Handles multiple values (comma-separated or custom separator)

### Usage Examples

**Basic (Uncontrolled)**
```html
<select-root name="fruit" default-value="apple">
  <select-trigger>
    <select-value placeholder="Select a fruit..."></select-value>
  </select-trigger>
  <select-content>
    <select-item value="apple">Apple</select-item>
    <select-item value="banana">Banana</select-item>
    <select-item value="orange">Orange</select-item>
  </select-content>
</select-root>
```

**Controlled (React)**
```tsx
const [value, setValue] = useState<string>();
const [open, setOpen] = useState(false);

<SelectRoot
  value={value}
  open={open}
  onValueChange={(e) => setValue(e.detail.value)}
  onOpenChange={(e) => setOpen(e.detail.open)}
>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="one">Option 1</SelectItem>
    <SelectItem value="two">Option 2</SelectItem>
  </SelectContent>
</SelectRoot>
```

**Multiple Selection**
```html
<select-root name="fruits[]" multiple default-value='["apple","banana"]'>
  <select-trigger>
    <select-value placeholder="Select fruits..."></select-value>
  </select-trigger>
  <select-content>
    <select-item value="apple">Apple</select-item>
    <select-item value="banana">Banana</select-item>
  </select-content>
</select-root>
```

### API Properties

**select-root**
- `name`: string - Form field name
- `value`: string | string[] - Controlled value
- `defaultValue`: string | string[] - Initial value (uncontrolled)
- `open`: boolean - Controlled open state
- `defaultOpen`: boolean - Initial open state (uncontrolled)
- `multiple`: boolean - Allow multiple selection
- `disabled`: boolean - Disable the select
- `required`: boolean - Form validation

**select-content**
- `side`: "top" | "right" | "bottom" | "left" (default: "bottom")
- `align`: "start" | "center" | "end" (default: "start")
- `side-offset`: number (default: 4)
- `align-offset`: number (default: 0)

**select-item**
- `value`: string (required)
- `disabled`: boolean (default: false)

**select-value**
- `placeholder`: string - Text when no selection

### Events
- `select:value-change` - When selected value changes (detail: {value})
- `select:open-change` - When open state changes (detail: {open})
- `select:open` - When select opens
- `select:close` - When select closes

### Focus Management
- When select opens: focuses first selected item (or first enabled item)
- When select closes: returns focus to trigger
- Uses `requestAnimationFrame()` for reliable focus timing

## Combobox Component

### Component Structure
```
combobox-root             // State management, filtering, form integration
├── combobox-input        // Search input (manages search term)
└── combobox-content      // Filtered results (popover="manual")
    ├── combobox-item     // Selectable option
    ├── combobox-group    // Group of items
    ├── combobox-empty    // Empty state
    └── combobox-label    // Group label
```

### Key Files & Changes

#### `combobox-root.ts`
- Similar to select-root but with additional search/filter state
- Filter modes: `"client"` (automatic filtering) or `"manual"` (custom filtering)
- Search term state: `_searchTerm`
- Filtered items: `_filteredItems` Set
- Behavior options:
  - `resetSearchTermOnBlur` - Clear search on close (default: true)
  - `resetSearchTermOnSelect` - Clear search on selection (default: true)
  - `openOnFocus` - Auto-open on input focus (default: false)
  - `openOnClick` - Auto-open on input click (default: true)
- **CRITICAL**: Element setters do NOT call `_updateContext()` (same pattern as select)

#### `combobox-content.ts`
- Uses `popover="manual"` for programmatic control
- Input field controls when to open (not just click outside to dismiss)
- Keyboard navigation with filtered results
- Auto-highlights first filtered result

#### `combobox-input.ts`
- Manages input value and search term
- ARIA: `aria-autocomplete="list"`, `aria-controls`, `aria-expanded`
- Keyboard support: ArrowDown opens, Escape closes
- Input event updates search term and triggers filtering

### Usage Examples

**Basic Combobox**
```html
<combobox-root name="country" default-value="us">
  <combobox-input placeholder="Search countries..."></combobox-input>
  <combobox-content>
    <combobox-item value="us">United States</combobox-item>
    <combobox-item value="uk">United Kingdom</combobox-item>
    <combobox-item value="ca">Canada</combobox-item>
    <combobox-empty>No results found</combobox-empty>
  </combobox-content>
</combobox-root>
```

**Manual Filtering**
```tsx
<ComboboxRoot
  filterMode="manual"
  onSearchChange={(e) => {
    const term = e.detail.searchTerm;
    // Custom filtering logic...
  }}
>
  <ComboboxInput />
  <ComboboxContent>
    {filteredItems.map(item => (
      <ComboboxItem value={item.id}>{item.label}</ComboboxItem>
    ))}
  </ComboboxContent>
</ComboboxRoot>
```

### API Properties

**combobox-root**
- All properties from select-root, plus:
- `filterMode`: "client" | "manual" (default: "client")
- `resetSearchTermOnBlur`: boolean (default: true)
- `resetSearchTermOnSelect`: boolean (default: true)
- `openOnFocus`: boolean (default: false)
- `openOnClick`: boolean (default: true)

**combobox-input**
- Standard HTML input attributes (placeholder, disabled, etc.)

**combobox-content**
- Same positioning properties as select-content

### Events
- `combobox:value-change` - When selected value changes
- `combobox:search-change` - When search term changes (detail: {searchTerm})
- `combobox:open` - When combobox opens
- `combobox:close` - When combobox closes

### Focus Management
- When combobox closes: returns focus to input
- Uses `requestAnimationFrame()` for reliable focus timing

## Tooltip Component

### Component Structure
```
tooltip-provider (optional)
└── tooltip-root
    ├── tooltip-trigger
    └── tooltip-content (popover="manual")
        └── tooltip-arrow (optional)
```

### Key Changes

#### `tooltip-content.ts`
- Uses `popover="manual"` - no automatic light dismiss
- Hover/focus controls visibility programmatically
- Calls `showPopover()`/`hidePopover()` in `_show()`/`_hide()`
- CSS: `:popover-open` pseudo-class
- Track state with `_isPopoverOpen` boolean
- Provider coordination unchanged

#### `tooltip-trigger.ts`
- No changes needed - already handles accessibility via context
- Uses `aria-describedby` pointing to content ID

### Data Attributes & States
- Content: `data-state="closed|delayed-open|instant-open"`
- No `as-child` support needed (tooltip trigger doesn't require it)

## CSS Pattern

### Before (with z-index)
```css
:host {
  position: fixed;
  z-index: 9999;
}
:host([data-state="closed"]) {
  display: none !important;
}
```

### After (with Popover API)
```css
:host {
  position: fixed;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

:host(:not(:popover-open)) {
  display: none;
}
```

## Deleted Files
- `packages/dropdown/src/dropdown-portal.ts`
- `packages/dropdown/src/randomId.ts` (replaced with `generateDropdownId()`)

## Modified Files

### Dropdown
- `dropdown-content.ts` - Complete rewrite with Popover API
- `dropdown-trigger.ts` - Complete rewrite with as-child support
- `dropdown-root.ts` - Complete rewrite, simplified
- `dropdown-item.ts` - Added data-disabled, aria-disabled
- `dropdown-separator.ts` - Added data-orientation, aria-orientation
- `dropdown-context.ts` - Simplified, removed portal references
- `dropdown.ts` - Removed DropdownPortal export
- `index.ts` - Removed DropdownPortal React wrapper
- `dropdown.stories.ts` - Removed portal wrapper, added AsChild story

### Select
- `select-root.ts` - Context-based architecture, form integration, element setters fixed
- `select-trigger.ts` - Uses @state() for context, registers in firstUpdated()
- `select-content.ts` - Host element as popover with popover="auto", Floating UI positioning
- `select-item.ts` - Fixed decorator usage, change detection in item context
- `select-value.ts` - Displays selected values with placeholder support
- `select-context.ts` - Context definitions and event constants
- `select.ts` - Base exports for React wrappers
- `index.ts` - React component wrappers using @lit/react
- `select.stories.ts` - Comprehensive examples including forms

### Combobox
- `combobox-root.ts` - Fixed element setters to not call _updateContext(), added focus management
- `combobox-input.ts` - Input handling with search term
- `combobox-content.ts` - Popover with manual mode for search interactions
- `combobox-item.ts` - Fixed update loop with proper decorator usage
- `combobox-context.ts` - Context with filter state
- `combobox.stories.ts` - Examples with client and manual filtering

### Tooltip
- `tooltip-content.ts` - Updated to use popover="manual"
- No changes to trigger, provider, root, or arrow

## Browser Support
- Popover API: Chrome 114+, Edge 114+, Safari 17+, Firefox 125+
- Consider polyfill for older browsers if needed

## Breaking Changes
1. **Dropdown Portal Removal**: Users must remove `<dropdown-portal>` wrapper
2. **Browser Support**: Requires Popover API support (or polyfill)
3. **Event Names**: Now use `:` separator (`dropdown:open` vs `dropdown-open`)

## Implementation Notes

### Why Manual togglePopover() Calls?
- `popovertarget` attribute only works natively on `<button>` elements
- Custom elements require manual `togglePopover()` calls
- `as-child` pattern allows delegation to actual buttons when needed

### Focus Management
- Dropdown content auto-focuses first item on open
- On close, focus returns to trigger (or trigger's child element if as-child)
- Keyboard navigation handled by content component

### State Synchronization
- Root listens to content's `toggle` event (from Popover API)
- Root calls `trigger.updateState()` to sync ARIA and data attributes
- Trigger's `updateState()` handles both self and child element states

## Common Patterns & Best Practices

### 1. Popover API - `auto` vs `manual`

**Use `popover="auto"` when:**
- You want automatic light dismiss (Escape, click outside)
- You want controlled open/close state with programmatic control
- Component should close when user interacts elsewhere
- Examples: dropdown, select

**Use `popover="manual"` when:**
- You need full programmatic control of open/close
- Light dismiss would interfere with UX (e.g., hovering between trigger and content)
- Examples: tooltip, combobox (input controls dismissal)

**Important**: Both modes support controlled open/close via `showPopover()`/`hidePopover()`!

### 2. Controlled Open/Close with Popover API

Pattern used in select-content.ts (lines 97-127):

```typescript
private _previousOpen = false;

protected updated() {
  if (!this._context) return;

  // Controlled by your state
  if (this._context.isOpen && !this._previousOpen) {
    // Opening
    try {
      this.showPopover();
    } catch (e) {
      // Popover may already be open
    }
  } else if (!this._context.isOpen && this._previousOpen) {
    // Closing
    try {
      this.hidePopover();
    } catch (e) {
      // Popover may already be hidden
    }
  }

  this._previousOpen = this._context.isOpen;
}

private _handleToggle = (event: ToggleEvent) => {
  if (event.newState === "open") {
    this.setAttribute("data-state", "open");
    this._positionContent();
  } else {
    this.setAttribute("data-state", "closed");
    // User dismissed via Escape or click outside
    // Sync back to your state
    if (this._context?.isOpen) {
      this._context.onClose();
    }
  }
};
```

**Key points:**
- Your state controls the popover via `showPopover()`/`hidePopover()`
- The `toggle` event syncs user dismissals back to your state
- `popover="auto"` gives you both controlled state AND automatic light dismiss

### 3. CRITICAL: Avoiding Infinite Update Loops

**Problem:** Lit reactive properties can cause infinite loops if not managed carefully.

**Rule 1: Never call `_updateContext()` from element reference setters**

```typescript
// ❌ WRONG - Causes infinite loops
setTriggerElement(element: HTMLElement | null) {
  this._triggerElement = element;
  this._updateContext(); // This triggers re-render in consumers!
}

// ✅ CORRECT - Just store the reference
setTriggerElement(element: HTMLElement | null) {
  this._triggerElement = element;
  // No context update needed - these are just internal references
  // for positioning and focus management
}
```

**Why?** Element references are used for positioning and focus - they're not reactive state that child components need to react to. Updating context causes all consumers to re-render, which may call the setter again, creating a loop.

**Rule 2: Only READ from context in lifecycle methods, never WRITE**

```typescript
// ❌ WRONG - Writing to context when context changes
protected willUpdate(changed: Map<string, unknown>) {
  if (changed.has("_context")) {
    this._context.registerItem(...); // Modifies parent state!
  }
}

// ✅ CORRECT - Register when OWN properties change
protected willUpdate(changed: Map<string, unknown>) {
  if (changed.has("disabled")) {
    this._context.registerItem(this.value, {
      disabled: this.disabled,
      // ...
    });
  }
}
```

**Rule 3: Use correct decorators for context consumption**

```typescript
// ❌ WRONG - Both @state() and @property() causes double reactivity
@consume({ context: selectRootContext, subscribe: true })
@state()
@property({ attribute: false })
private _context!: SelectContextValue;

// ✅ CORRECT - Just @state() for internal reactivity
@consume({ context: selectRootContext, subscribe: true })
@state()
private _context!: SelectContextValue;

// OR for components that don't need double reactivity:
@consume({ context: selectRootContext, subscribe: true })
@property({ attribute: false })
private _context!: SelectContextValue;
```

**Rule 4: Only update child context when values actually change**

```typescript
private _updateItemContext() {
  const isSelected = this._isSelected();

  // Only update if actually changed
  if (!this._itemContext || this._itemContext.isSelected !== isSelected) {
    this._itemContext = {
      isSelected,
      isHighlighted: this._isHighlighted(),
    };
  }
}
```

### 4. Focus Management Pattern

**Always return focus to trigger/input on close:**

```typescript
private _handleClose() {
  this._isOpen = false;
  // ... other close logic ...

  // Return focus - use requestAnimationFrame for reliability
  if (this._triggerElement) {
    requestAnimationFrame(() => {
      this._triggerElement?.focus();
    });
  }
}
```

**Why `requestAnimationFrame()`?**
- Ensures DOM has settled after popover closes
- Prevents race conditions with browser's focus management
- More reliable than `setTimeout(0)`

### 5. Host Element as Popover Pattern

**Use the host element as the popover, not a child:**

```typescript
// ❌ WRONG - Child div as popover
protected render() {
  return html`
    <div popover="auto">
      <slot></slot>
    </div>
  `;
}

// ✅ CORRECT - Host is the popover
connectedCallback() {
  super.connectedCallback();
  this.setAttribute("popover", "auto");
}

protected render() {
  return html`<slot></slot>`;
}
```

**Benefits:**
- Simpler structure, fewer DOM nodes
- Easier styling (no wrapper to work around)
- Direct access to popover methods (`this.showPopover()`)

### 6. Floating UI Positioning Pattern

Standard middleware configuration for all popover content:

```typescript
const { x, y, placement: finalPlacement } = await computePosition(
  triggerElement,
  contentElement,
  {
    strategy: "fixed",
    placement: this._getPlacement(), // "bottom-start", etc.
    middleware: [
      offset({
        mainAxis: this.sideOffset,      // Distance from trigger
        crossAxis: this.alignOffset,     // Alignment adjustment
      }),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift({ padding: 8 }),              // Keep in viewport
      size({
        padding: 8,
        apply: ({ availableWidth, availableHeight, rects }) => {
          // Expose as CSS variables for responsive sizing
          this.style.setProperty("--trigger-width", `${rects.reference.width}px`);
          this.style.setProperty("--available-height", `${availableHeight}px`);
        },
      }),
    ],
  }
);

// Apply position
this.style.left = `${x}px`;
this.style.top = `${y}px`;

// Expose actual placement for styling
const [side, align] = finalPlacement.split("-");
this.setAttribute("data-side", side);
this.setAttribute("data-align", align || "center");
```

### 7. Form Integration with ElementInternals

Pattern for form-associated custom elements:

```typescript
export class MyFormControl extends LitElement {
  static formAssociated = true;
  private _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  private _updateFormValue() {
    if (!this.name) return; // Not participating in form

    if (this._value === undefined || this._value === null) {
      this._internals.setFormValue(null);
      return;
    }

    if (Array.isArray(this._value)) {
      // Multiple values - use FormData (like <select multiple>)
      if (this._value.length === 0) {
        this._internals.setFormValue(null);
        return;
      }
      const formData = new FormData();
      this._value.forEach((v) => formData.append(this.name!, v));
      this._internals.setFormValue(formData);
    } else {
      // Single value - pass string directly
      this._internals.setFormValue(this._value);
    }
  }

  formResetCallback() {
    this._value = this.defaultValue ?? undefined;
    this._updateFormValue();
    this._dispatchValueChange();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formStateRestoreCallback(
    state: string | File | FormData | null,
    _mode: "restore" | "autocomplete"
  ) {
    if (state instanceof FormData) {
      const values = state.getAll(this.name!);
      this._value = values.map(String);
    } else if (typeof state === "string") {
      this._value = state;
    } else {
      this._value = undefined;
    }
    this._updateFormValue();
  }
}
```

### 8. Late Initialization Pattern (React Compatibility)

React may set properties after component initialization. Handle with late initialization:

```typescript
private _hasInitialized = false;

connectedCallback() {
  super.connectedCallback();

  // Initialize with default value if available
  if (this.defaultValue !== undefined) {
    this._value = this.defaultValue;
    this._hasInitialized = true;
  }
}

protected willUpdate(changed: Map<string, unknown>) {
  // Handle late initialization of defaultValue (React)
  if (
    changed.has("defaultValue") &&
    !this._hasInitialized &&
    this.defaultValue !== undefined &&
    this._value === undefined
  ) {
    this._value = this.defaultValue;
    this._hasInitialized = true;
  }

  // Handle controlled value (always takes precedence)
  if (changed.has("value") && this.value !== undefined) {
    this._value = this.value;
  }
}
```

### 9. Keyboard Navigation Pattern

Standard keyboard handling for list-based components:

```typescript
private _handleKeyDown = (e: KeyboardEvent) => {
  if (!this._context || !this._context.isOpen) return;

  const items = this._getEnabledItems();
  const currentIndex = this._getCurrentIndex(items);

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      this._highlightNext(items, currentIndex);
      break;

    case "ArrowUp":
      e.preventDefault();
      this._highlightPrevious(items, currentIndex);
      break;

    case "Home":
      e.preventDefault();
      if (items.length > 0) {
        this._highlightItem(items[0]);
      }
      break;

    case "End":
      e.preventDefault();
      if (items.length > 0) {
        this._highlightItem(items[items.length - 1]);
      }
      break;

    case "Enter":
    case " ":
      e.preventDefault();
      if (this._context.highlightedValue) {
        this._context.onSelect(this._context.highlightedValue);
      }
      break;

    case "Escape":
      e.preventDefault();
      this._context.onClose();
      break;

    case "Tab":
      e.preventDefault();
      this._context.onClose();
      break;
  }
};
```

### 10. Data Attributes for Styling

Consistent data attributes across all popover components:

- `data-state="open|closed"` - Current open state
- `data-side="top|right|bottom|left"` - Actual side after flip middleware
- `data-align="start|center|end"` - Actual alignment after positioning
- `data-disabled` - When element is disabled
- `data-placeholder` - When showing placeholder (select, combobox)
- `data-highlighted` - When item is highlighted (keyboard navigation)
- `data-selected` - When item is selected

These enable CSS selectors like:
```css
select-content[data-state="open"] {
  /* Styles for open state */
}

select-item[data-selected] {
  /* Styles for selected item */
}
```

## Testing Checklist

### Dropdown
- [x] Opens on trigger click
- [x] Closes on click outside (light dismiss)
- [x] Closes on Escape key
- [x] Keyboard navigation (Arrow keys, Home/End, Enter)
- [x] Positions correctly relative to trigger
- [x] Flips when near viewport edge
- [x] Works with as-child pattern
- [x] Disabled items cannot be selected
- [x] Data attributes update correctly

### Select
- [x] Opens on trigger click
- [x] Closes on click outside (light dismiss)
- [x] Closes on Escape key
- [x] Closes on selection (single mode)
- [x] Stays open on selection (multiple mode)
- [x] Keyboard navigation (Arrow keys, Home/End, Enter/Space)
- [x] Positions correctly relative to trigger
- [x] Flips when near viewport edge
- [x] Controlled and uncontrolled modes work
- [x] Form integration works (name, value submission)
- [x] Multiple selection with FormData
- [x] Focus returns to trigger on close
- [x] Disabled items cannot be selected
- [x] Data attributes update correctly

### Combobox
- [x] Opens on input click/focus (configurable)
- [x] Filters items based on search term
- [x] Manual filter mode works
- [x] Keyboard navigation through filtered results
- [x] Resets search term on blur (configurable)
- [x] Resets search term on select (configurable)
- [x] Focus returns to input on close
- [x] Form integration works
- [x] Multiple selection supported
- [x] Empty state shows when no results

### Tooltip
- [x] Opens on hover after delay
- [x] Opens instantly if recently viewed another tooltip
- [x] Closes on pointer leave
- [x] Stays open when hovering content
- [x] Opens on keyboard focus
- [x] Closes on Escape
- [x] Positions correctly with arrow

## Future Considerations
- Monitor CSS Anchor Positioning browser support for potential future migration
- Consider adding animation/transition support using popover pseudo-classes
- May need polyfill for broader browser support
