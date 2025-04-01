import { createContext } from "@lit/context";

export const dropdownTags = {
  ROOT: "dropdown-root" as HTMLElement["localName"],
  TRIGGER: "dropdown-trigger" as HTMLElement["localName"],
  CONTENT: "dropdown-content" as HTMLElement["localName"],
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
