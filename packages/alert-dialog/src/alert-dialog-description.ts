import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Description element for the alert dialog.
 * Sets the ID used for aria-describedby.
 *
 * @element alert-dialog-description
 *
 * @example
 * ```html
 * <alert-dialog-description>This action cannot be undone.</alert-dialog-description>
 * ```
 */
@customElement("alert-dialog-description")
export class AlertDialogDescription extends LitElement {
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

    // Set ID for aria-describedby
    this.setAttribute("id", this._rootContext.descriptionId);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-description": AlertDialogDescription;
  }
}
