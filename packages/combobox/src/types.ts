import { ComboboxContextValue, ComboboxItemData, COMBOBOX_EVENTS } from "./combobox-context";

/**
 * Public types for combobox component
 */

export type { ComboboxContextValue, ComboboxItemData };

export { COMBOBOX_EVENTS };

/**
 * Event detail types
 */
export interface ComboboxValueChangeEvent extends CustomEvent<{ value: string | string[] | undefined }> {}
export interface ComboboxSearchChangeEvent extends CustomEvent<{ searchTerm: string }> {}
export interface ComboboxOpenEvent extends CustomEvent {}
export interface ComboboxCloseEvent extends CustomEvent {}
