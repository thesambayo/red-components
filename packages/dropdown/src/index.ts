import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as dropdown from "./dropdown";

export const DropdownRoot = createComponent({
  tagName: "dropdown-root",
  elementClass: dropdown.DropdownRoot,
  react: React,
  events: {
    onOpenChange: "openChange" as EventName<CustomEvent<{ open: boolean }>>,
  },
});

export const DropdownTrigger = createComponent({
  tagName: "dropdown-trigger",
  elementClass: dropdown.DropdownTrigger,
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
    onSelect: "onSelect" as EventName<CustomEvent<{ itemId: string }>>,
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
