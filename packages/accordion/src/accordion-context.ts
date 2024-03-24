import {createContext} from "@lit/context";

export const accordionTags = {
    ROOT: "accordion-root" as HTMLElement['localName'],
    ITEM: "accordion-item" as HTMLElement['localName'],
    TRIGGER: "accordion-trigger" as HTMLElement['localName'],
    CONTENT: "accordion-content" as HTMLElement['localName'],
}

export interface AccordionContext {
    /** The value for the open accordions */
    value: string[];
    type: 'single' | 'multiple';
    /**
     * The orientation the primitives items are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * @defaultValue horizontal
     */
    orientation: "horizontal" | "vertical";
    /**
     * The direction of navigation between trigger items.
     * @defaultValue ltr
     */
    direction: "ltr" | "rtl";
}

export const accordionContext = createContext<AccordionContext>("Accordion");

export interface AccordionProps extends AccordionContext {
    change?: () => void;
}