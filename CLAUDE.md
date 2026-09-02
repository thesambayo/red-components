# CLAUDE.md

Guidance for agents and new contributors working in this repository.

## What this is

`red-elements` — accessible, **unstyled** web components built on Lit, published
as one npm package per component (`@red-elements/select`, `/dropdown`, …) plus a
shared `@red-elements/core`. Consumers bring all their own CSS; we supply
behaviour, accessibility and positioning.

pnpm workspace. `packages/*` are published; `apps/docs` (Astro) and
`apps/showcase` (React) are not.

## Commands

```bash
pnpm build          # typecheck → rollup → check-dist. Run this before saying you are done.
pnpm typecheck      # tsc only
pnpm story:dev      # Storybook on :6006 — the primary way components are exercised
pnpm story:build    # builds Storybook; also the only typecheck that covers *.stories.ts
pnpm docs:dev       # Astro docs site
```

**There is no test suite.** Verification is `pnpm build` plus looking at the
component in Storybook. Two consequences:

- `pnpm build` excludes `*.stories.ts` from typechecking (see
  `scripts/tsconfig.assert.json`). If you edit a story, run `pnpm story:build` —
  a broken story will otherwise sail through a green build.
- Anything behavioural (focus, dismissal, positioning, flicker) **cannot be
  verified from the terminal**. Say plainly what you verified statically and
  what still needs a browser; do not imply a behavioural fix is confirmed. The
  maintainer runs the dev servers and checks in the browser — don't start
  long-running servers yourself.

## Read these before changing a component

| Document | Why |
|---|---|
| `docs/ARCHITECTURE.md` | Package layout, context pattern, core utilities, build output |
| `docs/COMPONENT_LIFECYCLE.md` | The open → position → focus → dismiss sequence every overlay shares |
| `docs/COMPONENT_FIXES.md` | Bugs already found and the mechanisms behind them — read before "fixing" anything in this area |
| `docs/COMPONENTS.md` | Per-component API surface |
| `docs/CONTRIBUTING.md` | Adding a new package |
| `docs/POPOVER_API_MIGRATION.md` | Why the Popover API, and the per-component API that came out of it |
| `docs/native-option.md` | Reference for native `<dialog>`, Popover, and CSS anchor positioning |

Every one of these describes the code as it currently stands. If one contradicts
the source, the source is right and the document is a bug — fix it in the same
change rather than working around it.

## Invariants that are easy to break

These are load-bearing. Each one has already caused a bug.

1. **Use `ControlledState` for controlled/uncontrolled state.** Do not hand-roll
   `_hasInitialized` + `willUpdate` late-init. React (and `@lit/react`) assigns
   properties *after* connection, so defaults arrive late, and the hand-rolled
   version gets the Lit update order wrong.

2. **Do not key must-not-miss logic on `changedProperties.has(...)` for
   controller-owned state.** Lit runs `willUpdate` *before* controller
   `hostUpdate`, so a controller's change can miss the map entirely. Derive from
   the effective value against a `_lastSynced` field — see `dialog-root`.

3. **Never call `showPopover()` from a plain `click` handler on a custom
   element.** Custom elements cannot be popover invokers, so light dismiss
   closes the popover on pointerup and the click reopens it. Use
   `attachPopoverToggle` from core.

4. **Positioned content must gate its first paint.** Use `FloatingController`,
   and call `gate()` from `beforetoggle` (synchronous) — never from `toggle`
   (queued as a task). Every code path that skips positioning must lift the
   gate, or the element opens invisible.

5. **Don't write state per item.** Item registration is coalesced into one
   microtask flush in `select-root` and `combobox-root`. A per-item `@state`
   write rebuilds the context that every item consumes — that is O(N²).

6. **Shadow-root resets belong in `@layer`.** `:host` rules naming `background`,
   `padding` or `border` will fight consumer CSS. Only structural properties
   (`position`) stay unlayered.

7. **Events are namespaced** (`select:value-change`, never bare `change`) and
   dispatched with `bubbles` + `composed` via `dispatch()` from core.

## Conventions

- Comments explain **why**, not what. Match the density of the surrounding file —
  it is high in `core/` and on anything subtle, near-zero on plain markup.
- Components are unstyled. Expose state as `data-*` attributes
  (`data-state="open"`, `data-highlighted`, `data-disabled`) for consumers to
  hook, rather than shipping opinions.
- Controlled properties (`value`, `open`, `checked`) are **JS-only** — no HTML
  attribute, because an absent attribute is indistinguishable from a falsy one.
  Plain HTML uses `default-*` and listens for the change event.
- Changesets are required for anything published: `pnpm changeset`.
