import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as alertDialog from "./alert-dialog";

/**
 * React wrapper for alert-dialog-root
 *
 * Root component for an alert dialog. Always modal.
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
 */
export const AlertDialogTrigger = createComponent({
  tagName: "alert-dialog-trigger",
  elementClass: alertDialog.AlertDialogTrigger,
  react: React,
});

/**
 * React wrapper for alert-dialog-portal
 *
 * Portal component that moves its children to the body.
 *
 * @prop {string} container - Container element selector or "body" (default)
 * @prop {boolean} forceMount - Whether to force-mount regardless of open state
 */
export const AlertDialogPortal = createComponent({
  tagName: "alert-dialog-portal",
  elementClass: alertDialog.AlertDialogPortal,
  react: React,
});

/**
 * React wrapper for alert-dialog-overlay
 *
 * Overlay/backdrop that appears behind the alert dialog content.
 * Does NOT close on click (unlike regular dialog).
 *
 * @prop {boolean} forceMount - Whether to force-mount regardless of open state
 */
export const AlertDialogOverlay = createComponent({
  tagName: "alert-dialog-overlay",
  elementClass: alertDialog.AlertDialogOverlay,
  react: React,
});

/**
 * React wrapper for alert-dialog-content
 *
 * Main content container for the alert dialog.
 *
 * @prop {boolean} forceMount - Whether to force-mount regardless of open state
 */
export const AlertDialogContent = createComponent({
  tagName: "alert-dialog-content",
  elementClass: alertDialog.AlertDialogContent,
  react: React,
});

/**
 * React wrapper for alert-dialog-title
 *
 * Title element for the alert dialog.
 */
export const AlertDialogTitle = createComponent({
  tagName: "alert-dialog-title",
  elementClass: alertDialog.AlertDialogTitle,
  react: React,
});

/**
 * React wrapper for alert-dialog-description
 *
 * Description element for the alert dialog.
 */
export const AlertDialogDescription = createComponent({
  tagName: "alert-dialog-description",
  elementClass: alertDialog.AlertDialogDescription,
  react: React,
});

/**
 * React wrapper for alert-dialog-action
 *
 * Action button that confirms and closes the alert dialog.
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
  AlertDialogContentProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
} from "./types";
