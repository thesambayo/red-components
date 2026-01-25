import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SelectItemContextValue, selectItemContext } from "./select-item";

/**
 * Text content of select item.
 * Used for both display and typeahead search.
 *
 * @element select-item-text
 * @slot - Text content
 */
@customElement("select-item-text")
export class SelectItemText extends LitElement {
  @consume({ context: selectItemContext, subscribe: true })
  @property({ attribute: false })
  private _itemContext!: SelectItemContextValue;

  connectedCallback() {
    super.connectedCallback();

    // Set ID for aria-labelledby
    if (this._itemContext) {
      this.setAttribute("id", this._itemContext.textId);
    }
  }

  protected updated() {
    // Update ID if context changes
    if (this._itemContext) {
      this.setAttribute("id", this._itemContext.textId);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-item-text": SelectItemText;
  }
}
