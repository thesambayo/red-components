import { readdirSync, statSync, rmSync, existsSync } from "node:fs";
import { cwd } from "node:process";
import { join } from "node:path";

import { RollupOptions } from "rollup";
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const PACKAGE_ROOT_PATH = cwd();
const PACKAGES_DIR_PATH = `${PACKAGE_ROOT_PATH}/packages`;

/**
 * Dependencies that must never be inlined into a package bundle.
 *
 * Bundling `lit` would ship a private copy of ReactiveElement per package,
 * triggering "Multiple versions of Lit loaded" and breaking cross-package
 * context. These are declared as peerDependencies by each package instead.
 */
const EXTERNAL = [
  /^lit($|\/)/,
  "@lit/context",
  "@floating-ui/dom",
  "@red-elements/core",
  "react",
  "@lit/react",
];

let configs: RollupOptions[] = [];

readdirSync(PACKAGES_DIR_PATH).forEach((dirName) => {
  /**
	@description this represents the fullpath to individual package directory
	@example "../red-components/packages/accordion"
	*/
  const packageFullPath = join(PACKAGES_DIR_PATH, dirName);

  // takes care of any potential .DS_Store created by mac
  // don't know about windows or linux
  if (!statSync(packageFullPath).isDirectory()) {
    return;
  }

  rmSync(join(packageFullPath, "dist"), { recursive: true, force: true });

  /**
   * Entry points, if present. `@red-elements/core` ships neither custom
   * elements nor React wrappers, so it only has an `index.ts`.
   */
  const input: Record<string, string> = {};
  const elementEntry = join(packageFullPath, "src", `${dirName}.ts`);
  const reactEntry = join(packageFullPath, "src", "index.ts");
  if (existsSync(elementEntry)) input[dirName] = elementEntry;
  if (existsSync(reactEntry)) input.index = reactEntry;
  if (Object.keys(input).length === 0) {
    return;
  }

  /**
   * A single multi-input build per package.
   *
   * The element entry (`{name}.ts`) and the React entry (`index.ts`) share the
   * component classes, so they MUST be built together. Built separately, each
   * output carries its own copy of every class and calls `customElements.define`
   * for the same tag names - importing both entries in one app then throws
   * `NotSupportedError: the name "x-root" has already been used`.
   *
   * With both as inputs of one build, Rollup hoists the shared classes into a
   * single chunk that both entries import, so each tag is defined exactly once.
   */
  configs.push({
    input,
    output: [
      {
        dir: `${packageFullPath}/dist`,
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    ],
    external: EXTERNAL,
    plugins: [
      typescript({ tsconfig: `${packageFullPath}/tsconfig.json` }),
      resolve(),
      terser(),
      filesize(),
    ],
  });
});

export default configs;
