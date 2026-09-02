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
  openOnFocus: boolean;
  openOnClick: boolean;

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
  /**
   * `source` lets the root reject an open it caused itself - see
   * `OpenSource`.
   */
  onOpen: (source?: OpenSource) => void;
  onClose: () => void;
  registerItem: (value: string, data: ComboboxItemData) => void;
  unregisterItem: (value: string) => void;
  /**
   * `source` lets the root ignore hover-driven highlights that were not caused
   * by the user actually moving the pointer - see `HighlightSource`.
   */
  setHighlightedValue: (value: string | undefined, source?: HighlightSource) => void;
}

/**
 * What moved the highlight.
 *
 * Keyboard navigation scrolls the highlighted item into view, which slides a
 * different item under a stationary cursor and fires `pointerenter` on it. If
 * that counted as a hover, the highlight would snap back to the cursor and the
 * list would fight the arrow keys. Pointer-sourced highlights are therefore
 * suppressed until the pointer genuinely moves again.
 */
export type HighlightSource = "keyboard" | "pointer";

/**
 * What asked the combobox to open.
 *
 * Only `"focus"` is treated specially: closing returns focus to the input, and
 * with `open-on-focus` that programmatic focus would immediately reopen what
 * was just closed. The root suppresses focus-sourced opens for the moment it
 * is restoring focus itself.
 */
export type OpenSource = "focus" | "click" | "keyboard";

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

/** Shared across all packages so ids cannot collide. */
export { generateId } from "@red-elements/core";
