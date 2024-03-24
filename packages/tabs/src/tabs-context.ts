import {createContext} from "@lit/context";

export const tabsTags = {
    ROOT: "tabs-root" as HTMLElement['localName'],
    LIST: "tabs-list" as HTMLElement['localName'],
    TRIGGER: "tab-trigger" as HTMLElement['localName'],
    CONTENT: "tab-content" as HTMLElement['localName'],
}

export interface TabContext {
    /** The value for the selected tab, if controlled */
    value?: string;
    /** boolean to notify selected tab to grab focus */
    shouldFocus: boolean;
    /**
     * The orientation the tabs are laid out.
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

export const tabsContext = createContext<TabContext>("tabs");