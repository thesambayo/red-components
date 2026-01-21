import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Title element for the alert dialog.
 * Sets the ID used for aria-labelledby.
 *
 * @element alert-dialog-title
 *
 * @example
 * ```html
 * <alert-dialog-title>Confirm Deletion</alert-dialog-title>
 * ```
 */
@customElement("alert-dialog-title")
export class AlertDialogTitle extends LitElement {
  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  connectedCallback() {
    super.connectedCallback();
    this._updateAttributes();
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  private _updateAttributes() {
    if (!this._rootContext) return;

    // Set ID for aria-labelledby
    this.setAttribute("id", this._rootContext.titleId);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-title": AlertDialogTitle;
  }
}
