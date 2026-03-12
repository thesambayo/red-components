/**
 * Dropdown context and shared utilities
 */

let idCounter = 0;

export function generateDropdownId(): string {
  return `dropdown-${++idCounter}`;
}

export const DROPDOWN_EVENTS = {
  OPEN: "dropdown:open",
  CLOSE: "dropdown:close",
  ITEM_SELECT: "dropdown:item-select",
} as const;

export interface DropdownOpenEvent extends CustomEvent<{ dropdownId: string }> {}
export interface DropdownCloseEvent extends CustomEvent<{ dropdownId: string }> {}
export interface DropdownItemSelectEvent extends CustomEvent<{ dropdownId: string; value?: string }> {}
