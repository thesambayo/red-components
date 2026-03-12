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
 * Global tooltip configuration
 */
interface TooltipGlobalConfig {
  delayDuration: number;
  skipDelayDuration: number;
}

/**
 * Internal global configuration state
 */
let globalConfig: TooltipGlobalConfig = {
  delayDuration: 500,
  skipDelayDuration: 300,
};

/**
 * Configure global tooltip defaults
 * Call this once at app startup to set defaults for all tooltips
 *
 * @example
 * ```ts
 * import { configureTooltips } from '@red-elements/tooltip';
 *
 * configureTooltips({
 *   delayDuration: 700,
 *   skipDelayDuration: 400
 * });
 * ```
 */
export function configureTooltips(config: Partial<TooltipGlobalConfig>): void {
  if (config.delayDuration !== undefined) {
    globalConfig.delayDuration = config.delayDuration;
  }
  if (config.skipDelayDuration !== undefined) {
    globalConfig.skipDelayDuration = config.skipDelayDuration;
  }
}

/**
 * Get current global tooltip configuration
 */
export function getTooltipConfig(): Readonly<TooltipGlobalConfig> {
  return { ...globalConfig };
}

/**
 * Default provider context values (used when no provider exists)
 * Uses global configuration set via configureTooltips()
 */
export const defaultProviderContext: TooltipProviderContextValue = {
  get isOpenDelayed() {
    return true;
  },
  get delayDuration() {
    return globalConfig.delayDuration;
  },
  get skipDelayDuration() {
    return globalConfig.skipDelayDuration;
  },
  onOpen: () => {},
  onClose: () => {},
};
