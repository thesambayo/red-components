import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Groups select items together semantically.
 *
 * @element select-group
 * @slot - Contains select-label and select-item elements
 */
@customElement("select-group")
export class SelectGroup extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "group");
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-group": SelectGroup;
  }
}
