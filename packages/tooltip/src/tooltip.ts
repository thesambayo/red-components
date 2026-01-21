/**
 * Tooltip Web Components
 *
 * @example
 * ```html
 * <tooltip-root>
 *   <tooltip-trigger>
 *     <button>Hover me</button>
 *   </tooltip-trigger>
 *   <tooltip-content side="top" side-offset="8">
 *     <tooltip-arrow></tooltip-arrow>
 *     Helpful tooltip text
 *   </tooltip-content>
 * </tooltip-root>
 * ```
 */

export { TooltipProvider } from "./tooltip-provider";
export { TooltipRoot } from "./tooltip-root";
export { TooltipTrigger } from "./tooltip-trigger";
export { TooltipContent } from "./tooltip-content";
export { TooltipArrow } from "./tooltip-arrow";

// Re-export types
export type {
  TooltipSide,
  TooltipAlign,
  TooltipState,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipProviderContextValue,
  TooltipRootContextValue,
} from "./types";
