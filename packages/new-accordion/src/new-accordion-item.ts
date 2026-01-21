import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume, provide } from "@lit/context";
import { accordionRootContext, accordionItemContext, generateId } from "./context";
import type { AccordionContextValue, AccordionItemContextValue } from "./types";

/**
 * Container for a single accordion item (header + content pair).
 *
 * @element new-accordion-item
 *
 * @example
 * ```html
 * <new-accordion-item value="section-1">
 *   <new-accordion-header>
 *     <new-accordion-trigger>Click to expand</new-accordion-trigger>
 *   </new-accordion-header>
 *   <new-accordion-content>Hidden content here</new-accordion-content>
 * </new-accordion-item>
 * ```
 */
@customElement("new-accordion-item")
export class NewAccordionItem extends LitElement {
  /**
   * Unique value identifying this item. Required for state management.
   */
  @property({ type: String, reflect: true })
  value = "";

  /**
   * Whether this specific item is disabled
   */
  @property({ type: Boolean })
  disabled = false;

  /** Consume root context for state access */
  @consume({ context: accordionRootContext, subscribe: true })
  private _rootContext?: AccordionContextValue;

  /** Generated IDs for ARIA relationships */
  private _triggerId = generateId("accordion-trigger");
  private _contentId = generateId("accordion-content");

  /** Provide item context to children (trigger, content) */
  @provide({ context: accordionItemContext })
  private _itemContext: AccordionItemContextValue = {
    value: this.value,
    disabled: this.disabled,
    triggerId: this._triggerId,
    contentId: this._contentId,
  };

  protected willUpdate(changed: Map<string, unknown>) {
    // Keep item context in sync with properties
    if (changed.has("value") || changed.has("disabled")) {
      this._itemContext = {
        ...this._itemContext,
        value: this.value,
        disabled: this.disabled,
      };
    }

    // Update data-state based on root context
    this._updateDataState();
  }

  private _updateDataState() {
    if (!this._rootContext || !this.value) return;

    const isExpanded = this._rootContext.isExpanded(this.value);
    this.setAttribute("data-state", isExpanded ? "open" : "closed");

    // Also set disabled state from root or local
    const isDisabled = this.disabled || this._rootContext.disabled;
    this.toggleAttribute("data-disabled", isDisabled);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "new-accordion-item": NewAccordionItem;
  }
}
