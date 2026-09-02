# @red-elements/combobox

## 0.1.0

### Minor Changes

- 79b4736: Overlay behaviour, form defaults, and long-list performance.

  **Fixed**

  - Clicking a trigger while its menu was open reopened it instead of closing it,
    with a visible blink. Custom elements cannot be registered as Popover API
    invokers, so the browser's light dismiss closed the popover on pointerup and
    the click handler then reopened it. Affected dropdown and select.
  - Clicking into a combobox's input while the list was open closed and reopened
    it, so the caret never landed where you aimed. The listbox is now a
    `manual` popover with an explicitly declared boundary covering the anchor,
    input and trigger.
  - Menus flickered on open, and jumped to the previous position when reopened
    after scrolling. Positioned content is now hidden until its first position has
    settled, and stale coordinates are cleared on close. Affected dropdown,
    select, combobox and tooltip.
  - `default-value` and `default-checked` never reached the form. The value
    rendered correctly but `ElementInternals.setFormValue` was never called, so
    forms submitted empty until the user changed something by hand. Lit runs
    `willUpdate` _before_ controller hooks, so the latched default missed the
    `changedProperties` map that `update()` then discarded. Affected select,
    combobox and switch; a `switch` with `default-checked` also rendered in the
    off position.
  - Combobox focus hopped between the trigger and the input on close, and with
    `open-on-focus` the second focus reopened what had just been closed. Return
    focus now has a single owner and is skipped when focus has legitimately moved
    elsewhere.
  - Arrow-key navigation in a combobox fought the mouse: scrolling the highlighted
    item into view slid a different item under a stationary cursor, whose
    `pointerenter` snapped the highlight back.
  - A combobox built from a `<combobox-trigger>` with no anchor opened completely
    invisible, because positioning bailed out and the reveal it gates never ran.
  - Dropdown menus opened by mouse put a focus ring on the first item. Focus now
    follows the activation source: the first item for keyboard opens, the menu
    container for mouse opens, so arrow keys still work either way.

  **Performance**

  - Mounting a select or combobox cost O(N²) update cycles for N options: each
    item's registration wrote a `@state` map, and each write rebuilt the context
    object that every item consumes. Registrations are now coalesced into a single
    flush.
  - Every combobox item wrote three DOM mutations on every keystroke and every
    highlight move, whether or not anything had changed — roughly 600 redundant
    writes per keypress in a 200-item list. Items now write only on actual change.

  **Added**

  - `width="trigger"` on `select-content`, `dropdown-content` and
    `combobox-content` sizes the surface to match its anchor. The underlying
    `--select-trigger-width` / `--dropdown-trigger-width` / `--combobox-input-width`
    custom properties remain available for cases the shorthand does not cover.
  - `@red-elements/core` exports `attachPopoverToggle` and `attachDismiss`.

  **Changed**

  - Content elements declare their UA popover reset in a cascade layer, so
    consumer styles — including layered utilities such as Tailwind's — reliably
    win over `background`, `border` and `padding`. The UA's `inset: 0` is now
    reset too.

- 79b4736: Release 0.1.0: packaging fixes, a shared core, and a unified API.

  **Breaking**

  - Removed `as-child`. The component element is now the control itself — style it
    directly. To use your own element, mark it with `data-{component}-trigger`
    (available on every trigger-bearing component; tabs and accordion take the
    item value, e.g. `data-tab-trigger="tab1"`).
  - Events are namespaced `{component}:{kebab-event}` — `openChange` is now
    `dialog:open-change`, `change` is `accordion:value-change`, and so on. React
    wrapper props are unchanged (`onOpenChange` is still `onOpenChange`).
  - Toast `content` is rendered as text. Raw markup now requires the explicitly
    named `unsafeHtml` field.

  **Fixed**

  - Packages could not be used at all: the element entry and the React entry each
    bundled their own copy of the component classes, so importing both threw
    `NotSupportedError: the name "x-root" has already been used`. They now share a
    chunk and register each element once.
  - `lit` and friends are peer dependencies instead of being inlined, so apps no
    longer load several copies of Lit.
  - The framework-agnostic entry is reachable: `@red-elements/{name}/elements`.
  - `sideEffects` no longer let bundlers tree-shake away element registration.
  - Select, dropdown and tooltip content stayed where it was first positioned;
    all floating content now tracks its anchor on scroll and resize.
  - Combobox `open-on-click`/`open-on-focus` never worked — the values were not
    passed through context.
  - Combobox ignored `default-open`, and accordion and dialog ignored their
    defaults, when props arrived after mount (the React case).
  - Tooltip content dropped every custom prop from its React types.
  - Dialog only looked for its `<dialog>` once, missing conditionally rendered
    ones, and never released close-button listeners.
  - Toast leaked a `matchMedia` listener on every disconnect, and followed the OS
    colour scheme even when a theme was set explicitly.
  - Dialog, alert-dialog trigger/close/action/cancel are announced as buttons —
    they previously had `tabindex` but no `role`.

  **Added**

  - `@red-elements/core`: shared `generateId`, `ControlledState`,
    `FloatingController`, `attachBehavior` and `dispatch`.
  - Tabs and avatar expose their events to React (`onValueChange`,
    `onLoadingStatusChange`) — they previously had no events map at all.

### Patch Changes

- Updated dependencies [79b4736]
- Updated dependencies [79b4736]
  - @red-elements/core@0.1.0

## 0.0.1

### Patch Changes

- Initial release
- Combobox component with single and multiple selection
- Client-side filtering with locale-aware search
- Full keyboard navigation and ARIA compliance
