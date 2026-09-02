# Component fixes, and the ideas behind them

A walkthrough of the bugs found while hardening `dropdown`, `select`, `combobox`,
`switch` and `dialog`, written to be *learned from* rather than skimmed. Each
section is: the symptom you'd see, the mechanism that caused it, the fix, and how
to recognise the same shape of problem next time.

The through-line: almost none of these were logic errors. They were mismatches
between what the platform actually does and what the code assumed it did.

---

## 1. The Popover API light-dismiss race

**Symptom.** Clicking a dropdown's trigger while the menu was open made the menu
blink and stay open. It could never be closed from its own trigger. In the
combobox, every click into the text input closed and reopened the list, so the
caret never landed where you aimed.

### Mechanism

A `popover="auto"` element gets *light dismiss* for free: the browser closes it
when a pointer gesture lands outside it. The important word is "outside". The
browser's definition of "inside" is the popover **plus its registered invoker** —
and an invoker is only a thing if the browser knows about it, via the
`popoverTarget` attribute or the `popoverTargetElement` property.

Here is the constraint that made this unavoidable:

> `popoverTargetElement` is defined on `HTMLButtonElement` and `HTMLInputElement`.
> Only those two.

`<dropdown-trigger>` is a custom element. It **cannot** be registered as an
invoker, at any price. So the browser considered every trigger click to be an
outside click, and this happened on every click while open:

```
pointerdown  ──▶ (nothing yet)
pointerup    ──▶ browser light-dismisses the popover        → now CLOSED
click        ──▶ our handler reads state: "closed"          → opens it again
```

The handler was correct. Its *input* was stale — by the time `click` fired, the
browser had already changed the state out from under it.

### Fix A — decide from the state at `pointerdown`

For dropdown and select, where clicking the trigger while open *should* close,
the fix is to read the state before light dismiss has had a chance to run:

```ts
// packages/core/src/popover-toggle.ts
let openAtPointerDown: boolean | null = null;

element.addEventListener("pointerdown", () => {
  openAtPointerDown = options.isOpen();   // captured BEFORE light dismiss
});

element.addEventListener("click", () => {
  const wasOpen = openAtPointerDown ?? options.isOpen();
  openAtPointerDown = null;
  if (wasOpen) options.close();   // no-op: the browser already closed it
  else options.open();
});
```

A click that *began* while the menu was open now closes it. Since the browser
already did the closing, `close()` is a harmless no-op — and crucially, we no
longer reopen.

Keyboard activation produces a `click` with no preceding `pointerdown`, so the
recorded value is cleared on `keydown` and the handler falls back to live state.
That `null` check does double duty: it also tells us *how* the element was
activated, which section 5 relies on.

### Fix B — when "outside" is the wrong boundary entirely

The combobox is different. Clicking into its input while the list is open should
**keep the list open** — you're editing the search. No amount of toggle-guarding
achieves that, because `auto` will always dismiss on a gesture the browser
considers outside, and the input *is* outside the listbox.

So the combobox drops `auto` and declares its own boundary:

```ts
this.setAttribute("popover", "manual");   // no built-in light dismiss

attachDismiss(this, {
  boundary: () => [anchorElement, inputElement, triggerElement],
  onDismiss: () => onClose(),
});
```

Two details in `attachDismiss` worth stealing:

- It uses `event.composedPath()`, not `contains()`. A gesture originating inside
  a shadow root has its `target` retargeted to the host, so `contains()` would
  answer a question about the wrong element.
- It handles `Escape` itself and calls `stopPropagation()`. A native `auto`
  popover consumes the Escape key so only the innermost layer closes; going
  `manual` means reproducing that, or a combobox inside a dialog closes both.

### How to spot it again

Any time you call `showPopover()`/`togglePopover()` from your own `click`
handler on something that isn't a `<button>` or `<input>`, you have this bug.
The tell is "clicking the trigger won't close it."

---

## 2. Async positioning and the paint gate

**Symptom.** Menus flickered on open — a visible jump from a wrong position to
the right one. Worse on a second open after the page had scrolled.

### Mechanism

Three things compound:

