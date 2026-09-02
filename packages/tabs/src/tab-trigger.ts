import { css, html, LitElement } from "lit";
import { consume } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import { TabsContextValue, tabsRootContext } from "./tabs-context";

/**
 * Tab trigger button that activates a tab panel.
 *
 * @element tab-trigger
 *
 * @example
 * ```html
 * <tab-trigger value="tab1">Tab 1</tab-trigger>
 * ```
 */
@customElement("tab-trigger")
export class TabTrigger extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  @property({ type: String, reflect: true })
  value?: string;

  // todo: implement disabled tab, prevent it from being selectable and focusable
  // @property({type: Boolean, reflect: true})
  // disabled = false;

  @consume({ context: tabsRootContext, subscribe: true })
  private _context?: TabsContextValue;

  /** Stored handler references for proper cleanup */
  private _handleFocus = this._onFocus.bind(this);
  private _handleClick = this._onClick.bind(this);
  private _handleKeydown = this._onKeydown.bind(this);

  connectedCallback() {
    super.connectedCallback();

    this._setupTrigger();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._cleanupTrigger();
  }

  protected willUpdate() {
    this._updateTriggerAttributes();
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _setupTrigger() {
    // Set role
    this.setAttribute("role", "tab");

    // Event listeners
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeydown);
  }

  private _cleanupTrigger() {
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private _updateAttributes() {
    if (!this._context || !this.value) return;

    this._updateTriggerAttributes();
  }

  private _updateTriggerAttributes() {
    if (!this._context || !this.value) return;

    const isActive = this.value === this._context.value;
    const shouldFocus = this._context.shouldFocus;

    // Generate predictable IDs based on value
    const triggerId = `tab-trigger-${this.value}`;
    const contentId = `tab-content-${this.value}`;

    // Set ARIA attributes
    this.setAttribute("id", triggerId);
    this.setAttribute("aria-selected", String(isActive));
    this.setAttribute("aria-controls", contentId);

    // Set data attributes for styling
    this.setAttribute("data-state", isActive ? "active" : "inactive");
    this.setAttribute("data-orientation", this._context.orientation);

    // Set tabindex
    this.setAttribute("tabindex", isActive ? "0" : "-1");

    // Focus if needed
    if (isActive && shouldFocus) {
      this.focus();
    }
  }

  private _onFocus() {
    if (!this._context || !this.value) return;

    // In automatic mode, focusing a trigger activates it
    if (this._context.activationMode === "automatic") {
      this._context.changeValue(this.value);
    }
  }

  private _onClick() {
    if (!this._context || !this.value) return;

    // In manual mode, clicking activates the tab
    if (this._context.activationMode === "manual") {
      this._context.changeValue(this.value);
    }
  }

  private _onKeydown(event: KeyboardEvent) {
    if (!this._context || !this.value) return;

    // In manual mode, Enter or Space activates the tab
    if (this._context.activationMode === "manual") {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this._context.changeValue(this.value);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tab-trigger": TabTrigger;
  }
}