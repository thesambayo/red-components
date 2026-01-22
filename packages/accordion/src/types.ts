/**
 * Accordion type - single allows one item open, multiple allows many
 */
export type AccordionType = "single" | "multiple";

/**
 * Reading direction for RTL/LTR support
 */
export type Direction = "ltr" | "rtl";

/**
 * Orientation affects keyboard navigation (arrows)
 */
export type Orientation = "horizontal" | "vertical";

/**
 * Data state for styling hooks
 */
export type DataState = "open" | "closed";

/**
 * Core accordion context shared between components
 */
export interface AccordionContextValue {
  /** Currently expanded item value(s) */
  value: string[];
  /** Single or multiple items can be open */
  type: AccordionType;
  /** Reading direction */
  direction: Direction;
  /** Layout orientation */
  orientation: Orientation;
  /** Whether accordion is disabled */
  disabled: boolean;
  /** Whether single type can collapse all items */
  collapsible: boolean;
  /** Toggle an item's expanded state */
  toggle: (itemValue: string) => void;
  /** Check if an item is expanded */
  isExpanded: (itemValue: string) => boolean;
}

/**
 * Item-level context for child components
 */
export interface AccordionItemContextValue {
  /** This item's value identifier */
  value: string;
  /** Whether this specific item is disabled */
  disabled: boolean;
  /** Unique ID for trigger element (for aria-labelledby) */
  triggerId: string;
  /** Unique ID for content element (for aria-controls) */
  contentId: string;
}
