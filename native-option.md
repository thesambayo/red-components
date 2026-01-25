# Native HTML Dialog & Popover API

This document outlines the native HTML APIs that can be used as alternatives to custom portal-based implementations for dialogs, popovers, tooltips, and similar overlay components.

## Why Native APIs?

**Problems with DOM-moving portals:**
- Context loss (CSS custom properties, inherited styles)
- Event bubbling breaks (events go to body, not original parent)
- Framework context systems break (Lit context, React context)
- Animation/transition interruptions
- Cleanup complexity and potential memory leaks
- Z-index battles with other elements

**Benefits of native APIs:**
- Browser handles top-layer rendering automatically
- No z-index issues - top-layer is above everything
- Built-in accessibility (focus trapping, Escape key)
- Better performance (browser-optimized)
- Simpler implementation
- Works with any framework's context system

---

## Native `<dialog>` Element

### Basic Usage

```html
<dialog id="my-dialog">
  <h2>Dialog Title</h2>
  <p>Dialog content here.</p>
  <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<button onclick="document.getElementById('my-dialog').showModal()">
  Open Dialog
</button>
```

### Methods

| Method | Description |
|--------|-------------|
| `showModal()` | Opens as modal - top-layer, focus trap, backdrop, Escape closes |
| `show()` | Opens as non-modal - no backdrop, no focus trap |
| `close(returnValue?)` | Closes the dialog, optionally sets `returnValue` |

### Properties

| Property | Description |
|----------|-------------|
| `open` | Boolean attribute reflecting open state |
| `returnValue` | String value passed to `close()` or from form submission |

### Events

| Event | Description |
|-------|-------------|
| `close` | Fires when dialog is closed (by any method) |
| `cancel` | Fires when Escape is pressed (modal only). Can `preventDefault()` to block |

### Pseudo-elements

```css
/* Style the backdrop overlay */
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
```

### Form Integration

Forms with `method="dialog"` auto-close the dialog on submit:

```html
<dialog id="confirm-dialog">
  <form method="dialog">
    <p>Are you sure?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm">Confirm</button>
  </form>
</dialog>

<script>
  dialog.addEventListener('close', () => {
    console.log(dialog.returnValue); // "cancel" or "confirm"
  });
</script>
```

### Modal vs Non-Modal

| Feature | `showModal()` | `show()` |
|---------|---------------|----------|
| Top-layer | Yes | No |
| Backdrop | Yes (`::backdrop`) | No |
| Focus trap | Yes | No |
| Escape closes | Yes | No |
| Blocks interaction outside | Yes | No |

### Accessibility (Built-in)

- Focus is trapped within modal dialog
- Focus moves to first focusable element (or dialog itself)
- Focus returns to trigger element on close
- Escape key closes modal
- `aria-modal="true"` automatically applied for modal
- Screen readers announce dialog

---

## Popover API

### Basic Usage

```html
<!-- Declarative (no JavaScript needed) -->
<button popovertarget="my-popover">Toggle Popover</button>
<div id="my-popover" popover>
  Popover content here.
</div>
```

### Popover Attribute Values

| Value | Behavior |
|-------|----------|
| `popover` or `popover="auto"` | Light dismiss - closes on outside click or Escape |
| `popover="manual"` | Must be explicitly closed via JavaScript or button |

### Trigger Attributes

| Attribute | Description |
|-----------|-------------|
| `popovertarget="id"` | Links trigger to popover element |
| `popovertargetaction="toggle"` | Toggle popover (default) |
| `popovertargetaction="show"` | Only show popover |
| `popovertargetaction="hide"` | Only hide popover |

### JavaScript Methods

```javascript
const popover = document.getElementById('my-popover');

popover.showPopover();    // Open
popover.hidePopover();    // Close
popover.togglePopover();  // Toggle
```

### Events

| Event | Description |
|-------|-------------|
| `beforetoggle` | Fires before state changes. Has `oldState` and `newState` |
| `toggle` | Fires after state changes. Has `oldState` and `newState` |

```javascript
popover.addEventListener('toggle', (e) => {
  console.log(`Changed from ${e.oldState} to ${e.newState}`);
  // oldState/newState are "open" or "closed"
});
```

### Styling

```css
/* Style when open */
[popover]:popover-open {
  opacity: 1;
  transform: scale(1);
}

/* Style the backdrop (usually transparent for popovers) */
[popover]::backdrop {
  background: transparent;
}

/* Starting state for animations */
[popover] {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s, transform 0.2s;
}
```

