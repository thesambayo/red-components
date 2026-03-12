import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SelectContextValue } from "./select-context";
import { selectRootContext } from "./select-context";

/**
 * Displays the currently selected value(s) in the select trigger.
 *
 * @element select-value
 * @attr {string} placeholder - Text to display when no value is selected
 * @slot - Custom rendering of selected value (receives value data)
 */
@customElement("select-value")
export class SelectValue extends LitElement {
  @property({ type: String })
  placeholder?: string;

  @consume({ context: selectRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: SelectContextValue;

  protected render() {
    if (!this._context) {
      return html`<slot></slot>`;
    }

    const { selectedValue, items } = this._context;

    // No selection
    if (
      !selectedValue ||
      (Array.isArray(selectedValue) && selectedValue.length === 0)
    ) {
      return html`${this.placeholder || ""}`;
    }

    // Single selection
    if (!Array.isArray(selectedValue)) {
      const item = items.get(selectedValue);
      return html`${item?.textContent || selectedValue}`;
    }

    // Multiple selection
    const labels = selectedValue
      .map((value) => {
        const item = items.get(value);
        return item?.textContent || value;
      })
      .filter(Boolean);

    return html`${labels.join(", ")}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-value": SelectValue;
  }
}