1. **`showPopover()` is synchronous; `computePosition()` is not.** The element
   becomes visible immediately, and the coordinates arrive later.

2. **`size()` invalidates `flip()`.** The `size` middleware's `apply` callback
   writes CSS custom properties that change the floating element's own box. But
   `flip()` and `shift()` already made their decisions against the *pre-resize*
   box. The first result can be genuinely wrong, not just late.

3. **`autoUpdate` watches the floating element with a `ResizeObserver`.** So the
   resize from step 2 triggers *another* reposition a frame later. That second,
   different position is the jump you see.

On top of that, `left`/`top` were never cleared on close, so the next open
painted one frame at the *previous* open's coordinates before correcting.

### Fix

Hide the element until the position has settled, and settle it twice:

```ts
// packages/core/src/floating-controller.ts
private async _settle() {
  await this.update();
  if (this._positioned || !this._anchor) return;

  // Second pass: the first may have resized the host via size(), making its
  // flip/shift decisions stale. computePosition resolves in microtasks, so
  // both passes land in the same frame — no perceptible latency.
  await this.update();

  this._positioned = true;
  this._host.removeAttribute("data-floating-hidden");
}
```

And `stop()` clears `left`/`top` so stale coordinates can't be painted next time.

### The subtlety that made the first attempt wrong

The gate was originally applied in `start()`, which is called from the popover's
`toggle` event. That still flickered, because:

> `showPopover()` reveals the element synchronously, but its `toggle` event is
> **queued as a task**. `beforetoggle` fires synchronously.

By the time `toggle` ran, a frame could already have painted. The gate has to be
set from `beforetoggle`:

```ts
this.addEventListener("beforetoggle", (event) => {
  if (event.newState === "open") this._floating.gate();  // synchronous
});
this.addEventListener("toggle", (event) => {
  if (event.newState === "open") this._floating.start(anchor);
});
```

### Why an attribute and not an inline style

The gate is `data-floating-hidden` + a `:host([data-floating-hidden])` rule,
rather than `element.style.visibility = "hidden"`. Two reasons: it must be
settable from `beforetoggle` before `start()` runs, and `tooltip-content` drives
inline `visibility` itself for `hide({ strategy: "referenceHidden" })` — a
blanket inline reset would stomp it.

**Failure mode to design against:** a gate that never lifts is worse than no gate,
because the element is open, in the top layer, and invisible. So every path that
skips positioning (no anchor found) explicitly lifts the gate, and `_settle`
lifts it in a `catch` before rethrowing.

---

## 3. The O(N²) problem

You asked specifically about this one, so here it is in full.

**Symptom.** A combobox with a long option list hitched on first open, and arrow
key navigation felt heavy.

### Setup: how the pieces connect

```
combobox-root                 owns @state _items (a Map) and builds a context object
  └─ combobox-content
       ├─ combobox-item  ──┐
       ├─ combobox-item  ──┼── each @consume's the context with subscribe: true
       └─ combobox-item  ──┘
```

Two facts do the damage together:

1. Each item registers itself from its **own** `firstUpdated` — one at a time.
2. The root rebuilds a **brand-new context object** whenever its state changes,
   and every item subscribes to it.

### The mount cost

The old registration:

```ts
private _registerItem(value, data) {
  this._items = new Map(this._items).set(value, data);  // ← a @state write
  this._filterItems();                                   // ← another @state write
}
```

Assigning to a `@state` field schedules a root update. That update rebuilds the
context. Every subscriber re-renders. So for **N** items:

| | cost |
|---|---|
| Item 1 registers | root update → **N** items re-render |
| Item 2 registers | root update → **N** items re-render |
| … | … |
| Item N registers | root update → **N** items re-render |
| **Total** | **N × N = N² item update cycles** |

For 20 options that's 400 — invisible. For 200 options it's **40,000**, which is
where the hitch comes from. The work is quadratic in a number the consumer
controls, which is the classic shape of a scaling bug: fine in every demo, bad in
production.

Note it's `N²` even though nothing in the code contains a nested loop. The nesting
is in the *reactivity graph*, not the source. That's what makes it easy to miss.

