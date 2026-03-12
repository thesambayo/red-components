import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as alertDialog from "./alert-dialog";

/**
 * React wrapper for alert-dialog-root
 *
 * Root component for an alert dialog. Uses native `<dialog>` element under the hood.
 * Always modal, cannot be dismissed by clicking backdrop or pressing Escape.
 *
 * @prop {boolean} open - Controlled open state
 * @prop {boolean} defaultOpen - Default open state for uncontrolled mode
 *
 * @event onOpenChange - Emitted when open state changes
 */
export const AlertDialogRoot = createComponent({
  tagName: "alert-dialog-root",
  elementClass: alertDialog.AlertDialogRoot,
  react: React,
  events: {
    onOpenChange: "openChange" as EventName<CustomEvent<{ open: boolean }>>,
  },
});

/**
 * React wrapper for alert-dialog-trigger
 *
 * Trigger element that opens the alert dialog on click.
 *
 * @prop {boolean} asChild - Pass behavior to slotted child
 */
export const AlertDialogTrigger = createComponent({
  tagName: "alert-dialog-trigger",
  elementClass: alertDialog.AlertDialogTrigger,
  react: React,
});

/**
 * React wrapper for alert-dialog-action
 *
 * Action button that confirms and closes the alert dialog.
 *
 * @prop {boolean} asChild - Pass behavior to slotted child
 */
export const AlertDialogAction = createComponent({
  tagName: "alert-dialog-action",
  elementClass: alertDialog.AlertDialogAction,
  react: React,
});

/**
 * React wrapper for alert-dialog-cancel
 *
 * Cancel button that dismisses the alert dialog.
 * Receives auto-focus when the dialog opens.
 *
 * @prop {boolean} asChild - Pass behavior to slotted child
 */
export const AlertDialogCancel = createComponent({
  tagName: "alert-dialog-cancel",
  elementClass: alertDialog.AlertDialogCancel,
  react: React,
});

// Re-export types
export type {
  AlertDialogState,
  AlertDialogRootContextValue,
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from "./types";
