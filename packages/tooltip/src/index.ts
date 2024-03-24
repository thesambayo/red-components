import * as tooltip from "./tooltip";
import {createComponent} from "@lit/react";
import React from "react";

export const TooltipRoot = createComponent({
    tagName: 'tooltip-root',
    elementClass: tooltip.TooltipRoot,
    react: React,
});

export const TooltipTrigger = createComponent({
    tagName: 'tooltip-trigger',
    elementClass: tooltip.TooltipTrigger,
    react: React,
});

export const TooltipContent = createComponent({
    tagName: 'tooltip-content',
    elementClass: tooltip.TooltipContent,
    react: React,
});