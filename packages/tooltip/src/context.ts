import { createContext } from "@lit/context";
import type {
  TooltipProviderContextValue,
  TooltipRootContextValue,
} from "./types";

/**
 * Provider context for multi-tooltip coordination
 * Optional - tooltips work without a provider
 */
export const tooltipProviderContext =
  createContext<TooltipProviderContextValue>("tooltip-provider");

/**
 * Root context shared between trigger and content
 */
export const tooltipRootContext =
  createContext<TooltipRootContextValue>("tooltip-root");

/**
 * Generate unique IDs for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/**
 * Default provider context values (used when no provider exists)
 */
export const defaultProviderContext: TooltipProviderContextValue = {
  isOpenDelayed: true,
  delayDuration: 500,
  skipDelayDuration: 300,
  onOpen: () => {},
  onClose: () => {},
};
