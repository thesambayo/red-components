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

/**
 * Generate unique IDs for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
