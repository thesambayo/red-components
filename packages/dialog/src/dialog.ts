/**
 * Dialog Web Components
 *
 * @example
 * ```html
 * <dialog-root>
 *   <dialog-trigger>
 *     <button>Open Dialog</button>
 *   </dialog-trigger>
 *   <dialog-portal>
 *     <dialog-overlay></dialog-overlay>
 *     <dialog-content>
 *       <dialog-title>Dialog Title</dialog-title>
 *       <dialog-description>Dialog description here</dialog-description>
 *       <p>Content</p>
 *       <dialog-close><button>Close</button></dialog-close>
 *     </dialog-content>
 *   </dialog-portal>
 * </dialog-root>
 * ```
 */

export { DialogRoot } from "./dialog-root";
export { DialogTrigger } from "./dialog-trigger";
export { DialogPortal } from "./dialog-portal";
export { DialogOverlay } from "./dialog-overlay";
export { DialogContent } from "./dialog-content";
export { DialogTitle } from "./dialog-title";
export { DialogDescription } from "./dialog-description";
export { DialogClose } from "./dialog-close";

// Re-export types
export type {
  DialogState,
  DialogRootContextValue,
  DialogRootProps,
  DialogContentProps,
  DialogPortalProps,
  DialogOverlayProps,
} from "./types";
