# @red-elements/select

A native web component select/dropdown with form integration, keyboard navigation, and accessibility support.

## Installation

```bash
npm install @red-elements/select
```

## Features

- ✅ Single and multiple selection modes
- ✅ Form integration using ElementInternals API
- ✅ Full keyboard navigation (Arrow keys, Home, End, Enter, Space, Escape)
- ✅ Comprehensive ARIA attributes for accessibility
- ✅ Support for grouped options
- ✅ Disabled state for select and individual items
- ✅ Default values for uncontrolled mode
- ✅ Controlled mode with value/open props
- ✅ Native Popover API for dropdown positioning
- ✅ Custom styling via CSS and data attributes

## Usage

### Basic Example

```html
<select-root name="country" default-value="us">
  <select-trigger>
    <select-value placeholder="Select country..."></select-value>
    <span>▼</span>
  </select-trigger>
  <select-content>
    <select-item value="us">
      <select-item-indicator>✓</select-item-indicator>
      <select-item-text>United States</select-item-text>
    </select-item>
    <select-item value="uk">
      <select-item-indicator>✓</select-item-indicator>
      <select-item-text>United Kingdom</select-item-text>
    </select-item>
    <select-item value="ca">
      <select-item-indicator>✓</select-item-indicator>
      <select-item-text>Canada</select-item-text>
    </select-item>
  </select-content>
</select-root>
```

### Multiple Selection

```html
<select-root name="fruits" multiple default-value='["apple", "banana"]'>
  <select-trigger>
    <select-value placeholder="Select fruits..."></select-value>
  </select-trigger>
  <select-content>
    <select-item value="apple">
      <select-item-indicator>✓</select-item-indicator>
      <select-item-text>Apple</select-item-text>
    </select-item>
    <select-item value="banana">
      <select-item-indicator>✓</select-item-indicator>
      <select-item-text>Banana</select-item-text>
    </select-item>
  </select-content>
</select-root>
```

### With Groups

```html
<select-root>
  <select-trigger>
    <select-value placeholder="Select fruit..."></select-value>
  </select-trigger>
  <select-content>
    <select-group>
      <select-label>Citrus</select-label>
      <select-item value="orange">
        <select-item-text>Orange</select-item-text>
      </select-item>
      <select-item value="lemon">
        <select-item-text>Lemon</select-item-text>
      </select-item>
    </select-group>
    <select-separator></select-separator>
    <select-group>
      <select-label>Berries</select-label>
      <select-item value="strawberry">
        <select-item-text>Strawberry</select-item-text>
      </select-item>
    </select-group>
  </select-content>
</select-root>
```

### Form Integration

```html
<form>
  <select-root name="country" default-value="us" required>
    <select-trigger>
      <select-value placeholder="Select country..."></select-value>
    </select-trigger>
    <select-content>
      <!-- items -->
    </select-content>
  </select-root>

  <button type="submit">Submit</button>
</form>
```

The select will participate in form submission just like native form controls:
- Single values submit as: `country=us`
- Multiple values submit as: `fruits=apple&fruits=banana` (like `<select multiple>`)

## Components

### select-root

Main container that manages state and provides context.

**Attributes:**
- `name` - Form field name
- `value` - Controlled value (use with JavaScript)
- `default-value` - Initial value for uncontrolled mode
- `open` - Controlled open state (use with JavaScript)
- `default-open` - Initial open state
- `multiple` - Enable multiple selection
- `disabled` - Disable the select
- `required` - Mark as required for forms

**Events:**
- `select:value-change` - Fires when value changes
- `select:open-change` - Fires when open state changes
- `select:open` - Fires when select opens
- `select:close` - Fires when select closes

### select-trigger

Button that opens/closes the dropdown.

**Attributes:**
- Automatically receives ARIA attributes and data-states

**Data Attributes:**
- `data-state="open|closed"` - Current open state
- `data-disabled` - Present when disabled
- `data-placeholder` - Present when no value selected

### select-value

Displays the currently selected value(s).

**Attributes:**
- `placeholder` - Text shown when no value is selected

### select-content

Container for dropdown items.

**Attributes:**
- None (automatically positioned with Popover API)

### select-item

Individual selectable option.

**Attributes:**
- `value` - Required unique identifier
- `disabled` - Disable this option

**Data Attributes:**
- `data-selected` - Present when selected
- `data-highlighted` - Present when keyboard-highlighted
- `data-disabled` - Present when disabled
- `data-state="checked|unchecked"` - Selection state

### select-item-text

Text content of the item (used for display and typeahead).

### select-item-indicator

Visual indicator shown when item is selected (e.g., checkmark).

### select-group

Groups related items together.

### select-label

Label for a group of items.

### select-separator

Visual divider between groups.

## Styling

All components can be styled with CSS. Use data attributes for state-based styling:

```css
select-trigger {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

select-trigger[data-state="open"] {
  border-color: blue;
}

select-trigger[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

select-item[data-highlighted] {
  background: #f0f0f0;
}

select-item[data-selected] {
  background: #e0e7ff;
  color: #4338ca;
}
```

## Keyboard Navigation

- `Space`, `Enter`, `ArrowDown`, `ArrowUp` - Open select (when closed)
- `ArrowDown` - Navigate to next item
- `ArrowUp` - Navigate to previous item
- `Home` - Jump to first item
- `End` - Jump to last item
- `Enter`, `Space` - Select highlighted item
- `Escape` - Close select
- `Tab` - Close select and move focus

## Accessibility

The select component implements full ARIA support:

- `role="combobox"` on trigger
- `role="listbox"` on content
- `role="option"` on items
- `aria-expanded`, `aria-controls`, `aria-selected` attributes
- Keyboard navigation support
- Screen reader announcements

## Browser Support

Works in all modern browsers that support:
- Web Components (Custom Elements, Shadow DOM)
- Popover API (polyfill available if needed)
- ElementInternals API for form integration

## License

MIT
