import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
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
   * Render as child element (delegating to slotted content)
   * When true, the first child element becomes the anchor
   */
  @property({ type: Boolean, attribute: "as-child" })
  asChild = false;

  private _root: ComboboxRoot | null = null;

  connectedCallback() {
    super.connectedCallback();

    // Find root element
    this._root = this.closest("combobox-root") as ComboboxRoot;
  }

  protected firstUpdated() {
    // Register this element (or first child if asChild) as anchor
    if (this._root) {
      if (this.asChild) {
        // Use first child as anchor
        const firstChild = this.querySelector(":scope > *") as HTMLElement;
        if (firstChild) {
          this._root.setAnchorElement(firstChild);
        }
      } else {
        // Use this element as anchor
        this._root.setAnchorElement(this);
      }
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
