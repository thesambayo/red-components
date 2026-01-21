import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as tooltip from "./tooltip";

/**
 * React wrapper for tooltip-provider
 *
 * Optional provider for coordinating multiple tooltips.
 * When used, tooltips that open shortly after another closes will skip the delay.
 *
 * @prop {number} delayDuration - Default delay for all tooltips (default: 500)
 * @prop {number} skipDelayDuration - How long to skip delay after close (default: 300)
 */
export const TooltipProvider = createComponent({
  tagName: "tooltip-provider",
  elementClass: tooltip.TooltipProvider,
  react: React,
});

/**
 * React wrapper for tooltip-root
 *
 * Root component for a tooltip. Manages open/close state and timing.
 *
 * @prop {boolean} open - Controlled open state
 * @prop {boolean} defaultOpen - Default open state for uncontrolled mode
 * @prop {number} delayDuration - Delay before showing (overrides provider)
 * @prop {boolean} disableHoverableContent - Close immediately when leaving trigger
 *
 * @event onOpenChange - Emitted when open state changes
 */
export const TooltipRoot = createComponent({
  tagName: "tooltip-root",
  elementClass: tooltip.TooltipRoot,
  react: React,
  events: {
    onOpenChange: "openChange" as EventName<CustomEvent<{ open: boolean }>>,
  },
});

/**
 * React wrapper for tooltip-trigger
 *
 * Trigger element that shows/hides the tooltip on interaction.
 */
export const TooltipTrigger = createComponent({
  tagName: "tooltip-trigger",
  elementClass: tooltip.TooltipTrigger,
  react: React,
});

/**
 * React wrapper for tooltip-content
 *
 * The content that appears when the tooltip is open.
 *
 * @prop {'top' | 'right' | 'bottom' | 'left'} side - Which side to display on
 * @prop {number} sideOffset - Distance from trigger in pixels
 * @prop {'start' | 'center' | 'end'} align - Alignment along the side
 * @prop {number} alignOffset - Offset along alignment axis
 * @prop {boolean} avoidCollisions - Enable collision detection
 * @prop {number} collisionPadding - Padding from viewport edges
 */
export const TooltipContent = createComponent({
  tagName: "tooltip-content",
  elementClass: tooltip.TooltipContent,
  react: React,
});

/**
 * React wrapper for tooltip-arrow
 *
 * Optional arrow element that points to the trigger.
 *
 * @prop {number} width - Width of arrow in pixels
 * @prop {number} height - Height of arrow in pixels
 */
export const TooltipArrow = createComponent({
  tagName: "tooltip-arrow",
  elementClass: tooltip.TooltipArrow,
  react: React,
});

// Re-export types
export type {
  TooltipSide,
  TooltipAlign,
  TooltipState,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "./types";
