import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as dialog from "./dialog";
import { CustomDialogEvent } from "./dialog.context";

export const DialogRoot = createComponent({
  tagName: "dialog-root",
  elementClass: dialog.DialogRoot,
  react: React,
  events: {
    onDialogStateChange: "dialog-state-change" as EventName<CustomDialogEvent>,
  },
});

export const DialogTrigger = createComponent({
  tagName: "dialog-trigger",
  elementClass: dialog.DialogTrigger,
  react: React,
});

export const DialogPortal = createComponent({
  tagName: "dialog-portal",
  elementClass: dialog.DialogPortal,
  react: React,
});

export const DialogOverlay = createComponent({
  tagName: "dialog-overlay",
  elementClass: dialog.DialogOverlay,
  react: React,
});

export const DialogContent = createComponent({
  tagName: "dialog-content",
  elementClass: dialog.DialogContent,
  react: React,
});

export const DialogClose = createComponent({
  tagName: "dialog-close",
  elementClass: dialog.DialogClose,
  react: React,
});
