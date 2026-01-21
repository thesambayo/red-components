import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as dialog from "./dialog";

/**
 * React wrapper for dialog-root
 *
 * Root component for a dialog. Manages open/close state and provides context.
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
 */
export const DialogTrigger = createComponent({
  tagName: "dialog-trigger",
  elementClass: dialog.DialogTrigger,
  react: React,
});

/**
 * React wrapper for dialog-portal
 *
 * Portal component that moves its children to the body.
 *
 * @prop {string} container - Container element selector or "body" (default)
 * @prop {boolean} forceMount - Whether to force-mount regardless of open state
 */
export const DialogPortal = createComponent({
  tagName: "dialog-portal",
  elementClass: dialog.DialogPortal,
  react: React,
});

/**
 * React wrapper for dialog-overlay
 *
 * Overlay/backdrop that appears behind the dialog content.
 *
 * @prop {boolean} forceMount - Whether to force-mount regardless of open state
 */
export const DialogOverlay = createComponent({
  tagName: "dialog-overlay",
  elementClass: dialog.DialogOverlay,
  react: React,
});

/**
 * React wrapper for dialog-content
 *
 * Main content container for the dialog.
 *
 * @prop {boolean} forceMount - Whether to force-mount regardless of open state
 */
export const DialogContent = createComponent({
  tagName: "dialog-content",
  elementClass: dialog.DialogContent,
  react: React,
});

/**
 * React wrapper for dialog-title
 *
 * Title element for the dialog.
 */
export const DialogTitle = createComponent({
  tagName: "dialog-title",
  elementClass: dialog.DialogTitle,
  react: React,
});

/**
 * React wrapper for dialog-description
 *
 * Description element for the dialog.
 */
export const DialogDescription = createComponent({
  tagName: "dialog-description",
  elementClass: dialog.DialogDescription,
  react: React,
});

/**
 * React wrapper for dialog-close
 *
 * Close button that closes the dialog when clicked.
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
  DialogContentProps,
  DialogPortalProps,
  DialogOverlayProps,
} from "./types";
