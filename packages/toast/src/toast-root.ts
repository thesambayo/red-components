import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("toast-root")
export class ToastRoot extends LitElement {
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  @property()
  accessor id = "";

  protected render() {
    return html`
      <div role="alert" aria-live="polite">
        <slot></slot>
      </div>
    `;
  }
}
