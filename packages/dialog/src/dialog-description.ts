import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dialogRootContext } from "./context";
import type { DialogRootContextValue } from "./types";

/**
 * Description element for the dialog.
 * Sets the ID used for aria-describedby.
 *
 * @element dialog-description
 *
 * @example
 * ```html
 * <dialog-description>This is the dialog description.</dialog-description>
 * ```
 */
@customElement("dialog-description")
export class DialogDescription extends LitElement {
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

    // Set ID for aria-describedby
    this.setAttribute("id", this._rootContext.descriptionId);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-description": DialogDescription;
  }
}
