/**
 * Dropdown context and shared utilities
 */

import { generateId } from "@red-elements/core";

export function generateDropdownId(): string {
  return generateId("dropdown");
}

export const DROPDOWN_EVENTS = {
  OPEN: "dropdown:open",
  CLOSE: "dropdown:close",
  ITEM_SELECT: "dropdown:item-select",
} as const;

export interface DropdownOpenEvent extends CustomEvent<{ dropdownId: string }> {}
export interface DropdownCloseEvent extends CustomEvent<{ dropdownId: string }> {}
export interface DropdownItemSelectEvent extends CustomEvent<{ dropdownId: string; value?: string }> {}
