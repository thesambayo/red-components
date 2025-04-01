import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("dropdown-separator")
export class DropdownSeparator extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "separator");
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
