import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Cancel button that dismisses the alert dialog without action.
 * Receives auto-focus when the dialog opens.
 *
 * With `as-child`, passes behavior to the slotted child element.
 * Without `as-child`, acts as the cancel button itself.
 *
 * @element alert-dialog-cancel
 *
 * @example
 * ```html
 * <!-- With as-child: behavior passed to button -->
 * <alert-dialog-cancel as-child>
 *   <button>Cancel</button>
 * </alert-dialog-cancel>
 *
 * <!-- Without as-child: component is the button -->
 * <alert-dialog-cancel>Cancel</alert-dialog-cancel>
 * ```
 */
@customElement("alert-dialog-cancel")
export class AlertDialogCancel extends LitElement {
  /**
   * Pass behavior to slotted child instead of rendering wrapper
   */
  @property({ type: Boolean, attribute: "as-child" })
  asChild = false;

  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /** Reference to the child element when using as-child */
  private _childElement: HTMLElement | null = null;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);
  private _handleSlotChange = this._onSlotChange.bind(this);

  connectedCallback() {
    super.connectedCallback();

    if (this.asChild) {
      // Will register child element after slot change
    } else {
      // Register with root context for auto-focus
      this._rootContext?.onCancelMount(this);
      this._setupSelfAsCancel();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.asChild) {
      this._cleanupChildCancel();
    } else {
      this._cleanupSelfAsCancel();
    }
  }

  private _setupSelfAsCancel() {
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
  }

  private _cleanupSelfAsCancel() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _setupChildCancel(child: HTMLElement) {
    this._childElement = child;

    // Register child with root context for auto-focus
    this._rootContext?.onCancelMount(child);

    // Add event listeners to child
    child.addEventListener("click", this._handleClick);
    child.addEventListener("keydown", this._handleKeyDown);
  }

  private _cleanupChildCancel() {
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
    this._cleanupChildCancel();

    // Setup new child
    if (children.length > 0) {
      const child = children[0] as HTMLElement;
      this._setupChildCancel(child);
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
    "alert-dialog-cancel": AlertDialogCancel;
  }
}
