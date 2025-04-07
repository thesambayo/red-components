import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * should be useable as
    1. <dialog-close></dialog-close>
 *  or 2. <button data-dialog-close><button>
 * we will be adding eventlisteners to the ported clones
 */
@customElement("dialog-close")
export class DialogClose extends LitElement {
  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected render() {
    return html` <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-close": DialogClose;
  }
}
