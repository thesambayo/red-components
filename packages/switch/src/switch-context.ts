import { createContext } from "@lit/context";

export interface SwitchContext {
  checked: boolean;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
}

export const switchContext = createContext<SwitchContext>("switch");

/**
 * Event names. Namespaced as `{component}:{kebab-event}` so a bubbling
 * event cannot be mistaken for a native one by an ancestor listener.
 */
export const SWITCH_EVENTS = {
  CHECKED_CHANGE: "switch:checked-change",
} as const;
