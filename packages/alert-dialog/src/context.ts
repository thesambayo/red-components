import { createContext } from "@lit/context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Root context shared between all alert dialog components
 */
export const alertDialogRootContext =
  createContext<AlertDialogRootContextValue>("alert-dialog-root");

/**
 * Generate unique IDs for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