### Fix 1 — coalesce the writes

Batch all registrations into one state write per microtask:

```ts
private _pendingItems: Map<string, ComboboxItemData> | null = null;
private _itemFlushScheduled = false;

private _queueItemMutation(mutate) {
  // One pending copy, mutated in place — insertion order (= DOM order,
  // = navigation order) is preserved.
  this._pendingItems ??= new Map(this._items);
  mutate(this._pendingItems);

  if (this._itemFlushScheduled) return;
  this._itemFlushScheduled = true;

  queueMicrotask(() => {
    this._itemFlushScheduled = false;
    const next = this._pendingItems;
    this._pendingItems = null;
    if (next) this._items = next;   // ONE state write for all N items
  });
}
```

All N registrations happen in the same task, so they all land in the same pending
Map and flush together: **N² → N**. Applied to `combobox-root` and `select-root`.

### The steady-state cost

The second half of the problem. Every item did this after *every* render:

```ts
protected updated() {
  this._updateSelectionState();   // writes data-selected + aria-selected
  this._updateVisibility();       // writes style.display
  this._updateHighlightState();   // writes data-highlighted
}
```

Unconditionally. And since moving the highlight one row rebuilds the context,
every item re-renders. So one arrow keypress in a 200-item list performed **~600
DOM mutations**, 598 of which wrote the value that was already there. Style writes
invalidate layout, so this is not free.

### Fix 2 — cache what was last written

```ts
private _renderedSelected?: boolean;
private _renderedVisible?: boolean;
private _renderedHighlighted?: boolean;

private _updateVisibility() {
  const isVisible = filteredItems.has(this.value);
  if (isVisible === this._renderedVisible) return;   // ← the whole fix
  this._renderedVisible = isVisible;
  this.style.display = isVisible ? "" : "none";
}
```

Now an arrow keypress writes to exactly two items: the one losing the highlight
and the one gaining it.

### How to spot it again

Ask: *does one user action cause a state write that every child observes?* If
yes, then (a) coalesce writes that happen in bursts, and (b) make each observer's
DOM writes conditional. The second one matters even after the first, because
steady-state churn isn't a mount-time problem.

---

## 4. Lit's update order — and why `changedProperties` is a trap

**Symptom.** `<select-root name="country" default-value="united-states">`
displayed "United States" correctly but submitted an **empty form**. Same for
combobox. A `<switch-root default-checked>` rendered in the *off* position.
Everything started working the moment you changed something by hand.

### Mechanism

`ControlledState` is a `ReactiveController` that latches a late-arriving
`default-*` value (late because React, and `@lit/react`, assign properties
*after* the element connects). It latched in `hostUpdate()` and announced the
change with `requestUpdate(name, previous)`, with this comment:

```ts
// `hostUpdate` runs at the start of `performUpdate`, before `willUpdate` …
```

**That comment was false.** From `@lit/reactive-element`'s `performUpdate`:

```js
shouldUpdate = this.shouldUpdate(changedProperties);
if (shouldUpdate) {
  this.willUpdate(changedProperties);                    // ① first
  this.__controllers?.forEach((c) => c.hostUpdate?.());  // ② then
  this.update(changedProperties);                        // ③
}
```

Controller hooks run **after** `willUpdate`, not before. So the latch failed
three ways at once:

1. `willUpdate` had already run and never saw the key.
2. `requestUpdate` recorded the change into `changedProperties` — but `update()`
   immediately calls `__markUpdated()`, which **replaces that Map with a fresh
   one**. The record was discarded.
3. No follow-up update was scheduled either, because `_$changeProperty` only
   enqueues one when `isUpdatePending === false`, and mid-cycle it is still
   `true`.

Silent on all three counts. The value latched into internal state and rendered
fine, so it *looked* correct — but every `willUpdate` block keyed on
`changed.has("_value")` was skipped for it, and `_updateFormValue()` is exactly
such a block. Hence: correct on screen, absent from the form.

The switch was the same bug with a more visible face: `_updateDataAttributes()`
was skipped too, so the thumb never moved.

### Fix

