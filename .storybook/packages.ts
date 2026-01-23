const PACKAGES = {
  ACCORDION: {
    dev: "./accordion",
    prod: "https://unpkg.com/@red-elements/accordion@0.0.4/dist/accordion.mjs",
  },
  ALERT_DIALOG: {
    dev: "./alert-dialog",
    prod: "https://unpkg.com/@red-elements/alert-dialog@0.0.1/dist/alert-dialog.mjs",
  },
  AVATAR: {
    dev: "./avatar",
    prod: "https://unpkg.com/@red-elements/avatar@0.0.3/dist/avatar.mjs",
  },
  COMBOBOX: {
    dev: "./combobox",
    prod: "https://unpkg.com/@red-elements/combobox@0.0.1/dist/combobox.mjs",
  },
  DIALOG: {
    dev: "./dialog",
    prod: "https://unpkg.com/@red-elements/dialog@0.0.1/dist/dialog.mjs",
  },
  DROPDOWN: {
    dev: "./dropdown",
    prod: "https://unpkg.com/@red-elements/dropdown@0.0.3/dist/dropdown.mjs",
  },
  TABS: {
    dev: "./tabs",
    prod: "https://unpkg.com/@red-elements/tabs@0.0.4/dist/tabs.mjs",
  },
  TOAST: {
    dev: "./toast",
    prod: "https://unpkg.com/@red-elements/toast@0.0.3/dist/toast.mjs",
  },
  TOOLTIP: {
    dev: "./tooltip",
    prod: "https://unpkg.com/@red-elements/tooltip@0.0.6/dist/tooltip.mjs",
  },
};

export function getPackageImportURL(
  packageName: keyof typeof PACKAGES,
  configType?: "DEVELOPMENT" | "PRODUCTION"
) {
  if (configType === "PRODUCTION") {
    return PACKAGES[packageName].prod;
  }
  return PACKAGES[packageName].dev;
}
