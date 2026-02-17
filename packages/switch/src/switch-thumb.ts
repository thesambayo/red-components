import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { SwitchContext, switchContext } from "./switch-context";

@customElement("switch-thumb")
export class SwitchThumb extends LitElement {
  @consume({ context: switchContext, subscribe: true })
  private _context?: SwitchContext;

  protected willUpdate() {
    this._updateDataAttributes();
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _updateDataAttributes() {
    if (!this._context) return;

    const { checked, disabled, readonly, required } = this._context;

    if (checked) {
      this.dataset.checked = "";
      delete this.dataset.unchecked;
    } else {
      delete this.dataset.checked;
      this.dataset.unchecked = "";
    }

    if (disabled) {
      this.dataset.disabled = "";
    } else {
      delete this.dataset.disabled;
    }

    if (readonly) {
      this.dataset.readonly = "";
    } else {
      delete this.dataset.readonly;
    }

    if (required) {
      this.dataset.required = "";
    } else {
      delete this.dataset.required;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "switch-thumb": SwitchThumb;
  }
}