Latch in `hostUpdate` (so `render()` sees the right value immediately), but
*announce* it in `hostUpdated`, which runs after `__markUpdated()` has set
`isUpdatePending = false` — so `requestUpdate` genuinely enqueues a second cycle:

```ts
hostUpdate() {
  // … latch …
  this._pendingAnnouncement = { previous };   // boxed: `undefined` is a real value
}

hostUpdated() {
  const pending = this._pendingAnnouncement;
  if (pending === undefined) return;
  this._pendingAnnouncement = undefined;
  this._requestUpdate(pending.previous);      // now it actually schedules
}
```

One extra update cycle per element, once, gated by an `_initialized` flag. Fixed
select, combobox and switch simultaneously.

### The broader lesson

`dialog-root` was never affected, and the reason is instructive. It doesn't read
`changedProperties` at all:

```ts
protected willUpdate(changed) {
  const open = this._isOpen;                       // derive from the value
  const openChanged = open !== this._lastSyncedOpen;
  if (openChanged) { this._lastSyncedOpen = open; this._syncDialogState(); }
}
```

**Deriving from the effective value is robust. `changedProperties.has(...)` is a
trap for any state a controller owns**, because whether the key appears depends
on lifecycle timing you don't control. Prefer the `_lastSynced` comparison
pattern for anything that must not be missed.

---

## 5. Keyboard vs pointer: two feedback loops

### Loop A — the highlight fighting the arrow keys

**Symptom.** Arrow-keying through a long combobox list with the mouse resting
over it made the highlight snap back to the cursor.

**Mechanism.** A genuine cycle:

```
ArrowDown → highlight moves → scrollIntoView() → list scrolls
          → a DIFFERENT item slides under the stationary cursor
          → pointerenter fires → highlight moves to it → scrollIntoView() → …
```

The mouse never moved. The list moved under it. `pointermove` was also bound,
which made it worse.

**Fix.** Drop `pointermove` entirely, and ignore hover-driven highlights until
the pointer *genuinely* moves again:

```ts
private _setHighlightedValue(value, source: HighlightSource = "keyboard") {
  if (source === "pointer") {
    if (this._ignorePointerHighlight) return;    // spurious — the list moved
  } else {
    this._ignorePointerHighlight = true;
    document.addEventListener("pointermove", this._release, { once: true, capture: true });
  }
  this._highlightedValue = value;
}
```

A real `pointermove` is the only thing that re-enables hover. Scroll-induced
`pointerenter` never arrives with one.

### Loop B — the unrequested focus ring

**Symptom.** Opening a dropdown with the mouse put a focus ring on the first item.

**Mechanism.** `_handleToggle` focused `_items[0]` on *every* open, with no idea
whether a mouse or a keyboard opened it.

**Fix.** Focus follows the activation source, which `attachPopoverToggle` already
knows (a `click` with no recorded `pointerdown` is a keyboard activation). The
trigger hands it over via `data-open-source`, since the `toggle` event carries no
such information:

- **Keyboard open** → focus the first item, as before.
- **Mouse open** → focus the *container*.

The container case matters and is easy to get wrong. Focus has to leave the
trigger regardless, or arrow keys would never reach the content's keydown
handler. Parking it on the container (`tabindex="-1"`) keeps keyboard navigation
working while no item paints a ring — and `_focusNext` already treats "no item
focused" as index `-1` and moves to the first item, so ArrowDown behaves
identically.

---

## 6. A selector that matched nothing — and a reset worth hardening anyway

**Symptom.** The Storybook select rendered with no background, border or padding
at all. You could read the page's content straight through the open menu.

### The actual cause

Embarrassingly simple. The story's stylesheet said:

```css
select-content [popover] { background: white; border: …; padding: 4px; }
```

That is a **descendant combinator**. It means "an element with a `popover`
attribute *inside* `select-content`". But `select-content` **is** the popover —
it sets the attribute on itself. Nothing matched, so the menu had no styling
whatsoever. `dropdown.stories.ts` had it right (`dropdown-content { … }`) all
along, which is why only the select looked broken.

```diff
- select-content [popover] {
+ select-content {
```

