import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { accordionRootContext, accordionItemContext } from "./context";
import type { AccordionContextValue, AccordionItemContextValue } from "./types";

/**
 * Contains the collapsible content for an accordion item.
 *
 * @element new-accordion-content
 *
 * @example
 * ```html
 * <new-accordion-content>
 *   <p>This content is shown when the item is expanded.</p>
 * </new-accordion-content>
 * ```
 */
@customElement("new-accordion-content")
export class NewAccordionContent extends LitElement {
  @consume({ context: accordionRootContext, subscribe: true })
  private _rootContext?: AccordionContextValue;

  @consume({ context: accordionItemContext, subscribe: true })
  private _itemContext?: AccordionItemContextValue;

  connectedCallback() {
    super.connectedCallback();
    // Set region role for accessibility
    this.setAttribute("role", "region");
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  private _updateAttributes() {
    if (!this._rootContext || !this._itemContext) return;

    const isExpanded = this._rootContext.isExpanded(this._itemContext.value);

    // Set ARIA attributes
    this.setAttribute("id", this._itemContext.contentId);
    this.setAttribute("aria-labelledby", this._itemContext.triggerId);

    // Set data attributes for styling
    this.setAttribute("data-state", isExpanded ? "open" : "closed");
    this.setAttribute("data-orientation", this._rootContext.orientation);

    // Control visibility via hidden attribute
    this.toggleAttribute("hidden", !isExpanded);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "new-accordion-content": NewAccordionContent;
  }
}
