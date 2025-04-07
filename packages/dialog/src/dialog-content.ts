import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("dialog-content")
export class DialogContent extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
    requestAnimationFrame(() => {
      this.focus();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected render() {
    return html` <slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-content": DialogContent;
  }
}
