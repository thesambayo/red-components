# @red-elements/combobox

A fully-featured combobox component combining text input with a filterable dropdown list. Supports both single and multiple selection modes with client-side or manual filtering.

## Features

- ✨ Single and multiple selection modes
- 🔍 Client-side filtering with locale-aware search
- ⌨️ Full keyboard navigation
- ♿ ARIA compliant
- 🎨 Customizable with CSS
- ⚡ Built with Lit Web Components
- ⚛️ React wrappers included

## Installation

```bash
npm install @red-elements/combobox
```

## Usage

### Basic Single Select

```html
<combobox-root>
  <combobox-input placeholder="Search..."></combobox-input>
  <combobox-content>
    <combobox-item value="apple">Apple</combobox-item>
    <combobox-item value="banana">Banana</combobox-item>
    <combobox-item value="orange">Orange</combobox-item>
    <combobox-empty>No results found</combobox-empty>
  </combobox-content>
</combobox-root>
```

### Multiple Select

```html
<combobox-root multiple default-value='["apple", "banana"]'>
  <combobox-input placeholder="Search fruits..."></combobox-input>
  <combobox-content>
    <combobox-item value="apple">Apple</combobox-item>
    <combobox-item value="banana">Banana</combobox-item>
    <combobox-item value="orange">Orange</combobox-item>
  </combobox-content>
</combobox-root>
```

### Select Style (Trigger + Input Inside Content)

For a select-like experience where the trigger shows the selected value and the input is inside the dropdown:

```html
<combobox-root default-value="apple">
  <combobox-anchor>
    <combobox-trigger>
      Select fruit...
      <svg><!-- chevron icon --></svg>
    </combobox-trigger>
  </combobox-anchor>
  <combobox-content>
    <combobox-input placeholder="Search..."></combobox-input>
    <combobox-item value="apple">Apple</combobox-item>
    <combobox-item value="banana">Banana</combobox-item>
    <combobox-empty>No results found</combobox-empty>
  </combobox-content>
</combobox-root>
```

Wrap the trigger with `combobox-anchor` to position content relative to it. The input inside the content receives focus when opened.

### Inline Input and Trigger

Put both input and trigger inside the anchor for a compact inline layout:

```html
<combobox-root>
  <combobox-anchor style="display: flex; gap: 8px;">
    <combobox-input placeholder="Search..."></combobox-input>
    <combobox-trigger>
      <svg><!-- icon --></svg>
    </combobox-trigger>
  </combobox-anchor>
  <combobox-content>
    <combobox-item value="apple">Apple</combobox-item>
    <combobox-item value="banana">Banana</combobox-item>
  </combobox-content>
</combobox-root>
```

### Custom Anchor Element

Use `combobox-anchor` with `as-child` to delegate to a custom element:

```html
<combobox-root>
  <combobox-anchor as-child>
    <div class="custom-wrapper">
      <combobox-input placeholder="Search..."></combobox-input>
    </div>
  </combobox-anchor>
  <combobox-content>
    <combobox-item value="apple">Apple</combobox-item>
    <combobox-item value="banana">Banana</combobox-item>
  </combobox-content>
</combobox-root>
```

The anchor element is the key to positioning - content always positions relative to the anchor (or the input if no anchor is specified).

## API

See [Storybook documentation](https://red-elements.dev) for full API details.

## License

MIT
