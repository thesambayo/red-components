import * as tooltip from "./tooltip";
import { createComponent, EventName } from "@lit/react";
import React from "react";

export const TooltipRoot = createComponent({
  tagName: "tooltip-root",
  elementClass: tooltip.TooltipRoot,
  react: React,
  events: {
    onOpenChange: "openChange" as EventName<CustomEvent<{ open: boolean }>>,
  },
});

export const TooltipTrigger = createComponent({
  tagName: "tooltip-trigger",
  elementClass: tooltip.TooltipTrigger,
  react: React,
});

export const TooltipContent = createComponent({
  tagName: "tooltip-content",
  elementClass: tooltip.TooltipContent,
  react: React,
});
