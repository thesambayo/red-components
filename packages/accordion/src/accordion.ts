export * from "./accordion-root";
export * from "./accordion-item";
export * from "./accordion-trigger";
export * from "./accordion-content";

/**
 * AccordionRoot props
 * dir 'rtl' | 'ltr'
 * orientation 'horizontal' | 'vertical'
 * type 'single' | 'multiple'
 * defaultValue string | string[]
 * value string | string[]
 *
 * AccordionRoot event
 * (change) => string | string[]
 */

/**
 * AccordionItem props
 * disabled boolean
 * value string
 *
 * aria attributes
 * aria-level number ?
 * aria-expanded boolean
 *
 * data attributes
 * [data-state] 'open' | 'closed'
 * [data-disabled] boolean
 */

/**
 * AccordionTrigger props
 *
 * data attributes
 * [data-state] 'open' | 'closed'
 * [data-disabled] boolean
 */

/**
 * AccordionContent props
 *
 * data attributes
 * hidden boolean
 * [data-state] 'open' | 'closed'
 * [data-disabled] boolean
 */
