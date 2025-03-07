import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as dropdown from "./dropdown";

export const Dropdown = createComponent({
  tagName: "dropdown",
  elementClass: dropdown.Dropdown,
  react: React,
  // events: {
  //   onOpenChange: "openChange" as EventName<CustomEvent<{ open: boolean }>>,
  // },
});

// export const DropdownTrigger = createComponent({
//   tagName: "dropdown-trigger",
//   elementClass: dropdown.DropdownTrigger,
//   react: React,
// });

// export const DropdownContent = createComponent({
//   tagName: "dropdown-content",
//   elementClass: dropdown.DropdownContent,
//   react: React,
// });
