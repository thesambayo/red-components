import {createContext} from "@lit/context";

export const DEFAULT_DELAY_DURATION = 550;
export const tooltipTags = {
    ROOT: "tooltip-root" as HTMLElement['localName'],
    TRIGGER: "tooltip-trigger" as HTMLElement['localName'],
    CONTENT: "tooltip-content" as HTMLElement['localName'],
}

export interface TooltipContext {
    open: boolean;
    delayDuration: number;
    controlledState: boolean;
    trigger: HTMLElement | null;
    onOpen(eventName: string): void;
    onclose(eventName: string): void;
}

export const tooltipContext = createContext<TooltipContext, string>("TOOLTIP");
