import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as combobox from "./combobox";
import { COMBOBOX_EVENTS } from "./combobox-context";

export const ComboboxRoot = createComponent({
  tagName: "combobox-root",
  elementClass: combobox.ComboboxRoot,
  react: React,
  events: {
    onValueChange: COMBOBOX_EVENTS.VALUE_CHANGE as EventName<CustomEvent>,
    onSearchChange: COMBOBOX_EVENTS.SEARCH_CHANGE as EventName<CustomEvent>,
    onOpen: COMBOBOX_EVENTS.OPEN as EventName<CustomEvent>,
    onClose: COMBOBOX_EVENTS.CLOSE as EventName<CustomEvent>,
  },
});

export const ComboboxAnchor = createComponent({
  tagName: "combobox-anchor",
  elementClass: combobox.ComboboxAnchor,
  react: React,
});

export const ComboboxTrigger = createComponent({
  tagName: "combobox-trigger",
  elementClass: combobox.ComboboxTrigger,
  react: React,
});

export const ComboboxInput = createComponent({
  tagName: "combobox-input",
  elementClass: combobox.ComboboxInput,
  react: React,
});

export const ComboboxContent = createComponent({
  tagName: "combobox-content",
  elementClass: combobox.ComboboxContent,
  react: React,
});

export const ComboboxItem = createComponent({
  tagName: "combobox-item",
  elementClass: combobox.ComboboxItem,
  react: React,
});

export const ComboboxEmpty = createComponent({
  tagName: "combobox-empty",
  elementClass: combobox.ComboboxEmpty,
  react: React,
});
