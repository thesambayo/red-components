import { createContext } from "@lit/context";

export const dropdownTags = {
  ROOT: "dropdown-root" as HTMLElement["localName"],
  TRIGGER: "dropdown-trigger" as HTMLElement["localName"],
  PORTAL: "dropdown-portal" as HTMLElement["localName"],
  CONTENT: "dropdown-content" as HTMLElement["localName"],
  ITEM: "dropdown-item" as HTMLElement["localName"],
};

export interface DropdownContext {
  isOpen: boolean;
  controlledState: boolean;
  trigger: HTMLElement | null;
  onOpen(eventName: string): void;
  onClose(eventName: string): void;
}

export const dropdownContext = createContext<DropdownContext, string>(
  "DROPDOWN"
);

export const DROPDOWN_EVENTS_NAME = {
  /**
   * Event fired when the dropdown is opened.
   */
  OPEN: "dropdown-open",
  /**
   * Event fired when the dropdown is closed.
   */
  CLOSE: "dropdown-close",
  /**
   * Event fired when an item is selected.
   */
  ITEM_SELECTED: "dropdown-item-selected",
  /**
   * Event fired when the dropdown state changes.
   */
  STATE_CHANGE: "dropdown-state-change",
};

export interface DropdownEventDetail {
  dropdownDataId?: string | null;
  open?: boolean;
}

export const createDropdownEvent = (
  eventName: keyof typeof DROPDOWN_EVENTS_NAME,
  options: CustomEventInit<DropdownEventDetail> = {}
  // can be this options: CustomEventInit = {},
  // then open, close will have each own interface
) => {
  return new CustomEvent(DROPDOWN_EVENTS_NAME[eventName], {
    bubbles: true,
    cancelable: true,
    composed: true,
    ...options,
  });
};

export type CustomDropdownEvent = ReturnType<typeof createDropdownEvent>;

export type DropdownEventRecord = Record<
  keyof typeof DROPDOWN_EVENTS_NAME,
  (details: DropdownEventDetail) => CustomDropdownEvent
>;

export const DROPDOWN_EVENTS_RECORD: DropdownEventRecord = {
  OPEN: (details: DropdownEventDetail) =>
    createDropdownEvent("OPEN", { detail: details }),
  CLOSE: (details: DropdownEventDetail) =>
    createDropdownEvent("CLOSE", { detail: details }),
  ITEM_SELECTED: (details: DropdownEventDetail) =>
    createDropdownEvent("ITEM_SELECTED", { detail: details }),
  STATE_CHANGE: (details: DropdownEventDetail) =>
    createDropdownEvent("STATE_CHANGE", { detail: details }),
};

export const DROPDOWN_ATTRIBUTES = {
  // The HTML attribute name used to store dropdown IDs
  DATA_ID_KEY: "data-dropdown-id" as const,
  PORTALLED_ID_KEY: "data-dropdown-portalled-id" as const,
  DATA_DIALOG_CLOSE: "data-dropdown-close" as const,
};
