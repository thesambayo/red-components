---
"@red-elements/core": minor
"@red-elements/accordion": minor
"@red-elements/alert-dialog": minor
"@red-elements/avatar": minor
"@red-elements/combobox": minor
"@red-elements/dialog": minor
"@red-elements/dropdown": minor
"@red-elements/select": minor
"@red-elements/switch": minor
"@red-elements/tabs": minor
"@red-elements/toast": minor
"@red-elements/tooltip": minor
---

Release 0.1.0: packaging fixes, a shared core, and a unified API.

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
