import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Cancel button that dismisses the alert dialog without action.
 * Receives auto-focus when the dialog opens.
 * Wrap your button element inside this.
 *
 * @element alert-dialog-cancel
 *
 * @example
 * ```html
 * <alert-dialog-cancel>
 *   <button>Cancel</button>
 * </alert-dialog-cancel>
 * ```
 */
@customElement("alert-dialog-cancel")
export class AlertDialogCancel extends LitElement {
  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Register with root context for auto-focus
    this._rootContext?.onCancelMount(this);

    // Add event listeners
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Remove event listeners
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _onClick() {
    this._rootContext?.onOpenChange(false);
  }

  private _onKeyDown(event: KeyboardEvent) {
    // Trigger with SPACE and ENTER key
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this._rootContext?.onOpenChange(false);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-cancel": AlertDialogCancel;
  }
}
