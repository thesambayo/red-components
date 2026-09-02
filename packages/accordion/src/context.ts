import { createContext } from "@lit/context";
import type { AccordionContextValue, AccordionItemContextValue } from "./types";

/**
 * Root accordion context - provides state and methods to all children
 */
export const accordionRootContext =
  createContext<AccordionContextValue>("accordion-root");

/**
 * Item context - provides item-specific data to trigger/content
 */
export const accordionItemContext =
  createContext<AccordionItemContextValue>("accordion-item");

/** Shared across all packages so ids cannot collide. */
export { generateId } from "@red-elements/core";

/**
 * Event names. Namespaced as `{component}:{kebab-event}` so a bubbling
 * event cannot be mistaken for a native one by an ancestor listener.
 */
export const ACCORDION_EVENTS = {
  VALUE_CHANGE: "accordion:value-change",
} as const;
