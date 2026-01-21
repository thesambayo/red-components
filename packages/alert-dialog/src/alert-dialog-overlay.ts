import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Overlay/backdrop that appears behind the alert dialog content.
 * Unlike regular dialog, clicking the overlay does NOT close the alert dialog.
 * Users must explicitly click action or cancel buttons.
 *
 * @element alert-dialog-overlay
 *
 * @example
 * ```html
 * <alert-dialog-overlay></alert-dialog-overlay>
 * ```
 */
@customElement("alert-dialog-overlay")
export class AlertDialogOverlay extends LitElement {
  static styles = css`
    :host {
      pointer-events: auto;
    }

    :host([data-state="closed"]) {
      display: none !important;
    }
  `;

  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /**
   * Whether to force-mount the overlay regardless of open state.
   */
  @property({ type: Boolean, attribute: "force-mount" })
  forceMount = false;

  connectedCallback() {
    super.connectedCallback();

    // Set accessibility attributes
    this.setAttribute("aria-hidden", "true");
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  private _updateAttributes() {
    if (!this._rootContext) return;

    const shouldShow = this.forceMount || this._rootContext.open;
    this.setAttribute("data-state", shouldShow ? "open" : "closed");
  }

  // Note: No click handler - alert dialogs require explicit action/cancel

  protected render() {
    return html`${nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-overlay": AlertDialogOverlay;
  }
}
