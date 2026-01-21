/**
 * Dialog Web Components (Native-First)
 *
 * Uses native `<dialog>` element under the hood for:
 * - Automatic top-layer positioning
 * - Built-in focus trapping (modal mode)
 * - Native backdrop via `::backdrop`
 * - Escape key handling
 *
 * @example
 * ```html
 * <dialog-root modal>
 *   <dialog-trigger as-child>
 *     <button>Open Dialog</button>
 *   </dialog-trigger>
 *
 *   <dialog>
 *     <h2 data-dialog-title>Edit Profile</h2>
 *     <p data-dialog-description>Make changes to your profile.</p>
 *
 *     <label>Name <input type="text" /></label>
 *     <label>Email <input type="email" /></label>
 *
 *     <footer>
 *       <button data-dialog-close>Cancel</button>
 *       <button data-dialog-close>Save</button>
 *     </footer>
 *   </dialog>
 * </dialog-root>
 * ```
 */

export { DialogRoot } from "./dialog-root";
export { DialogTrigger } from "./dialog-trigger";
export { DialogClose } from "./dialog-close";

// Re-export types
export type {
  DialogState,
  DialogRootContextValue,
  DialogRootProps,
  DialogTriggerProps,
  DialogCloseProps,
} from "./types";
