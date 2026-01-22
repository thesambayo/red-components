import { html, LitElement, nothing } from "lit";
import { consume } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import { TabsContextValue, tabsRootContext } from "./tabs-context";

/**
 * Tab content panel that displays when its corresponding tab is active.
 *
 * @element tab-content
 *
 * @example
 * ```html
 * <tab-content value="tab1">
 *   Content for tab 1
 * </tab-content>
 * ```
 */
@customElement("tab-content")
export class TabContent extends LitElement {
  @property({ type: String, reflect: true })
  value?: string;

  @consume({ context: tabsRootContext, subscribe: true })
  private _context?: TabsContextValue;

  connectedCallback() {
    super.connectedCallback();

    // Set role
    this.setAttribute("role", "tabpanel");

    // Register with root context
    if (this.value && this._context) {
      this._context.registerContent(this.value);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unregister from root context
    if (this.value && this._context) {
      this._context.unregisterContent(this.value);
    }
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  protected render() {
    if (!this._context || !this.value) {
      return html`<slot></slot>`;
    }

    const isActive = this.value === this._context.value;

    // If unmountOnHide is enabled and content is inactive, don't render
    if (this._context.unmountOnHide && !isActive) {
      return nothing;
    }

    return html`<slot></slot>`;
  }

  private _updateAttributes() {
    if (!this._context || !this.value) return;

    const isActive = this.value === this._context.value;

    // Generate predictable IDs based on value
    const contentId = `tab-content-${this.value}`;
    const triggerId = `tab-trigger-${this.value}`;

    // Set ARIA attributes
    this.setAttribute("id", contentId);
    this.setAttribute("aria-labelledby", triggerId);

    // Set data attributes for styling
    this.setAttribute("data-state", isActive ? "active" : "inactive");
    this.setAttribute("data-orientation", this._context.orientation);

    // Control visibility via hidden attribute (if not using unmountOnHide)
    if (!this._context.unmountOnHide) {
      this.toggleAttribute("hidden", !isActive);
    }

    // Set tabindex for keyboard navigation
    this.setAttribute("tabindex", "0");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tab-content": TabContent;
  }
}
