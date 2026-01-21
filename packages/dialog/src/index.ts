import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as dialog from "./dialog";

/**
 * React wrapper for dialog-root
 *
 * Root component for a dialog. Uses native `<dialog>` element under the hood.
 *
 * @prop {boolean} open - Controlled open state
 * @prop {boolean} defaultOpen - Default open state for uncontrolled mode
 * @prop {boolean} modal - Whether dialog is modal (default: true)
 *
 * @event onOpenChange - Emitted when open state changes
 */
export const DialogRoot = createComponent({
  tagName: "dialog-root",
  elementClass: dialog.DialogRoot,
  react: React,
  events: {
    onOpenChange: "openChange" as EventName<CustomEvent<{ open: boolean }>>,
  },
});

/**
 * React wrapper for dialog-trigger
 *
 * Trigger element that opens the dialog on click.
 *
 * @prop {boolean} asChild - Pass behavior to slotted child
 */
export const DialogTrigger = createComponent({
  tagName: "dialog-trigger",
  elementClass: dialog.DialogTrigger,
  react: React,
});

/**
 * React wrapper for dialog-close
 *
 * Close button that closes the dialog when clicked.
 *
 * @prop {boolean} asChild - Pass behavior to slotted child
 */
export const DialogClose = createComponent({
  tagName: "dialog-close",
  elementClass: dialog.DialogClose,
  react: React,
});

// Re-export types
export type {
  DialogState,
  DialogRootContextValue,
  DialogRootProps,
  DialogTriggerProps,
  DialogCloseProps,
} from "./types";
