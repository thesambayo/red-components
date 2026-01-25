import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SelectItemContextValue, selectItemContext } from "./select-item";

/**
 * Indicator for selected state of select item.
 * Only visible when item is selected.
 *
 * @element select-item-indicator
 * @slot - Indicator content (e.g., checkmark icon)
 */
@customElement("select-item-indicator")
export class SelectItemIndicator extends LitElement {
  @consume({ context: selectItemContext, subscribe: true })
  @property({ attribute: false })
  private _itemContext!: SelectItemContextValue;

  protected render() {
    if (!this._itemContext || !this._itemContext.isSelected) {
      return null;
    }

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-item-indicator": SelectItemIndicator;
  }
}
