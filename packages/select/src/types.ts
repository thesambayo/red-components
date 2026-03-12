import { SelectContextValue, SelectItemData, SELECT_EVENTS } from "./select-context";

/**
 * Public types for select component
 */

export type { SelectContextValue, SelectItemData };

export { SELECT_EVENTS };

/**
 * Event detail types
 */
export interface SelectValueChangeEvent
  extends CustomEvent<{ value: string | string[] | undefined }> {}
export interface SelectOpenChangeEvent extends CustomEvent<{ open: boolean }> {}
export interface SelectOpenEvent extends CustomEvent {}
export interface SelectCloseEvent extends CustomEvent {}
