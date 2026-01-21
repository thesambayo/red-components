/**
 * AlertDialog Web Components
 *
 * Alert dialogs are modal dialogs that interrupt the user with important content
 * and expect a response. Unlike regular dialogs, they:
 * - Cannot be dismissed by clicking the overlay
 * - Must be explicitly closed via action or cancel buttons
 * - Auto-focus the cancel button for safer UX
 * - Use role="alertdialog" for better accessibility
 *
 * @example
 * ```html
 * <alert-dialog-root>
 *   <alert-dialog-trigger>
 *     <button>Delete Item</button>
 *   </alert-dialog-trigger>
 *   <alert-dialog-portal>
 *     <alert-dialog-overlay></alert-dialog-overlay>
 *     <alert-dialog-content>
 *       <alert-dialog-title>Confirm Deletion</alert-dialog-title>
 *       <alert-dialog-description>
 *         This action cannot be undone. This will permanently delete the item.
 *       </alert-dialog-description>
 *       <alert-dialog-cancel><button>Cancel</button></alert-dialog-cancel>
 *       <alert-dialog-action><button>Delete</button></alert-dialog-action>
 *     </alert-dialog-content>
 *   </alert-dialog-portal>
 * </alert-dialog-root>
 * ```
 */

export { AlertDialogRoot } from "./alert-dialog-root";
export { AlertDialogTrigger } from "./alert-dialog-trigger";
export { AlertDialogPortal } from "./alert-dialog-portal";
export { AlertDialogOverlay } from "./alert-dialog-overlay";
export { AlertDialogContent } from "./alert-dialog-content";
export { AlertDialogTitle } from "./alert-dialog-title";
export { AlertDialogDescription } from "./alert-dialog-description";
export { AlertDialogAction } from "./alert-dialog-action";
export { AlertDialogCancel } from "./alert-dialog-cancel";

// Re-export types
export type {
  AlertDialogState,
  AlertDialogRootContextValue,
  AlertDialogRootProps,
  AlertDialogContentProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
} from "./types";
