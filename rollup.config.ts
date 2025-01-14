import { readdirSync, statSync } from "node:fs";
import { exec } from "node:child_process";
import { cwd } from "node:process";
import { join } from "node:path";

import { RollupOptions } from "rollup";
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const PACKAGE_ROOT_PATH = cwd();
const PACKAGES_DIR_PATH = `${PACKAGE_ROOT_PATH}/packages`;

/** @param {string} command - execute Bash command */
function execute(command: string) {
	exec(command, (err, stdout, stderr) => {
		process.stdout.write(stdout);
	});
}

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

	execute(`rm -rf ${packageFullPath}/dist`);

	const webComponentConfig: RollupOptions = {
		input: `${packageFullPath}/src/${dirName}.ts`,
		output: [
			{
				file: `${packageFullPath}/dist/${dirName}.js`,
				format: 'cjs'
			},
			{
				file: `${packageFullPath}/dist/${dirName}.mjs`,
				format: 'es'
			}
		],
		plugins: [
			typescript({ tsconfig: `${packageFullPath}/tsconfig.json`, }),
			resolve(),
			terser(),
			filesize(),
		],
	};

	const reactComponentConfig: RollupOptions = {
		input: `${packageFullPath}/src/index.ts`,
		output: [
			{
				file: `${packageFullPath}/dist/index.js`,
				format: 'cjs'
			},
			{
				file: `${packageFullPath}/dist/index.mjs`,
				format: 'es'
			}
		],
		external: ["react", "@lit/react"],
		plugins: [
			typescript({ tsconfig: `${packageFullPath}/tsconfig.json`, }),
			resolve(),
			terser(),
			filesize(),
		],
	};

	configs.push(webComponentConfig, reactComponentConfig);
});

// export default (commandLineArgs) => {
//     console.log(commandLineArgs);
//     return configs;
// };

export default configs;