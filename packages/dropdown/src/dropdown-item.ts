import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("dropdown-item")
export class DropdownItem extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "menuitem");
    this.setAttribute("tabindex", "-1");

    this.addEventListener("pointermove", this._handlePointerMove);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("pointermove", this._handlePointerMove);
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
  }

  protected render() {
    return html`<slot></slot>`;
  }

  _handlePointerMove = () => {
    this.focus();
  };

  _handleFocus = () => {
    this.setAttribute("data-highlighted", "");
    this.setAttribute("tabindex", "0");
  };

  _handleBlur = () => {
    this.removeAttribute("data-highlighted");
    this.setAttribute("tabindex", "-1");
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-item": DropdownItem;
  }
}
