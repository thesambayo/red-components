import { createContext } from "@lit/context";

export interface SwitchContext {
  checked: boolean;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
}

export const switchContext = createContext<SwitchContext>("switch");
