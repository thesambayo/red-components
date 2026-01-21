/**
 * Side where tooltip appears relative to trigger
 */
export type TooltipSide = "top" | "right" | "bottom" | "left";

/**
 * Alignment of tooltip relative to trigger
 */
export type TooltipAlign = "start" | "center" | "end";

/**
 * State for styling hooks - includes delayed-open for animation control
 */
export type TooltipState = "closed" | "delayed-open" | "instant-open";

/**
 * Provider context for multi-tooltip coordination
 */
export interface TooltipProviderContextValue {
  /** Whether delay should be skipped (recent tooltip was open) */
  isOpenDelayed: boolean;
  /** Default delay duration in ms */
  delayDuration: number;
  /** Duration to keep skip-delay active after close */
  skipDelayDuration: number;
  /** Called when any tooltip opens */
  onOpen: () => void;
  /** Called when any tooltip closes */
  onClose: () => void;
}

/**
 * Root context shared with trigger and content
 */
export interface TooltipRootContextValue {
  /** Current open state */
  open: boolean;
  /** State attribute for styling (includes delay info) */
  stateAttribute: TooltipState;
  /** Unique ID for content (for aria-describedby) */
  contentId: string;
  /** Reference to trigger element */
  trigger: HTMLElement | null;
  /** Delay duration for this tooltip */
  delayDuration: number;
  /** Whether hovering content keeps tooltip open */
  disableHoverableContent: boolean;
  /** Open the tooltip */
  onOpen: (instant?: boolean) => void;
  /** Close the tooltip */
  onClose: () => void;
  /** Called when trigger element mounts */
  onTriggerMount: (el: HTMLElement) => void;
  /** Called when trigger element unmounts */
  onTriggerUnmount: () => void;
}

/**
 * Props for TooltipProvider
 */
export interface TooltipProviderProps {
  /** Default delay for all tooltips (default: 500) */
  delayDuration?: number;
  /** How long to skip delay after a tooltip closes (default: 300) */
  skipDelayDuration?: number;
}

/**
 * Props for TooltipRoot
 */
export interface TooltipRootProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Delay before opening (overrides provider) */
  delayDuration?: number;
  /** Close immediately when leaving trigger (no hoverable content) */
  disableHoverableContent?: boolean;
}

/**
 * Props for TooltipContent
 */
export interface TooltipContentProps {
  /** Which side of trigger to appear on */
  side?: TooltipSide;
  /** Distance from trigger in pixels */
  sideOffset?: number;
  /** Alignment along the side */
  align?: TooltipAlign;
  /** Offset along alignment axis */
  alignOffset?: number;
  /** Enable collision detection */
  avoidCollisions?: boolean;
  /** Padding from viewport edges */
  collisionPadding?: number;
  /** Custom aria-label (overrides content text) */
  ariaLabel?: string;
}

/**
 * Props for TooltipArrow
 */
export interface TooltipArrowProps {
  /** Width of arrow in pixels */
  width?: number;
  /** Height of arrow in pixels */
  height?: number;
}
