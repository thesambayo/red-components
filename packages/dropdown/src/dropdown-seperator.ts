import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Visual separator between dropdown items.
 *
 * @element dropdown-separator
 */
@customElement("dropdown-separator")
export class DropdownSeparator extends LitElement {
  /**
   * Orientation of the separator
   */
  @property({ type: String })
  orientation: "horizontal" | "vertical" = "horizontal";

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "separator");
    this._updateOrientation();
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("orientation")) {
      this._updateOrientation();
    }
  }

  private _updateOrientation() {
    this.setAttribute("aria-orientation", this.orientation);
    this.setAttribute("data-orientation", this.orientation);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-separator": DropdownSeparator;
  }
}
