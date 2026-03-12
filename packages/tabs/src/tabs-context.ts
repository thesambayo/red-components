import {createContext} from "@lit/context";

export const tabsTags = {
    ROOT: "tabs-root" as HTMLElement['localName'],
    LIST: "tabs-list" as HTMLElement['localName'],
    TRIGGER: "tab-trigger" as HTMLElement['localName'],
    CONTENT: "tab-content" as HTMLElement['localName'],
}

export type ActivationMode = "automatic" | "manual";
export type Orientation = "horizontal" | "vertical";
export type Direction = "ltr" | "rtl";

export interface TabsContextValue {
    // State
    /** The value for the selected tab, if controlled */
    value?: string;
    /** boolean to notify selected tab to grab focus */
    shouldFocus: boolean;
    /**
     * The orientation the tabs are laid out.
     * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
     * @defaultValue horizontal
     */
    orientation: Orientation;
    /**
     * The direction of navigation between trigger items.
     * @defaultValue ltr
     */
    direction: Direction;
    /**
     * Whether tabs are activated automatically on focus or manually on click
     * @defaultValue automatic
     */
    activationMode: ActivationMode;
    /**
     * Whether keyboard navigation should loop from last to first item
     * @defaultValue false
     */
    loop: boolean;
    /**
     * Whether to unmount tab content when hidden
     * @defaultValue false
     */
    unmountOnHide: boolean;

    // Methods (following accordion pattern)
    changeValue: (value: string) => void;
    registerContent: (value: string) => void;
    unregisterContent: (value: string) => void;
    isContentRegistered: (value: string) => boolean;
}

// Add ID generation
let idCounter = 0;
export function generateId(prefix: string): string {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
}

export const tabsRootContext = createContext<TabsContextValue>("tabs-root");

// Legacy export for backward compatibility
export type TabContext = TabsContextValue;
export const tabsContext = tabsRootContext;