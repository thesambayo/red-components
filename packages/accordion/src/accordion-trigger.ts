import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { accordionRootContext, accordionItemContext } from "./context";
import type { AccordionContextValue, AccordionItemContextValue } from "./types";

const ACTIVATION_KEYS = [" ", "Enter"];

/**
 * Button that toggles the accordion item's expanded state.
 *
 * @element accordion-trigger
 *
 * @example
 * ```html
 * <accordion-trigger>Click me</accordion-trigger>
 * ```
 */
@customElement("accordion-trigger")
export class AccordionTrigger extends LitElement {
  @consume({ context: accordionRootContext, subscribe: true })
  private _rootContext?: AccordionContextValue;

  @consume({ context: accordionItemContext, subscribe: true })
  private _itemContext?: AccordionItemContextValue;

  connectedCallback() {
    super.connectedCallback();

    // Set button role and make focusable
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");

    // Event listeners
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  private _updateAttributes() {
    if (!this._rootContext || !this._itemContext) return;

    const isExpanded = this._rootContext.isExpanded(this._itemContext.value);
    const isDisabled =
      this._itemContext.disabled || this._rootContext.disabled;

    // Set ARIA attributes
    this.setAttribute("id", this._itemContext.triggerId);
    this.setAttribute("aria-expanded", String(isExpanded));
    this.setAttribute("aria-controls", this._itemContext.contentId);

    // Set data attributes for styling
    this.setAttribute("data-state", isExpanded ? "open" : "closed");
    this.setAttribute("data-orientation", this._rootContext.orientation);
    this.toggleAttribute("data-disabled", isDisabled);

    // Update tabindex based on disabled state
    this.setAttribute("tabindex", isDisabled ? "-1" : "0");
    this.setAttribute("aria-disabled", String(isDisabled));
  }

  private _handleClick = (event: MouseEvent) => {
    event.preventDefault();
    this._toggle();
  };

  private _handleKeydown = (event: KeyboardEvent) => {
    if (!ACTIVATION_KEYS.includes(event.key)) return;

    event.preventDefault();
    this._toggle();
  };

  private _toggle() {
    if (!this._rootContext || !this._itemContext) return;

    const isDisabled =
      this._itemContext.disabled || this._rootContext.disabled;
    if (isDisabled) return;

    this._rootContext.toggle(this._itemContext.value);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "accordion-trigger": AccordionTrigger;
  }
}
