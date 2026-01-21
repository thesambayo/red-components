/**
 * Web Components exports for new-accordion
 *
 * Import this file to register all accordion custom elements:
 * ```js
 * import "@red-elements/new-accordion/dist/new-accordion.js";
 * ```
 *
 * Then use in HTML:
 * ```html
 * <new-accordion-root type="single" collapsible>
 *   <new-accordion-item value="item-1">
 *     <new-accordion-header>
 *       <new-accordion-trigger>Section 1</new-accordion-trigger>
 *     </new-accordion-header>
 *     <new-accordion-content>Content for section 1</new-accordion-content>
 *   </new-accordion-item>
 * </new-accordion-root>
 * ```
 */

export { NewAccordionRoot } from "./new-accordion-root";
export { NewAccordionItem } from "./new-accordion-item";
export { NewAccordionHeader } from "./new-accordion-header";
export { NewAccordionTrigger } from "./new-accordion-trigger";
export { NewAccordionContent } from "./new-accordion-content";

// Re-export types for consumers
export type {
  AccordionType,
  Direction,
  Orientation,
  DataState,
  AccordionContextValue,
  AccordionItemContextValue,
} from "./types";
