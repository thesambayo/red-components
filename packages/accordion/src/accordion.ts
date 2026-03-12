/**
 * Web Components exports for accordion
 *
 * Import this file to register all accordion custom elements:
 * ```js
 * import "@red-elements/accordion/dist/accordion.js";
 * ```
 *
 * Then use in HTML:
 * ```html
 * <accordion-root type="single" collapsible>
 *   <accordion-item value="item-1">
 *     <accordion-header>
 *       <accordion-trigger>Section 1</accordion-trigger>
 *     </accordion-header>
 *     <accordion-content>Content for section 1</accordion-content>
 *   </accordion-item>
 * </accordion-root>
 * ```
 */

export { AccordionRoot } from "./accordion-root";
export { AccordionItem } from "./accordion-item";
export { AccordionHeader } from "./accordion-header";
export { AccordionTrigger } from "./accordion-trigger";
export { AccordionContent } from "./accordion-content";

// Re-export types for consumers
export type {
  AccordionType,
  Direction,
  Orientation,
  DataState,
  AccordionContextValue,
  AccordionItemContextValue,
} from "./types";
