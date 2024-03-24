import {createContext} from "@lit/context";

export const DEFAULT_DELAY_DURATION = 500;
export const tooltipTags = {
    ROOT: "tooltip-root" as HTMLElement['localName'],
    TRIGGER: "tooltip-trigger" as HTMLElement['localName'],
    CONTENT: "tooltip-content" as HTMLElement['localName'],
}

export interface TooltipContext {
    open: boolean;
    delayDuration: number;
}

export const tooltipContext = createContext<TooltipContext>("Tooltip");

export interface TooltipRootProps {
    open: boolean;
    "default-open": boolean;
    onOpenChange?: () => void;
}

export interface TooltipTriggerProps {
    // aria attributes
    id: string;
    "aria-description": string;
}

export interface TooltipContentProps {
    side: "top" | "right" | "bottom" | "left";
    "side-offset": number;
    align: "start" | "end" | "center";
    "align-offset": number;

    // data attributes
    "data-state": "closed" | "open";
    "data-side": "left" | "right" | "bottom" | "top";
    "data-align": "start" | "end" | "center";

    // aria attributes
    id: string;
    "aria-describedby": string;

}