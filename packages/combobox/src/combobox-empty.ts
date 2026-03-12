import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext } from "./combobox-root";

/**
 * Empty state message displayed when no items match the search.
 *
 * @element combobox-empty
 * @slot - Empty state content (default: "No results found")
 */
@customElement("combobox-empty")
export class ComboboxEmpty extends LitElement {
  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "status");
    this.setAttribute("aria-live", "polite");
  }

  protected willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("_context")) {
      this._updateVisibility();
    }
  }

  private _updateVisibility() {
    if (!this._context) return;

    const { filteredItems } = this._context;

    // Show when there are no filtered items
    if (filteredItems.size === 0) {
      this.style.display = "";
    } else {
      this.style.display = "none";
    }
  }

  protected render() {
    return html`<slot>No results found</slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-empty": ComboboxEmpty;
  }
}
