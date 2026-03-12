import { createContext } from "@lit/context";

/**
 * Context value provided by select-root
 */
export interface SelectContextValue {
  // State
  selectedValue?: string | string[];
  isOpen: boolean;
  multiple: boolean;
  disabled: boolean;

  // IDs for accessibility
  triggerId: string;
  contentId: string;
  valueId: string;

  // References
  triggerElement: HTMLElement | null;
  contentElement: HTMLElement | null;
  valueElement: HTMLElement | null;

  // Items management
  items: Map<string, SelectItemData>;

  // Methods
  onSelect: (value: string) => void;
  onDeselect: (value: string) => void;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
  registerItem: (value: string, data: SelectItemData) => void;
  unregisterItem: (value: string) => void;
  setHighlightedValue: (value: string | undefined) => void;
  highlightedValue?: string;
}

/**
 * Data structure for registered items
 */
export interface SelectItemData {
  value: string;
  textContent: string;
  disabled: boolean;
  element: HTMLElement;
}

/**
 * Context for select-root
 */
export const selectRootContext = createContext<SelectContextValue>("select-root");

/**
 * Event names for select component
 */
export const SELECT_EVENTS = {
  VALUE_CHANGE: "select:value-change",
  OPEN_CHANGE: "select:open-change",
  OPEN: "select:open",
  CLOSE: "select:close",
} as const;

/**
 * Generate unique ID
 */
let nextId = 0;
export function generateId(prefix: string): string {
  return `${prefix}-${++nextId}`;
}
