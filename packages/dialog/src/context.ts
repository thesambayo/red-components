import { createContext } from "@lit/context";
import type { DialogRootContextValue } from "./types";

/**
 * Root context shared between all dialog components
 */
export const dialogRootContext =
  createContext<DialogRootContextValue>("dialog-root");

/** Shared across all packages so ids cannot collide. */
export { generateId } from "@red-elements/core";

/**
 * Event names. Namespaced as `{component}:{kebab-event}` so a bubbling
 * event cannot be mistaken for a native one by an ancestor listener.
 */
export const DIALOG_EVENTS = {
  OPEN_CHANGE: "dialog:open-change",
} as const;
