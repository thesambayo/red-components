import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dialogRootContext } from "./context";
import type { DialogRootContextValue } from "./types";

/**
 * Close button that closes the dialog when clicked.
 *
 * With `as-child`, passes behavior to the slotted child element.
 * Without `as-child`, acts as the close button itself.
 *
 * Note: You can also use the `data-dialog-close` attribute on any element
 * inside the dialog to close it without using this component.
 *
 * @element dialog-close
 *
 * @example
 * ```html
 * <!-- With as-child: behavior passed to button -->
 * <dialog-close as-child>
 *   <button>Close</button>
 * </dialog-close>
 *
 * <!-- Without as-child: component is the button -->
 * <dialog-close>Close</dialog-close>
 *
 * <!-- Alternative: use data attribute directly -->
 * <button data-dialog-close>Close</button>
 * ```
 */
@customElement("dialog-close")
export class DialogClose extends LitElement {
  /**
   * Pass behavior to slotted child instead of rendering wrapper
   */
  @property({ type: Boolean, attribute: "as-child" })
  asChild = false;

  @consume({ context: dialogRootContext, subscribe: true })
  private _rootContext?: DialogRootContextValue;

  /** Reference to the child element when using as-child */
  private _childElement: HTMLElement | null = null;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);
  private _handleSlotChange = this._onSlotChange.bind(this);

  connectedCallback() {
    super.connectedCallback();

    if (!this.asChild) {
      this._setupSelfAsClose();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.asChild) {
      this._cleanupChildClose();
    } else {
      this._cleanupSelfAsClose();
    }
  }

  private _setupSelfAsClose() {
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
  }

  private _cleanupSelfAsClose() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _setupChildClose(child: HTMLElement) {
    this._childElement = child;

    // Add event listeners to child
    child.addEventListener("click", this._handleClick);
    child.addEventListener("keydown", this._handleKeyDown);
  }

  private _cleanupChildClose() {
    if (this._childElement) {
      this._childElement.removeEventListener("click", this._handleClick);
      this._childElement.removeEventListener("keydown", this._handleKeyDown);
      this._childElement = null;
    }
  }

  private _onSlotChange(event: Event) {
    if (!this.asChild) return;

    const slot = event.target as HTMLSlotElement;
    const children = slot.assignedElements();

    // Cleanup previous child
    this._cleanupChildClose();

    // Setup new child
    if (children.length > 0) {
      const child = children[0] as HTMLElement;
      this._setupChildClose(child);
    }
  }

  private _onClick() {
    this._rootContext?.onOpenChange(false);
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this._rootContext?.onOpenChange(false);
    }
  }

  protected render() {
    return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-close": DialogClose;
  }
}
