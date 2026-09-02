import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { ComboboxRoot } from "./combobox-root";

/**
 * Anchor element for positioning combobox content.
 * Wraps the element that the content should be positioned relative to.
 *
 * @element combobox-anchor
 * @slot Content to act as anchor (usually combobox-input or a trigger button)
 */
@customElement("combobox-anchor")
export class ComboboxAnchor extends LitElement {
  /**
   * The anchor is a positioning reference, not a visual box.
   * `display: contents` keeps it out of layout so floating content is
   * measured against the slotted element rather than a wrapper.
   */
  static styles = css`
    :host {
      display: contents;
    }
  `;

  private _root: ComboboxRoot | null = null;

  connectedCallback() {
    super.connectedCallback();

    // Find root element
    this._root = this.closest("combobox-root") as ComboboxRoot;
  }

  protected firstUpdated() {
    // The host is the anchor. `display: contents` keeps it out of layout, so
    // positioning measures the slotted content's box rather than a wrapper.
    if (this._root) {
      this._root.setAnchorElement(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unregister anchor
    if (this._root) {
      this._root.setAnchorElement(null);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-anchor": ComboboxAnchor;
  }
}
