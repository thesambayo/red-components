/**
 * Select Component - React Wrappers
 *
 * A native web component select/dropdown with form integration,
 * keyboard navigation, and accessibility support.
 *
 * @example
 * ```jsx
 * <SelectRoot name="country" defaultValue="us">
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select country..." />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="us">
 *       <SelectItemIndicator>✓</SelectItemIndicator>
 *       <SelectItemText>United States</SelectItemText>
 *     </SelectItem>
 *     <SelectItem value="uk">
 *       <SelectItemIndicator>✓</SelectItemIndicator>
 *       <SelectItemText>United Kingdom</SelectItemText>
 *     </SelectItem>
 *   </SelectContent>
 * </SelectRoot>
 * ```
 */

import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as select from "./select";
import { SELECT_EVENTS } from "./select-context";

export const SelectRoot = createComponent({
  tagName: "select-root",
  elementClass: select.SelectRoot,
  react: React,
  events: {
    onValueChange: SELECT_EVENTS.VALUE_CHANGE as EventName<CustomEvent>,
    onOpenChange: SELECT_EVENTS.OPEN_CHANGE as EventName<CustomEvent>,
    onOpen: SELECT_EVENTS.OPEN as EventName<CustomEvent>,
    onClose: SELECT_EVENTS.CLOSE as EventName<CustomEvent>,
  },
});

export const SelectTrigger = createComponent({
  tagName: "select-trigger",
  elementClass: select.SelectTrigger,
  react: React,
});

export const SelectValue = createComponent({
  tagName: "select-value",
  elementClass: select.SelectValue,
  react: React,
});

export const SelectContent = createComponent({
  tagName: "select-content",
  elementClass: select.SelectContent,
  react: React,
});

export const SelectItem = createComponent({
  tagName: "select-item",
  elementClass: select.SelectItem,
  react: React,
});

export const SelectItemText = createComponent({
  tagName: "select-item-text",
  elementClass: select.SelectItemText,
  react: React,
});

export const SelectItemIndicator = createComponent({
  tagName: "select-item-indicator",
  elementClass: select.SelectItemIndicator,
  react: React,
});

export const SelectGroup = createComponent({
  tagName: "select-group",
  elementClass: select.SelectGroup,
  react: React,
});

export const SelectLabel = createComponent({
  tagName: "select-label",
  elementClass: select.SelectLabel,
  react: React,
});

export const SelectSeparator = createComponent({
  tagName: "select-separator",
  elementClass: select.SelectSeparator,
  react: React,
});

export type {
  SelectContextValue,
  SelectItemData,
  SelectValueChangeEvent,
  SelectOpenChangeEvent,
  SelectOpenEvent,
  SelectCloseEvent,
} from "./types";

export { SELECT_EVENTS } from "./types";