**Worth internalising:** when styling a custom element that sets an attribute on
*itself*, you want a compound selector (`select-content[popover]`) or just the
tag — never a space. A silently-matching-nothing selector produces no error, no
warning, and no styles.

### The related hardening

Diagnosing the above raised a fair question about the reset the content elements
carry, so it was tightened at the same time. The UA stylesheet gives every
`[popover]`:

```css
[popover] {
  margin: auto;  inset: 0;  border: solid;
  padding: 0.25em;  background-color: Canvas;  /* … */
}
```

…so *something* must neutralise it. But `border`, `padding` and `background` are
precisely the properties a consumer most wants to set, and pinning them in an
unlayered `:host` rule is asking for a fight. The reset now lives in a cascade
layer, with only the structural bits left unlayered:

```css
@layer red-popover-reset {
  :host {
    margin: 0; inset: auto;
    padding: 0; border: 0; background: transparent; outline: none;
  }
}

:host {
  position: fixed;   /* overriding this breaks positioning outright */
}
```

This keeps working from every direction: origin is the *first* cascade criterion,
so an author layer still beats the UA stylesheet and the popover is still
neutralised; and a consumer rule in the outer tree still wins on context.

`inset: auto` was a genuine omission — the reset had never neutralised the UA's
`inset: 0`.

To be clear about what this second change is: **hardening, not a fix for an
observed bug.** The transparent select was the selector above. Presenting the
layer change as the diagnosis would be tidier and less true.

## 7. Controlled mode means the consumer owns the value

Not a component bug — a *story* bug — but the confusion is worth documenting
because it looks exactly like a broken component.

The Storybook "Controlled" dialog rendered:

```ts
<dialog-root .open=${args.open}>   // args.open is always false
```

…with no listener. Clicking the trigger did nothing.

That is **correct behaviour**. In controlled mode `ControlledState.set()` is a
deliberate no-op: the consumer owns the value, and the component's job is to
*report intent* (`dialog:open-change`) and wait to be told. With nothing closing
the loop, nothing can happen — same as a React `<input value={x} />` with no
`onChange`.

The fix belongs in the story, which now behaves like a real controller:

```ts
const [, updateArgs] = useArgs();
const setOpen = (e) => updateArgs({ open: e.detail.open });

return html`<dialog-root .open=${args.open} @dialog:open-change=${setOpen}>…`;
```

Worth remembering when a component "doesn't work" in controlled mode: check
whether anything is actually writing the value back.

---

## Quick reference

| Symptom | Likely cause |
|---|---|
| Trigger won't close its own popover | Light-dismiss race; custom elements can't be invokers (§1) |
| Popover flickers or jumps on open | Async positioning without a paint gate; gate set from `toggle` not `beforetoggle` (§2) |
| Long lists hitch on mount | Per-item state writes rebuilding a shared context — N² (§3) |
| Keypress feels heavy | Unconditional DOM writes in `updated()` across all children (§3) |
| `default-*` renders but doesn't submit | `willUpdate` ran before the controller latched — `changedProperties` trap (§4) |
| Highlight fights the arrow keys | `scrollIntoView` → `pointerenter` feedback loop (§5) |
| Focus ring on mouse open | Focus moved without checking the activation source (§5) |
| Element styled with a descendant combinator gets nothing | The element *is* the popover — no space in the selector (§6) |
| Controlled component "does nothing" | Nothing writing the value back (§7) |

## Source map

| Concern | File |
|---|---|
| Light-dismiss toggle guard | `packages/core/src/popover-toggle.ts` |
| Manual-popover dismissal | `packages/core/src/dismiss.ts` |
| Anchoring + paint gate | `packages/core/src/floating-controller.ts` |
| Controlled/uncontrolled state | `packages/core/src/controlled-state.ts` |
| Item batching | `packages/combobox/src/combobox-root.ts`, `packages/select/src/select-root.ts` |
| Render caches, hover suppression | `packages/combobox/src/combobox-item.ts` |
| Activation-aware focus | `packages/dropdown/src/dropdown-trigger.ts`, `packages/dropdown/src/dropdown-content.ts` |
