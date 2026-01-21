import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as accordion from "./new-accordion";

/**
 * React wrapper for new-accordion-root
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
export const NewAccordionRoot = createComponent({
  tagName: "new-accordion-root",
  elementClass: accordion.NewAccordionRoot,
  react: React,
  events: {
    onChange: "change" as EventName<CustomEvent<string[]>>,
  },
});

/**
 * React wrapper for new-accordion-item
 *
 * @prop {string} value - Unique identifier for this item (required)
 * @prop {boolean} disabled - Whether this item is disabled
 */
export const NewAccordionItem = createComponent({
  tagName: "new-accordion-item",
  elementClass: accordion.NewAccordionItem,
  react: React,
});

/**
 * React wrapper for new-accordion-header
 *
 * Wraps the trigger for proper heading structure.
 */
export const NewAccordionHeader = createComponent({
  tagName: "new-accordion-header",
  elementClass: accordion.NewAccordionHeader,
  react: React,
});

/**
 * React wrapper for new-accordion-trigger
 *
 * Button that toggles the accordion item.
 */
export const NewAccordionTrigger = createComponent({
  tagName: "new-accordion-trigger",
  elementClass: accordion.NewAccordionTrigger,
  react: React,
});

/**
 * React wrapper for new-accordion-content
 *
 * Contains the collapsible content.
 */
export const NewAccordionContent = createComponent({
  tagName: "new-accordion-content",
  elementClass: accordion.NewAccordionContent,
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
