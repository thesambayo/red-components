import { createContext } from "@lit/context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Root context shared between all alert dialog components
 */
export const alertDialogRootContext =
  createContext<AlertDialogRootContextValue>("alert-dialog-root");

/** Shared across all packages so ids cannot collide. */
export { generateId } from "@red-elements/core";

/**
 * Event names. Namespaced as `{component}:{kebab-event}` so a bubbling
 * event cannot be mistaken for a native one by an ancestor listener.
 */
export const ALERT_DIALOG_EVENTS = {
  OPEN_CHANGE: "alert-dialog:open-change",
} as const;
