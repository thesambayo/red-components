# Tooltip

Accessible tooltip web components built with Lit and native Popover API.

## Installation

```bash
npm install @red-elements/tooltip
```

## Basic Usage

```html
<tooltip-root>
  <tooltip-trigger>
    <button>Hover me</button>
  </tooltip-trigger>
  <tooltip-content side="top" side-offset="8">
    <tooltip-arrow></tooltip-arrow>
    Helpful tooltip text
  </tooltip-content>
</tooltip-root>
```

## Configuration

### Global Configuration (Recommended)

Configure global defaults once at app startup using JavaScript:

```javascript
import { configureTooltips } from '@red-elements/tooltip';

// Set global defaults for all tooltips
configureTooltips({
  delayDuration: 700,        // Delay before showing tooltip (ms)
  skipDelayDuration: 300     // Grace period after closing (ms)
});
```

**Benefits:**
- No need to wrap your app in `<tooltip-provider>`
- Configure once, applies to all tooltips
- Can still override per-tooltip or per-group

### Provider-based Configuration (Optional)

For grouped overrides, use the provider component:

```html
<tooltip-provider delay-duration="1000" skip-delay-duration="500">
  <!-- All tooltips inside inherit these settings -->
  <tooltip-root>...</tooltip-root>
  <tooltip-root>...</tooltip-root>
</tooltip-provider>
```

### Per-Tooltip Configuration

Override for individual tooltips using `tooltip-root` attributes:

```html
<!-- Instant tooltip (no delay) -->
<tooltip-root delay-duration="0">
  <tooltip-trigger>
    <button>Instant tooltip</button>
  </tooltip-trigger>
  <tooltip-content>Shows immediately!</tooltip-content>
</tooltip-root>

<!-- Disable hoverable content -->
<tooltip-root disable-hoverable-content>
  <tooltip-trigger>
    <button>Simple tooltip</button>
  </tooltip-trigger>
  <tooltip-content>Closes immediately when leaving trigger</tooltip-content>
</tooltip-root>
```

## Configuration Priority

Settings are applied in this order (highest to lowest):

1. **tooltip-root attributes** (highest priority)
2. **tooltip-provider context** (middle priority)
3. **Global JavaScript config** (lowest priority)

## Features

### Hoverable Content

By default, tooltips stay open when you move your mouse to the content, allowing interactive elements like links or buttons:

```html
<tooltip-root>
  <tooltip-trigger>
    <button>Hover me</button>
  </tooltip-trigger>
  <tooltip-content>
    Interactive content with <a href="#">clickable link</a>
  </tooltip-content>
</tooltip-root>
```

Disable this behavior with `disable-hoverable-content`:

```html
<tooltip-root disable-hoverable-content>
  <tooltip-trigger>
    <button>Hover me</button>
  </tooltip-trigger>
  <tooltip-content>Closes immediately when leaving trigger</tooltip-content>
</tooltip-root>
```

### Positioning

Control tooltip placement with `side` and `align`:

```html
<tooltip-content side="top" align="center" side-offset="8" align-offset="0">
  Tooltip text
</tooltip-content>
```

**Properties:**
- `side`: `"top"` | `"right"` | `"bottom"` | `"left"` (default: `"top"`)
- `align`: `"start"` | `"center"` | `"end"` (default: `"center"`)
- `side-offset`: Distance from trigger in pixels (default: `8`)
- `align-offset`: Offset along alignment axis in pixels (default: `0`)

### Collision Detection

Tooltips automatically reposition to avoid viewport edges:

```html
<tooltip-content
  avoid-collisions
  collision-padding="8"
>
  Automatically repositions if too close to edge
</tooltip-content>
```

### Arrow

Add an arrow pointing to the trigger:

```html
<tooltip-content>
  <tooltip-arrow></tooltip-arrow>
  Tooltip with arrow
</tooltip-content>
```

Customize arrow size:

```html
<tooltip-arrow width="16" height="8"></tooltip-arrow>
```

### Accessibility

Tooltips are fully accessible:
- Uses native `role="tooltip"` with `aria-describedby`
- Keyboard accessible (Tab to focus, Escape to close)
- Screen reader friendly

## Styling

Style tooltip content with CSS:

```css
tooltip-content {
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

tooltip-arrow {
  --tooltip-arrow-fill: #1f2937;
}
```

### Available CSS Custom Properties

```css
tooltip-content {
  /* Trigger dimensions (read-only) */
  var(--tooltip-trigger-width);
  var(--tooltip-trigger-height);

  /* Available space before collision (read-only) */
  var(--tooltip-content-available-width);
  var(--tooltip-content-available-height);

  /* Transform origin for animations (read-only) */
  var(--tooltip-content-transform-origin);
}

tooltip-arrow {
  /* Arrow fill color */
  --tooltip-arrow-fill: #000;
}
```

## API Reference

### `configureTooltips(config)`

Configure global tooltip defaults.

**Parameters:**
- `config.delayDuration` (number): Delay before showing tooltip in milliseconds
- `config.skipDelayDuration` (number): Grace period after closing in milliseconds

**Example:**
```javascript
import { configureTooltips } from '@red-elements/tooltip';

configureTooltips({
  delayDuration: 500,
  skipDelayDuration: 300
});
```

### `getTooltipConfig()`

Get current global configuration.

**Returns:** `{ delayDuration: number, skipDelayDuration: number }`

**Example:**
```javascript
import { getTooltipConfig } from '@red-elements/tooltip';

const config = getTooltipConfig();
console.log(config.delayDuration); // 500
```

## Components

### `<tooltip-root>`

Root container that manages tooltip state.

**Properties:**
- `open` (boolean): Controlled open state
- `default-open` (boolean): Default open state for uncontrolled mode
- `delay-duration` (number): Override delay duration
- `disable-hoverable-content` (boolean): Disable interactive content

**Events:**
- `openChange`: Emitted when open state changes. `event.detail = { open: boolean }`

### `<tooltip-trigger>`

Wrapper for the trigger element.

### `<tooltip-content>`

The tooltip content popup.

**Properties:**
- `side`: `"top"` | `"right"` | `"bottom"` | `"left"`
- `align`: `"start"` | `"center"` | `"end"`
- `side-offset` (number): Distance from trigger
- `align-offset` (number): Offset along alignment axis
- `avoid-collisions` (boolean): Enable collision detection
- `collision-padding` (number): Padding from viewport edges
- `aria-label` (string): Custom aria-label

### `<tooltip-arrow>`

Arrow element pointing to the trigger.

**Properties:**
- `width` (number): Arrow width in pixels (default: 10)
- `height` (number): Arrow height in pixels (default: 5)

### `<tooltip-provider>`

Optional provider for grouped tooltip configuration.

**Properties:**
- `delay-duration` (number): Delay before showing tooltip
- `skip-delay-duration` (number): Grace period after closing

## License

MIT
