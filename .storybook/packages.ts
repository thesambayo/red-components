const PACKAGES = {
  ACCORDION: {
    dev: "./accordion",
    prod: "https://unpkg.com/@red-elements/accordion@0.0.4/dist/accordion.mjs",
  },
  AVATAR: {
    dev: "./avatar",
    prod: "https://unpkg.com/@red-elements/avatar@0.0.3/dist/avatar.mjs",
  },
  TABS: {
    dev: "./tabs",
    prod: "https://unpkg.com/@red-elements/tabs@0.0.4/dist/tabs.mjs",
  },
  TOOLTIP: {
    dev: "./tooltip",
    prod: "https://unpkg.com/@red-elements/tooltip@0.0.5/dist/tooltip.mjs",
  },
};

export function getPackageImportURL(
  packageName: keyof typeof PACKAGES,
  configType?: "DEVELOPMENT" | "PRODUCTION",
) {
  if (configType === "PRODUCTION") {
    return PACKAGES[packageName].prod;
  }
  return PACKAGES[packageName].dev;
}
