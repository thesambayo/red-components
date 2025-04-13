import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as dropdown from "./dropdown";
import { CustomDropdownEvent, DROPDOWN_EVENTS_NAME } from "./dropdown.context";

export const DropdownRoot = createComponent({
  tagName: "dropdown-root",
  elementClass: dropdown.DropdownRoot,
  react: React,
  events: {
    onDropdownStateChange:
      DROPDOWN_EVENTS_NAME.STATE_CHANGE as EventName<CustomDropdownEvent>,
  },
});

export const DropdownTrigger = createComponent({
  tagName: "dropdown-trigger",
  elementClass: dropdown.DropdownTrigger,
  react: React,
});

export const DropdownPortal = createComponent({
  tagName: "dropdown-portal",
  elementClass: dropdown.DropdownPortal,
  react: React,
});

export const DropdownContent = createComponent({
  tagName: "dropdown-content",
  elementClass: dropdown.DropdownContent,
  react: React,
});

export const DropdownItem = createComponent({
  tagName: "dropdown-item",
  elementClass: dropdown.DropdownItem,
  react: React,
  events: {
    onSelect: DROPDOWN_EVENTS_NAME.ITEM_SELECTED as EventName<
      CustomEvent<{ itemId: string }>
    >,
  },
});

export const DropdownLabel = createComponent({
  tagName: "dropdown-label",
  elementClass: dropdown.DropdownLabel,
  react: React,
});

export const DropdownSeparator = createComponent({
  tagName: "dropdown-separator",
  elementClass: dropdown.DropdownSeparator,
  react: React,
});
