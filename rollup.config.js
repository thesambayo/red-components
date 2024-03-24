import { defineConfig } from 'rollup';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import minifyHTML from 'rollup-plugin-minify-html-literals';
// import { dts } from "rollup-plugin-dts";
// import typescript2 from 'rollup-plugin-typescript2';
import fs from 'node:fs';
import { exec } from "node:child_process"
import { cwd, env, exit } from 'node:process';

const babelConfig = {
    babelrc: false,
    ...{
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        ie: '11',
                    },
                },
            ],
        ],
    },
};


// this is in the context of root module
// it should most likely be corrected to be in the context of the package level not root
const PACKAGE_ROOT_PATH = cwd();

/** @param {string} command - Bash command to run */
function execute(command) {
    exec(command, (err, stdout, stderr) => {
        process.stdout.write(stdout)
    })
}

export default commandLineArgs => {
    // console.log(commandLineArgs);
    // console.log(env)

    let packageName = '';
    fs.readdirSync(`${PACKAGE_ROOT_PATH}/packages`).map(dirName => {
        if (commandLineArgs[dirName]) packageName = dirName;
    });

    if (!packageName) {
        exit(0);
        return;
    };

    // delete current package dist directory
    execute(`rm -rf ${PACKAGE_ROOT_PATH}/packages/${packageName}/dist`);

    return defineConfig({
        input: {
            index: `${PACKAGE_ROOT_PATH}/packages/${packageName}/src/index.ts`,
            [packageName]: `${PACKAGE_ROOT_PATH}/packages/${packageName}/src/${packageName}.ts`,
        },
        output: [
            {
                dir: `${PACKAGE_ROOT_PATH}/packages/${packageName}/dist/`,
                entryFileNames: "[name].mjs",
                format: 'esm', // same as "es" I guess
                // plugins: [dts({
                //     tsconfig: `${PACKAGE_ROOT_PATH}/tsconfig.base.json`,
                // })],
                // esModule: true,
            },
            {
                dir: `${PACKAGE_ROOT_PATH}/packages/${packageName}/dist/`,
                entryFileNames: "[name].js",
                format: 'cjs',

            },
        ],
        external: ["react", "@lit/react"],
        // external: [/@babel\/runtime/, "react", "@lit/react"],
        plugins: [
            typescript({
                tsconfig: `${PACKAGE_ROOT_PATH}/packages/${packageName}/tsconfig.json`,
            }),
            minifyHTML.default(),
            resolve(),
            // babel({
            //     exclude: 'node_modules/**',
            //     rootMode: 'upward',
            //     babelHelpers: 'runtime'
            // }),
            babel(babelConfig),
            terser(),
        ],
        // preserveEntrySignatures: false,
    });
};
