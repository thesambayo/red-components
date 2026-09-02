# Red Elements - Project Overview

Unstyled, accessible web component primitives built with **Lit**, with first-class **React** wrappers via `@lit/react`.

## Tech Stack

| Layer              | Technology                              |
| ------------------ | --------------------------------------- |
| Web Components     | Lit 3.3.2, TypeScript 5.9.3            |
| React Wrappers     | @lit/react 1.0.8, React 19             |
| Positioning        | @floating-ui/dom 1.7.4                 |
| State / Context    | @lit/context 1.1.6, @lit-labs/signals  |
| Build              | Rollup 4.56.0                          |
| Stories            | Storybook 10.2.0 (Web Components Vite) |
| Docs Site          | Astro + Tailwind CSS                   |
| Showcase App       | React 19 + Vite + Tailwind             |
| Package Manager    | pnpm 9.15.4                            |
| Native APIs Used   | `<dialog>`, Popover API, ElementInternals, Custom Events |

## Monorepo Structure

```
red-elements/
├── packages/           # 11 component packages + core (@red-elements/*)
│   ├── core            # shared primitives (no custom elements)
│   ├── accordion
│   ├── alert-dialog
│   ├── avatar
│   ├── combobox
│   ├── dialog
│   ├── dropdown
│   ├── select
│   ├── tabs
│   ├── switch
│   ├── toast
│   └── tooltip
├── apps/
│   ├── docs/           # Astro documentation site
│   └── showcase/       # React demo app
├── .storybook/         # Storybook config
├── docs/               # Project knowledge base (this directory)
├── rollup.config.ts    # Build config
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Knowledge base

Start with `CLAUDE.md` at the repo root — it is the short version and links here.

| Document | What it is for |
| -------- | -------------- |
| `ARCHITECTURE.md` | Package layout, context pattern, core utilities, build output |
| `COMPONENT_LIFECYCLE.md` | The shared open → gate → position → focus → dismiss flow, and where each component deviates |
| `COMPONENT_FIXES.md` | Bugs already found, and the platform mechanisms behind them |
| `COMPONENTS.md` | Per-component API surface |
| `CONTRIBUTING.md` | Adding a new package |
| `WEB_COMPONENT_BEST_PRACTICES.md` | Framework interop, update loops, anti-patterns |
| `POPOVER_API_MIGRATION.md` | Why the Popover API, and the per-component API that came out of it |
| `native-option.md` | Reference for native `<dialog>`, the Popover API, and CSS anchor positioning |

All of these describe the code as it currently stands. If one contradicts the
source, the source is right and the document is a bug — fix it.

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `pnpm typecheck`   | Typecheck all package source |
| `pnpm build`       | Typecheck + Rollup build + dist guards |
| `pnpm story:dev`   | Storybook dev server         |
| `pnpm story:build` | Storybook production build   |
| `pnpm docs:dev`    | Astro docs dev server        |
| `pnpm docs:build`  | Astro docs production build  |
| `pnpm showcase:dev`| React showcase dev server    |

## Engine Requirements

- Node >= 22
- pnpm 9.15.4
