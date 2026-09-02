/**
 * Post-build assertions on every package's dist output.
 *
 * Guards the two failure modes that made the published packages unusable:
 *
 *  1. Duplicate custom element registration. When the element entry and the
 *     React entry are built separately, each carries its own copy of the
 *     component classes and each calls `customElements.define` for the same
 *     tags. Importing both in one app throws
 *     `NotSupportedError: the name "x-root" has already been used`.
 *
 *  2. Inlined Lit. Bundling `lit` ships a private ReactiveElement per package,
 *     which triggers "Multiple versions of Lit loaded" and can break context
 *     across packages.
 *
 * Run automatically after `pnpm build`.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PACKAGES_DIR = "packages";
const failures = [];
const checked = [];

/** Markers that only appear when Lit itself has been inlined into a bundle. */
const INLINED_LIT_MARKERS = ["ReactiveElement", "elementProperties", "litPropertyMetadata"];

for (const name of readdirSync(PACKAGES_DIR)) {
  const distDir = join(PACKAGES_DIR, name, "dist");
  if (!existsSync(distDir)) continue;

  const elementEntry = join(distDir, `${name}.js`);
  const reactEntry = join(distDir, "index.js");

  // Utility packages (e.g. @red-elements/core) ship neither custom elements
  // nor React wrappers, so they have no element entry to check.
  const isUtilityPackage = !existsSync(elementEntry);

  for (const entry of [elementEntry, reactEntry]) {
    if (!existsSync(entry)) {
      if (!isUtilityPackage) {
        failures.push(`${name}: missing expected entry ${entry}`);
      }
      continue;
    }
    const code = readFileSync(entry, "utf8");

    // 1. Element classes must live in a shared chunk, not in either entry.
    //    An entry that declares a class is an entry that defines tags itself.
    if (!isUtilityPackage && /class\s+\w*\s*extends/.test(code)) {
      failures.push(
        `${name}: ${entry} declares component classes inline - both entries ` +
          `will register the same tags. They must share a chunk.`
      );
    }

    // 2. Lit must stay an external bare import.
    const inlined = INLINED_LIT_MARKERS.filter((m) => code.includes(m));
    if (inlined.length) {
      failures.push(
        `${name}: ${entry} has Lit inlined (found ${inlined.join(", ")}). ` +
          `Add it to EXTERNAL in rollup.config.ts.`
      );
    }
  }

  // 3. Both entries must resolve to the SAME shared chunk, or they are still
  //    two independent copies of the component classes.
  if (!isUtilityPackage && existsSync(elementEntry) && existsSync(reactEntry)) {
    const chunkOf = (file) =>
      [...readFileSync(file, "utf8").matchAll(/["'](\.\/chunks\/[^"']+)["']/g)].map(
        (m) => m[1]
      );
    const shared = chunkOf(elementEntry).filter((c) =>
      chunkOf(reactEntry).includes(c)
    );
    if (shared.length === 0) {
      failures.push(
        `${name}: element entry and React entry share no chunk - each carries ` +
          `its own component classes and both will call customElements.define.`
      );
    } else {
      checked.push(`${name} -> ${shared[0]}`);
    }
  }
}

// 4. Every workspace package imported by the built output must be declared as
//    a dependency. The monorepo resolves undeclared imports fine, so this only
//    surfaces when a real consumer installs the package - by which point it is
//    published and broken.
for (const name of readdirSync(PACKAGES_DIR)) {
  const dir = join(PACKAGES_DIR, name);
  const distDir = join(dir, "dist");
  const manifestPath = join(dir, "package.json");
  if (!existsSync(distDir) || !existsSync(manifestPath)) continue;

  const pkg = JSON.parse(readFileSync(manifestPath, "utf8"));
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);

  const files = [];
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".js")) files.push(full);
    }
  };
  walk(distDir);

  const imported = new Set();
  for (const file of files) {
    const code = readFileSync(file, "utf8");
    for (const m of code.matchAll(/from["'](@red-elements\/[a-z-]+)["']/g)) {
      imported.add(m[1]);
    }
  }

  for (const dep of imported) {
    if (dep !== pkg.name && !declared.has(dep)) {
      failures.push(
        `${name}: imports ${dep} but does not declare it in dependencies - ` +
          `this resolves in the workspace but breaks for real consumers.`
      );
    }
  }
}

if (failures.length) {
  console.error("\ncheck-dist FAILED:\n");
  for (const f of failures) console.error(`  x ${f}`);
  console.error("");
  process.exit(1);
}

console.log(`\ncheck-dist passed - ${checked.length} packages share one chunk per package:`);
for (const c of checked) console.log(`  ok ${c}`);
console.log("");
