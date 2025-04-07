import type { StorybookConfig } from "@storybook/web-components-vite";
import { getPackageImportURL } from "./packages";

const config: StorybookConfig = {
  stories: ["../packages/**/**/*.stories.ts"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {},
  async viteFinal(config, { configType }) {
    const newConfig = {
      ...config,
      build: {
        ...config.build,
        target: "esnext",
      },
      define: {
        ...config.define,
        "import.meta.env.VITE_ACCORDION_URL": JSON.stringify(
          getPackageImportURL("ACCORDION", configType)
        ),
        "import.meta.env.VITE_AVATAR_URL": JSON.stringify(
          getPackageImportURL("AVATAR", configType)
        ),
        "import.meta.env.VITE_DIALOG_URL": JSON.stringify(
          getPackageImportURL("DIALOG", configType)
        ),
        "import.meta.env.VITE_DROPDOWN_URL": JSON.stringify(
          getPackageImportURL("DROPDOWN", configType)
        ),
        "import.meta.env.VITE_TABS_URL": JSON.stringify(
          getPackageImportURL("TABS", configType)
        ),
        "import.meta.env.VITE_TOAST_URL": JSON.stringify(
          getPackageImportURL("TOAST", configType)
        ),
        "import.meta.env.VITE_TOOLTIP_URL": JSON.stringify(
          getPackageImportURL("TOOLTIP", configType)
        ),
      },
    };
    return newConfig;
  },
};
export default config;
