import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dialogRootContext } from "./context";
import type { DialogRootContextValue } from "./types";

/**
 * Title element for the dialog.
 * Sets the ID used for aria-labelledby.
 *
 * @element dialog-title
 *
 * @example
 * ```html
 * <dialog-title>Dialog Title</dialog-title>
 * ```
 */
@customElement("dialog-title")
export class DialogTitle extends LitElement {
  @consume({ context: dialogRootContext, subscribe: true })
  private _rootContext?: DialogRootContextValue;

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
    "dialog-title": DialogTitle;
  }
}
