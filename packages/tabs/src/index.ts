import React from "react";
import * as tabs from "./tabs";
import {createComponent} from "@lit/react";


export const TabsRoot = createComponent({
    tagName: "tabs-root",
    elementClass: tabs.TabsRoot,
    react: React,
});

export const TabsList = createComponent({
    tagName: "tabs-list",
    elementClass: tabs.TabsList,
    react: React,
});

export const TabTrigger = createComponent({
    tagName: "tab-trigger",
    elementClass: tabs.TabTrigger,
    react: React,
});

export const TabContent = createComponent({
    tagName: "tab-content",
    elementClass: tabs.TabContent,
    react: React,
});
