/**
 * AlertDialog Web Components (Native-First)
 *
 * Alert dialogs are modal dialogs that interrupt the user with important content
 * and expect a response. Uses native `<dialog>` element under the hood.
 *
 * Key differences from regular Dialog:
 * - Always modal (no `modal` prop)
 * - Cannot be dismissed by clicking backdrop
 * - Cannot be dismissed by pressing Escape
 * - Auto-focuses the cancel button for safer UX
 * - Uses role="alertdialog" for better accessibility
 *
 * @example
 * ```html
 * <alert-dialog-root>
 *   <alert-dialog-trigger as-child>
 *     <button>Delete Item</button>
 *   </alert-dialog-trigger>
 *
 *   <dialog>
 *     <h2 data-dialog-title>Confirm Deletion</h2>
 *     <p data-dialog-description>
 *       This action cannot be undone. This will permanently delete the item.
 *     </p>
 *
 *     <footer>
 *       <alert-dialog-cancel as-child>
 *         <button>Cancel</button>
 *       </alert-dialog-cancel>
 *       <alert-dialog-action as-child>
 *         <button>Delete</button>
 *       </alert-dialog-action>
 *     </footer>
 *   </dialog>
 * </alert-dialog-root>
 * ```
 */

export { AlertDialogRoot } from "./alert-dialog-root";
export { AlertDialogTrigger } from "./alert-dialog-trigger";
export { AlertDialogAction } from "./alert-dialog-action";
export { AlertDialogCancel } from "./alert-dialog-cancel";

// Re-export types
export type {
  AlertDialogState,
  AlertDialogRootContextValue,
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from "./types";
