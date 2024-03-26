import { cwd } from "node:process";
import { readdirSync } from "node:fs";
import { exec } from "node:child_process";

import { RollupOptions } from "rollup";
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const PACKAGE_ROOT_PATH = cwd();

/** @param {string} command - execute Bash command */
function execute(command: string) {
    exec(command, (err, stdout, stderr) => {
        process.stdout.write(stdout)
    })
}

const configs: RollupOptions[] = [];

readdirSync(`${PACKAGE_ROOT_PATH}/packages`).map(dirName => {
    execute(`rm -rf ${PACKAGE_ROOT_PATH}/packages/${dirName}/dist`);

    const rollUpOption: RollupOptions = {
        input: {
            index: `${PACKAGE_ROOT_PATH}/packages/${dirName}/src/index.ts`,
            [dirName]: `${PACKAGE_ROOT_PATH}/packages/${dirName}/src/${dirName}.ts`,
        },
        output: [
            {
                dir:`${PACKAGE_ROOT_PATH}/packages/${dirName}/dist`,
                entryFileNames: "[name].mjs",
                format: "esm",
            },
            {
                dir:`${PACKAGE_ROOT_PATH}/packages/${dirName}/dist`,
                entryFileNames: "[name].js",
                format: "cjs",
            },
        ],
        external: ["react", "@lit/react"],
        plugins: [
            typescript({
                tsconfig: `${PACKAGE_ROOT_PATH}/packages/${dirName}/tsconfig.json`,
                experimentalDecorators: true,
            }),
            resolve(),
            terser(),
            // filesize()
        ],
    };

    configs.push(rollUpOption);
});

// export default (commandLineArgs) => {
//     console.log(commandLineArgs);
//     return configs;
// };

export default configs;
