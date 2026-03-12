import { createContext } from "@lit/context";
import type { DialogRootContextValue } from "./types";

/**
 * Root context shared between all dialog components
 */
export const dialogRootContext =
  createContext<DialogRootContextValue>("dialog-root");

/**
 * Generate unique IDs for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
