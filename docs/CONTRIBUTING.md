# Contributing a New Component

## Steps to Add a New Package

1. **Create the package directory:**
   ```
   packages/{component-name}/
   ```

2. **Create `package.json`** following existing convention:
   ```json
   {
     "name": "@red-elements/{component-name}",
     "version": "0.0.1",
     "type": "module",
     "main": "dist/{component-name}.js",
     "exports": {
       ".": "./dist/{component-name}.js",
       "./react": "./dist/index.js"
     },
     "files": ["dist"],
     "peerDependencies": {
       "react": "^19.0.0"
     },
     "peerDependenciesMeta": {
       "react": { "optional": true }
     }
   }
   ```

3. **Create `tsconfig.json`:**
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "rootDir": "src",
       "outDir": "dist",
       "declaration": true,
       "declarationDir": "dist"
     },
     "include": ["src"]
   }
   ```

4. **Create source files in `src/`:**
   - `types.ts` - context value interface
   - `context.ts` - `createContext()` + `generateId()`
   - `{component}-root.ts` - root element (state + `@provide`)
   - `{component}-{part}.ts` - child elements (`@consume`)
   - `{component}.ts` - barrel re-export of all web components
   - `index.ts` - React wrappers via `createComponent`
   - `{component}.stories.ts` - Storybook stories

5. **Register in rollup.config.ts:**
   Add entries to the `packages` array in the rollup config.

6. **Add Storybook env var** in `.storybook/main.ts`:
   ```typescript
   define: {
     "import.meta.env.VITE_{COMPONENT}_URL": JSON.stringify("../packages/{component}/src/{component}.ts"),
   }
   ```

7. **Add to docs** in `apps/docs/src/pages/docs/components/{component}.astro`

## Checklist for Every Component

- [ ] Root component manages all state
- [ ] Context provided from root, consumed by children
- [ ] Controlled + uncontrolled state support
- [ ] Custom events with `bubbles: true, composed: true`
- [ ] Data attributes for styling (`data-state`, `data-disabled`, etc.)
- [ ] Keyboard navigation (appropriate for the component type)
- [ ] ARIA attributes for accessibility
- [ ] React wrappers with event mapping
- [ ] Storybook stories with interactive examples
- [ ] `render()` returns `html\`<slot></slot>\``
