import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("dropdown-label")
export class DropdownLabel extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "label");
    this.setAttribute("tabindex", "-1");
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
