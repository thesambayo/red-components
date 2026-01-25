import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Visual separator between groups of select items.
 *
 * @element select-separator
 */
@customElement("select-separator")
export class SelectSeparator extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "separator");
    this.setAttribute("aria-orientation", "horizontal");
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-separator": SelectSeparator;
  }
}
