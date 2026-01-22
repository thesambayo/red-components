import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { accordionRootContext } from "./context";
import type { AccordionContextValue } from "./types";

/**
 * Wraps the trigger element. Renders as an h3 by default for proper heading structure.
 * Following WAI-ARIA Accordion Pattern.
 *
 * @element accordion-header
 *
 * @example
 * ```html
 * <accordion-header>
 *   <accordion-trigger>Section Title</accordion-trigger>
 * </accordion-header>
 * ```
 */
@customElement("accordion-header")
export class AccordionHeader extends LitElement {
  @consume({ context: accordionRootContext, subscribe: true })
  private _rootContext?: AccordionContextValue;

  connectedCallback() {
    super.connectedCallback();
    // Set role for accessibility
    this.setAttribute("role", "heading");
    this.setAttribute("aria-level", "3");
  }

  protected willUpdate() {
    // Update data-orientation from root context
    if (this._rootContext) {
      this.setAttribute("data-orientation", this._rootContext.orientation);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "accordion-header": AccordionHeader;
  }
}
