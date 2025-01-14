import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: [
    // "../stories/**/*.mdx",
    // "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // "../stories/**/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    '../packages/**/**/*.stories.ts'
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
	async viteFinal(config, { configType }) {
    // customize the Vite config here
		config.optimizeDeps = {
			include: [...(config.optimizeDeps?.include ?? []), '@storybook/web-components', 'lit', 'lit-html'],
			// exclude: [...(config.optimizeDeps?.exclude ?? []), 'lit', 'lit-html']
		}
    // config.optimizeDeps.include = [...(config.optimizeDeps?.include ?? []), '@storybook/web-components']
    // config.optimizeDeps.exclude = [...(config.optimizeDeps?.exclude ?? []), 'lit', 'lit-html']

    // return the customized config
    return config
  },
};
export default config;

// // .storybook/main.js
// module.exports = {
//   stories: ['../src/ **/*.stories.mdx', '../src/** /*.stories.@(js|jsx|ts|tsx)'],
//   addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
//   framework: '@storybook/web-components',
//   core: {
//     builder: 'storybook-builder-vite',
//   },
//   async viteFinal(config, { configType }) {
//     // customize the Vite config here
//     config.optimizeDeps.include = [...(config.optimizeDeps?.include ?? []), '@storybook/web-components']
//     config.optimizeDeps.exclude = [...(config.optimizeDeps?.exclude ?? []), 'lit', 'lit-html']

//     // return the customized config
//     return config
//   },
// }
