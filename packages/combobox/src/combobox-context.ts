export interface ComboboxContextValue {
  // State
  selectedValue: string | string[] | undefined;
  searchTerm: string;
  isOpen: boolean;
  filteredItems: Set<string>;
  highlightedValue: string | undefined;

  // Configuration
  multiple: boolean;
  disabled: boolean;
  filterMode: "client" | "manual";

  // IDs for accessibility
  inputId: string;
  contentId: string;

  // References
  inputElement: HTMLInputElement | null;
  contentElement: HTMLElement | null;
  anchorElement: HTMLElement | null;
  triggerElement: HTMLElement | null;

  // Item management
  items: Map<string, ComboboxItemData>;

  // Methods
  onInputChange: (value: string) => void;
  onSelect: (value: string) => void;
  onDeselect: (value: string) => void;
  onOpen: () => void;
  onClose: () => void;
  registerItem: (value: string, data: ComboboxItemData) => void;
  unregisterItem: (value: string) => void;
  setHighlightedValue: (value: string | undefined) => void;
}

export interface ComboboxItemData {
  value: string;
  textContent: string;
  disabled: boolean;
  element: HTMLElement;
}

export const COMBOBOX_EVENTS = {
  VALUE_CHANGE: "combobox:value-change",
  SEARCH_CHANGE: "combobox:search-change",
  OPEN: "combobox:open",
  CLOSE: "combobox:close",
} as const;

let idCounter = 0;
export function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}
