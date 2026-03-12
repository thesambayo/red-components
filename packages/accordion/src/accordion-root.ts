import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { accordionRootContext } from "./context";
import type {
  AccordionType,
  Direction,
  Orientation,
  AccordionContextValue,
} from "./types";

/**
 * Root container for the accordion component.
 *
 * @element accordion-root
 *
 * @fires change - Emitted when expanded items change. Detail contains string[] of expanded values.
 *
 * @example
 * ```html
 * <accordion-root type="single">
 *   <accordion-item value="item-1">
 *     <accordion-header>
 *       <accordion-trigger>Section 1</accordion-trigger>
 *     </accordion-header>
 *     <accordion-content>Content 1</accordion-content>
 *   </accordion-item>
 * </accordion-root>
 * ```
 */
@customElement("accordion-root")
export class AccordionRoot extends LitElement {
  /**
   * Single allows one item open at a time, multiple allows many
   */
  @property({ type: String })
  type: AccordionType = "single";

  /**
   * Default expanded item(s). Use JSON array format for multiple: '["item-1", "item-2"]'
   */
  @property({
    attribute: "default-value",
    converter: {
      fromAttribute: (value) => {
        if (!value) return [];
        try {
          const parsed = JSON.parse(value.replace(/'/g, '"'));
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [value];
        }
      },
    },
  })
  defaultValue: string[] = [];

  /**
   * Reading direction for RTL support
   */
  @property({ type: String })
  dir: Direction = "ltr";

  /**
   * Orientation affects keyboard navigation
   */
  @property({ type: String })
  orientation: Orientation = "vertical";

  /**
   * Disable all accordion items
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Allow collapsing all items in single mode
   */
  @property({ type: Boolean })
  collapsible = false;

  /** Internal state for expanded values */
  @state()
  private _expandedValues: string[] = [];

  /** Context value provided to children - used by @provide decorator */
  @provide({ context: accordionRootContext })
  @property({ attribute: false })
  context: AccordionContextValue = this.createContext();

  connectedCallback() {
    super.connectedCallback();
    // Initialize with default value
    this._expandedValues = [...this.defaultValue];
    // Update context with initial values
    this._updateContext();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Update context when any relevant property changes
    if (
      changed.has("type") ||
      changed.has("dir") ||
      changed.has("orientation") ||
      changed.has("disabled") ||
      changed.has("collapsible") ||
      changed.has("_expandedValues")
    ) {
      this._updateContext();
    }
  }

  private createContext(): AccordionContextValue {
    return {
      value: this._expandedValues,
      type: this.type,
      direction: this.dir,
      orientation: this.orientation,
      disabled: this.disabled,
      collapsible: this.collapsible,
      toggle: this._toggle.bind(this),
      isExpanded: this._isExpanded.bind(this),
    };
  }

  private _updateContext() {
    this.context = this.createContext();
  }

  private _toggle(itemValue: string) {
    if (this.disabled) return;

    const isCurrentlyExpanded = this._expandedValues.includes(itemValue);

    let newValue: string[];

    if (this.type === "single") {
      if (isCurrentlyExpanded) {
        // Collapse only if collapsible is true
        newValue = this.collapsible ? [] : this._expandedValues;
      } else {
        newValue = [itemValue];
      }
    } else {
      // Multiple mode - toggle the item
      newValue = isCurrentlyExpanded
        ? this._expandedValues.filter((v) => v !== itemValue)
        : [...this._expandedValues, itemValue];
    }

    // Update state (triggers reactive updates via @state)
    this._expandedValues = newValue;

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: newValue,
      })
    );
  }

  private _isExpanded(itemValue: string): boolean {
    return this._expandedValues.includes(itemValue);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "accordion-root": AccordionRoot;
  }
}
