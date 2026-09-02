# Components Reference

## 1. Accordion

**Package:** `@red-elements/accordion`

**Elements:** `<accordion-root>`, `<accordion-item>`, `<accordion-header>`, `<accordion-trigger>`, `<accordion-content>`

**Features:**
- Single or multiple expanded items (`type="single"` / `type="multiple"`)
- Collapsible toggle
- Keyboard navigation (Arrow Up/Down, Home, End)
- Animated expand/collapse via data attributes

**Key Props (root):**
- `type` - `"single"` | `"multiple"`
- `collapsible` - boolean
- `default-value` - initially expanded item(s)
- _(no controlled `value` property yet - uncontrolled via `default-value` only)_
- `disabled` - disable all items

**Events:** `accordion:value-change` (detail: `string[]`)

---

## 2. Alert Dialog

**Package:** `@red-elements/alert-dialog`

**Elements:** `<alert-dialog-root>`, `<alert-dialog-trigger>`, `<alert-dialog-cancel>`, `<alert-dialog-action>`

**Features:**
- Always modal (uses native `<dialog>` with `showModal()`)
- Cannot be dismissed with Escape key (unlike Dialog)
- Requires explicit action (cancel or confirm)

**Key Props (root):**
- `open` / `default-open` - controlled/uncontrolled open state

**Events:** `alert-dialog:open-change` (detail: `{ open: boolean }`)

---

## 3. Avatar

**Package:** `@red-elements/avatar`

**Elements:** `<avatar-root>`, `<avatar-image>`, `<avatar-fallback>`

**Features:**
- Image with fallback support
- Shows fallback when image fails to load or while loading
- Simple composition pattern

**Key Props:**
- `avatar-image`: `src`, `alt`
- `avatar-fallback`: `delay-ms` (delay before showing fallback)

---

## 4. Combobox

**Package:** `@red-elements/combobox`

**Elements:** `<combobox-root>`, `<combobox-trigger>`, `<combobox-input>`, `<combobox-content>`, `<combobox-item>`, `<combobox-empty>`, `<combobox-group>`, `<combobox-label>`

**Features:**
- Searchable select-like component
- Keyboard navigation
- Filtering items based on input
- Grouped items support

**Key Props (root):**
- `open` / `default-open`
- `value` / `default-value`

**Events:** `combobox:value-change`, `combobox:search-change`, `combobox:open`, `combobox:close`

---

## 5. Dialog

**Package:** `@red-elements/dialog`

**Elements:** `<dialog-root>`, `<dialog-trigger>`, `<dialog-close>`

**Features:**
- Uses native `<dialog>` element
- Modal (default) and modeless modes
- Backdrop styling via `::backdrop`
- Focus trapping in modal mode
- Escape key closes

**Key Props (root):**
- `open` / `default-open`
- `modal` - boolean (default: true)

**Events:** `dialog:open-change` (detail: `{ open: boolean }`)

---

## 6. Dropdown

**Package:** `@red-elements/dropdown`

**Elements:** `<dropdown-root>`, `<dropdown-trigger>`, `<dropdown-content>`, `<dropdown-item>`, `<dropdown-separator>`, `<dropdown-label>`, `<dropdown-group>`, `<dropdown-sub>`, `<dropdown-sub-trigger>`, `<dropdown-sub-content>`

**Features:**
- Uses native Popover API
- Positioning via @floating-ui/dom
- Sub-menu support
- Keyboard navigation
- CSS custom properties for trigger dimensions

**Key Props (root):**
- `open` / `default-open`

**CSS Custom Properties:**
- `--dropdown-trigger-width`
- `--dropdown-trigger-height`

**Events:** `dropdown:open`, `dropdown:close`, `dropdown:item-select` (detail: `{ dropdownId: string }`; item-select adds `value`)

---

## 7. Select

**Package:** `@red-elements/select`

**Elements:** `<select-root>`, `<select-trigger>`, `<select-value>`, `<select-content>`, `<select-item>`, `<select-item-text>`, `<select-item-indicator>`, `<select-group>`, `<select-label>`, `<select-separator>`

**Features:**
- Single and multiple selection
- Form integration via ElementInternals
- Keyboard navigation
- Grouped items
- Placeholder support
- Typeahead search

**Key Props (root):**
- `value` / `default-value`
- `name` - form field name
- `required` - form validation
- `disabled`
- `multiple` - allow multiple selections

**Events:** `select:value-change`, `select:open-change`, `select:open`, `select:close`

---

## 8. Tabs

