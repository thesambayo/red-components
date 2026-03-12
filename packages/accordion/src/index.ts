import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as accordion from "./accordion";

/**
 * React wrapper for accordion-root
 *
 * @prop {'single' | 'multiple'} type - Whether one or multiple items can be open
 * @prop {string[]} defaultValue - Initially expanded item value(s)
 * @prop {'ltr' | 'rtl'} dir - Reading direction
 * @prop {'horizontal' | 'vertical'} orientation - Layout orientation
 * @prop {boolean} disabled - Disable all items
 * @prop {boolean} collapsible - Allow collapsing all items in single mode
 *
 * @event onChange - Emitted when expanded items change
 */
export const AccordionRoot = createComponent({
  tagName: "accordion-root",
  elementClass: accordion.AccordionRoot,
  react: React,
  events: {
    onChange: "change" as EventName<CustomEvent<string[]>>,
  },
});

/**
 * React wrapper for accordion-item
 *
 * @prop {string} value - Unique identifier for this item (required)
 * @prop {boolean} disabled - Whether this item is disabled
 */
export const AccordionItem = createComponent({
  tagName: "accordion-item",
  elementClass: accordion.AccordionItem,
  react: React,
});

/**
 * React wrapper for accordion-header
 *
 * Wraps the trigger for proper heading structure.
 */
export const AccordionHeader = createComponent({
  tagName: "accordion-header",
  elementClass: accordion.AccordionHeader,
  react: React,
});

/**
 * React wrapper for accordion-trigger
 *
 * Button that toggles the accordion item.
 */
export const AccordionTrigger = createComponent({
  tagName: "accordion-trigger",
  elementClass: accordion.AccordionTrigger,
  react: React,
});

/**
 * React wrapper for accordion-content
 *
 * Contains the collapsible content.
 */
export const AccordionContent = createComponent({
  tagName: "accordion-content",
  elementClass: accordion.AccordionContent,
  react: React,
});

// Re-export types
export type {
  AccordionType,
  Direction,
  Orientation,
  DataState,
  AccordionContextValue,
  AccordionItemContextValue,
} from "./types";
