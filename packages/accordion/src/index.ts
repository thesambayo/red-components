import React from 'react';
import {createComponent, EventName} from '@lit/react';
import * as accordion from "./accordion";


/**
 * @name AccordionRoot
 * @summary root container for accordions.
 * @documentation https://web-components-lib.vercel.app/?path=/docs/accordion-accordion--docs
 * @status unstable
 * @since 0.0.0
 *
 *
 * @prop {'single' | 'multiple'} type - Determines if multiple items can be open at the same time.
 * @prop {string[]} default-value - primitives item values to be display on default
 *
 *
 * @event {CustomEvent<string[]>} onchange - Emitted when opened primitives items are updated.
 */
export const AccordionRoot = createComponent({
    tagName: 'accordion-root',
    elementClass: accordion.AccordionRoot,
    react: React,
    events: {
        onchange: "change" as EventName<CustomEvent<string[]>>,
    },
});

/**
 * @name AccordionItem
 * @status unstable
 * @since 0.0.0
 *
 * @prop {string} value - value that identifies primitives item
 */
export const AccordionItem = createComponent({
    tagName: 'accordion-item',
    elementClass: accordion.AccordionItem,
    react: React,
});

/**
 * @name AccordionTrigger
 * @summary trigger element to open primitives item.
 * @status unstable
 * @since 0.0.0
 */
export const AccordionTrigger = createComponent({
    tagName: 'accordion-trigger',
    elementClass: accordion.AccordionTrigger,
    react: React,
});

/**
 * @name AccordionContent
 * @summary element that contains content of primitives item.
 * @status unstable
 * @since 0.0.0
 */
export const AccordionContent = createComponent({
    tagName: 'accordion-content',
    elementClass: accordion.AccordionContent,
    react: React,
});