### Auto vs Manual

| Feature | `popover="auto"` | `popover="manual"` |
|---------|------------------|-------------------|
| Light dismiss (outside click) | Yes | No |
| Escape closes | Yes | No |
| Only one open at a time | Yes (auto-closes others) | No |
| Use case | Dropdowns, tooltips | Toasts, persistent UI |

---

## Component Mapping

| Component | Recommended Native API |
|-----------|----------------------|
| Dialog (modal) | `<dialog>` with `showModal()` |
| Dialog (non-modal) | `<dialog>` with `show()` |
| AlertDialog | `<dialog>` with `showModal()` + `preventDefault()` on `cancel` event |
| Tooltip | `popover="auto"` + positioning library |
| Dropdown Menu | `popover="auto"` + positioning library |
| Toast/Notification | `popover="manual"` |
| Popover | `popover="auto"` |

---

## Implementation Notes

### Dialog Component Strategy

```typescript
// Wrap native <dialog> in custom element
@customElement("dialog-content")
class DialogContent extends LitElement {
  private _dialog: HTMLDialogElement;

  render() {
    return html`
      <dialog>
        <slot></slot>
      </dialog>
    `;
  }

  open(modal = true) {
    modal ? this._dialog.showModal() : this._dialog.show();
  }

  close() {
    this._dialog.close();
  }
}
```

### AlertDialog Strategy

```typescript
// Prevent Escape from closing
dialog.addEventListener('cancel', (e) => {
  e.preventDefault(); // Block Escape key
});
```

### Positioning Popovers

Native popover doesn't handle positioning relative to trigger. Use with:
- CSS Anchor Positioning (emerging standard)
- Floating UI library
- Manual positioning with JavaScript

```javascript
// With Floating UI
import { computePosition } from '@floating-ui/dom';

popover.addEventListener('beforetoggle', async (e) => {
  if (e.newState === 'open') {
    const { x, y } = await computePosition(trigger, popover);
    popover.style.left = `${x}px`;
    popover.style.top = `${y}px`;
  }
});
```

---

## CSS Anchor Positioning

CSS Anchor Positioning allows elements to be positioned relative to other elements (anchors) purely in CSS - no JavaScript required. This is the missing piece for fully native tooltips, dropdowns, and popovers.

### The Problem It Solves

Native `popover` renders in the top-layer but has no built-in positioning relative to its trigger. Currently you need JavaScript (Floating UI, etc.) to position floating elements. CSS Anchor Positioning makes this declarative.

### Basic Usage

```css
/* 1. Define an anchor */
.trigger {
  anchor-name: --tooltip-anchor;
}

/* 2. Position element relative to anchor */
.tooltip {
  position: fixed;
  position-anchor: --tooltip-anchor;

  /* Position below the anchor, aligned to start */
  top: anchor(bottom);
  left: anchor(left);

  /* Add gap */
  margin-top: 8px;
}
```

### The `anchor()` Function

Reference specific edges of the anchor:

```css
.floating {
  /* Vertical positioning */
  top: anchor(bottom);     /* Below anchor */
  top: anchor(top);        /* Above anchor (align tops) */
  bottom: anchor(top);     /* Above anchor */
  top: anchor(center);     /* Vertically centered */

  /* Horizontal positioning */
  left: anchor(right);     /* To the right of anchor */
  left: anchor(left);      /* Aligned to anchor's left */
  left: anchor(center);    /* Horizontally centered */
}
```

### Inset Area (Simplified Positioning)

Instead of setting individual properties, use `inset-area` for grid-based positioning:

```css
.tooltip {
  position: fixed;
  position-anchor: --my-anchor;

  /* Position in specific area relative to anchor */
  inset-area: top;           /* Centered above */
  inset-area: bottom;        /* Centered below */
  inset-area: left;          /* Centered to left */
  inset-area: right;         /* Centered to right */

  inset-area: top left;      /* Above, aligned left */
  inset-area: bottom right;  /* Below, aligned right */

  inset-area: top span-all;  /* Above, full width of anchor */
}
```

### Fallback Positions (Like Floating UI's Flip)

Handle cases where the preferred position doesn't fit:

```css
.tooltip {
  position: fixed;
  position-anchor: --my-anchor;

  /* Preferred position */
  inset-area: top;

  /* Auto-flip if no space */
  position-try-fallbacks: flip-block;
}
```

