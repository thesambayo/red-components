import { createContext } from "@lit/context";

export const DEFAULT_DELAY_DURATION = 500; // 0.5s
export const DEFAULT_SKIP_DELAY_DURATION = 10000; // 10 seconds
export const dropdownTags = {
  ROOT: "dropdown-root" as HTMLElement["localName"],
  TRIGGER: "dropdown-trigger" as HTMLElement["localName"],
  CONTENT: "dropdown-content" as HTMLElement["localName"],
};

export interface DropdownContext {
  open: boolean;
  delayDuration: number;
  skipDelayDuration: number;
  controlledState: boolean;
  trigger: HTMLElement | null;
  onOpen(eventName: string): void;
  onclose(eventName: string): void;
}

export const dropdownContext = createContext<DropdownContext, string>(
  "DROPDOWN"
);
