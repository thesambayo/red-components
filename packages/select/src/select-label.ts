import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Label for a group of select items.
 *
 * @element select-label
 * @slot - Label content
 */
@customElement("select-label")
export class SelectLabel extends LitElement {
  private _labelId = `select-label-${Math.random().toString(36).substr(2, 9)}`;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("id", this._labelId);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-label": SelectLabel;
  }
}