**Built-in fallback keywords:**
| Keyword | Behavior |
|---------|----------|
| `flip-block` | Flip vertically (top ↔ bottom) |
| `flip-inline` | Flip horizontally (left ↔ right) |
| `flip-block flip-inline` | Try both flips |

### Custom Fallback Positions

Define specific fallback positions with `@position-try`:

```css
.dropdown {
  position: fixed;
  position-anchor: --menu-anchor;

  /* Preferred: below, aligned left */
  top: anchor(bottom);
  left: anchor(left);

  /* Fallbacks in order of preference */
  position-try-fallbacks: --above, --right;
}

@position-try --above {
  bottom: anchor(top);
  top: auto;
  left: anchor(left);
}

@position-try --right {
  left: anchor(right);
  top: anchor(top);
}
```

### Sizing Relative to Anchor

```css
.dropdown-menu {
  /* Match anchor width */
  width: anchor-size(width);

  /* Or set min/max */
  min-width: anchor-size(width);
  max-height: anchor-size(height);
}
```

### Complete Example: Tooltip

```html
<button class="trigger" popovertarget="tooltip">Hover me</button>
<div id="tooltip" popover>Tooltip content</div>
```

```css
.trigger {
  anchor-name: --tooltip-anchor;
}

#tooltip {
  position: fixed;
  position-anchor: --tooltip-anchor;

  /* Position above, centered */
  inset-area: top;
  margin-bottom: 8px;

  /* Flip below if no space above */
  position-try-fallbacks: flip-block;

  /* Styling */
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
}
```

### Complete Example: Dropdown Menu

```html
<button class="menu-trigger" popovertarget="menu">Options</button>
<div id="menu" popover>
  <button>Edit</button>
  <button>Delete</button>
</div>
```

```css
.menu-trigger {
  anchor-name: --menu-anchor;
}

#menu {
  position: fixed;
  position-anchor: --menu-anchor;

  /* Below trigger, match width */
  inset-area: bottom span-left;
  min-width: anchor-size(width);

  /* Flip above if no space */
  position-try-fallbacks: flip-block;
}
```

### The Full Native Stack

With CSS Anchor Positioning, you can build tooltips, dropdowns, and popovers with zero JavaScript for positioning:

| Concern | Native Solution |
|---------|-----------------|
| Rendering in top-layer | `popover` attribute |
| Light dismiss | `popover="auto"` |
| Positioning | CSS Anchor Positioning |
| Flip/shift on overflow | `position-try-fallbacks` |
| Accessibility | Built into popover |

### Current Limitations

1. **Browser support** - Chrome/Edge 125+ only (as of 2024)
2. **No "shift" behavior** - Can flip but can't slide along edge like Floating UI
3. **No arrow positioning** - Must handle tooltip arrows manually
4. **Anchor must be in DOM** - Can't anchor to virtual elements

### Progressive Enhancement Strategy

Use CSS Anchor Positioning with Floating UI fallback:

```javascript
// Check for support
const supportsAnchor = CSS.supports('anchor-name', '--test');

if (!supportsAnchor) {
  // Fall back to Floating UI
  import('@floating-ui/dom').then(({ computePosition }) => {
    // Position with JavaScript
  });
}
```

```css
/* CSS that only applies if anchor positioning is supported */
@supports (anchor-name: --test) {
  .tooltip {
    position-anchor: --tooltip-anchor;
    inset-area: top;
  }
}
```

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `<dialog>` | 37+ | 98+ | 15.4+ | 79+ |
| `showModal()` | 37+ | 98+ | 15.4+ | 79+ |
| Popover API | 114+ | 125+ | 17+ | 114+ |
| CSS Anchor Positioning | 125+ | No | No | 125+ |

**Status notes:**
- `<dialog>` and Popover API have excellent support - ready for production
- CSS Anchor Positioning is Chrome/Edge only - use with progressive enhancement or wait for broader support

**Polyfills:**
- Dialog: [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill)
- Popover: [@oddbird/popover-polyfill](https://github.com/oddbird/popover-polyfill)
- CSS Anchor: [CSS Anchor Positioning Polyfill](https://github.com/oddbird/css-anchor-positioning)

---

## References

- [MDN: `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [MDN: CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
- [web.dev: Building a dialog component](https://web.dev/building-a-dialog-component/)
- [web.dev: Popover API](https://web.dev/blog/popover-api)
- [web.dev: CSS Anchor Positioning](https://developer.chrome.com/blog/anchor-positioning-api)