**Package:** `@red-elements/tabs`

**Elements:** `<tabs-root>`, `<tabs-list>`, `<tabs-trigger>`, `<tabs-content>`

**Features:**
- Horizontal/vertical orientation
- Keyboard navigation
- Automatic/manual activation modes

**Key Props (root):**
- `value` / `default-value` - active tab
- `orientation` - `"horizontal"` | `"vertical"`
- `activation-mode` - `"automatic"` | `"manual"`

**Events:** `tabs:value-change`

---

## 9. Toast

**Package:** `@red-elements/toast`

**Elements:** `<toast-provider>`, `<toast-viewport>`, `<toast-root>`, `<toast-title>`, `<toast-description>`, `<toast-action>`, `<toast-close>`

**Features:**
- Provider pattern for managing multiple toasts
- Auto-dismiss with configurable duration
- Pause on hover
- Multiple viewport positions
- Swipe to dismiss

**Key Props (provider):**
- `duration` - default auto-dismiss duration (ms)
- `swipe-direction` - `"right"` | `"left"` | `"up"` | `"down"`

---

## 10. Tooltip

**Package:** `@red-elements/tooltip`

**Elements:** `<tooltip-provider>`, `<tooltip-root>`, `<tooltip-trigger>`, `<tooltip-content>`, `<tooltip-arrow>`

**Features:**
- Two-level context: Provider + Root
- Provider manages delay coordination across multiple tooltips
- Positioning via @floating-ui/dom
- Hoverable content support
- Arrow element

**Key Props:**
- Provider: `delay-duration`, `skip-delay-duration`
- Root: `open` / `default-open`
- Content: `side`, `align`, `side-offset`, `align-offset`

**Events:** `tooltip:open-change` (detail: `{ open: boolean }`)

---

## 11. Switch

**Package:** `@red-elements/switch`

**Elements:** `<switch-root>`, `<switch-thumb>`

**Features:**
- On/off toggle control with `role="switch"`
- Form-associated via ElementInternals (participates in `<form>` like native inputs)
- Controlled (`checked`) and uncontrolled (`default-checked`) modes
- Keyboard support: Space and Enter to toggle
- Works with wrapping `<label>` elements

**Key Props (root):**
- `name` - form field name
- `value` - form value when checked (default: `"on"`)
- `default-checked` - initial checked state (uncontrolled)
- `checked` - controlled checked state (set via JS property)
- `disabled` - disables interaction
- `readonly` - prevents toggling but keeps focus
- `required` - marks as required for form validation

**Data Attributes (root + thumb):**
- `data-checked` / `data-unchecked`
- `data-disabled`
- `data-readonly`
- `data-required`

**Events:** `switch:checked-change` (detail: `{ checked: boolean }`)

**Form Integration:**
- Submits `value` when checked, nothing when unchecked
- Supports form reset (reverts to `default-checked`)
- Supports `formDisabledCallback` and `formStateRestoreCallback`

---

## Trigger composition

`as-child` was removed. Every component supports two explicit forms:

**1. The component is the control** (default)

```html
<dialog-trigger>Open dialog</dialog-trigger>
```

Style the element directly. Put text and icons inside it - **not another
`<button>`**, which would nest interactive roles.

**2. Escape hatch - bring your own element**

```html
<button class="my-button" data-dialog-trigger>Open dialog</button>
```

Use this when you need your own tag (`<a>`, a framework `<Link>`) or native
button semantics. Available on every trigger-bearing component:

| Component | Attribute(s) |
| --- | --- |
| Dialog | `data-dialog-trigger`, `data-dialog-close` |
| Alert Dialog | `data-alert-dialog-trigger`, `data-alert-dialog-cancel`, `data-alert-dialog-action` |
| Tooltip | `data-tooltip-trigger` |
| Select | `data-select-trigger` |
| Combobox | `data-combobox-trigger` |
| Dropdown | `data-dropdown-trigger` |
| Tabs | `data-tab-trigger="<value>"` |
| Accordion | `data-accordion-trigger="<item value>"` |

## Event naming

All events are namespaced `{component}:{kebab-event}` and are `bubbles` +
`composed`. React wrappers keep camelCase props (`onOpenChange`), so only the
wire name is namespaced.

## Controlled mode is JS-only for some properties

`switch.checked`, `select.open`, `select.value` and `combobox.value` have no HTML
attribute: an absent attribute cannot be distinguished from one set to a falsy
value, so there is no way to express "uncontrolled". Set the property from JS, or
use the `default-*` attribute and listen for the change event.
