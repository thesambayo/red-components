import { consume } from "@lit/context";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  computePosition,
  flip,
  shift,
  offset,
  size,
  autoUpdate,
  Placement,
} from "@floating-ui/dom";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext, ComboboxRoot } from "./combobox-root";

type Side = "top" | "bottom";
type Align = "start" | "center" | "end";

/**
 * Combobox content container with Popover API and floating-ui positioning.
 *
 * @element combobox-content
 * @slot - Combobox items
 *
 * @cssprop --combobox-input-width - Width of input (set automatically)
 * @cssprop --combobox-available-height - Available height (set automatically)
 */
@customElement("combobox-content")
export class ComboboxContent extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      outline: none;
    }

    :host(:not(:popover-open)) {
      display: none;
    }

    :host([data-state="opening"]) {
      opacity: 0;
      pointer-events: none;
    }
  `;

  @property({ type: String })
  side: Side = "bottom";

  @property({ type: String })
  align: Align = "start";

  @property({ type: Number, attribute: "side-offset" })
  sideOffset = 4;

  @property({ type: Number, attribute: "align-offset" })
  alignOffset = 0;

  @property({ type: Number, attribute: "max-height" })
  maxHeight?: number;

  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  private _root: ComboboxRoot | null = null;
  private _items: HTMLElement[] = [];
  private _cleanupAutoUpdate?: () => void;

  protected firstUpdated() {
    // Set ID for ARIA once context is available
    this.setAttribute("id", this._context.contentId);
  }

  connectedCallback() {
    super.connectedCallback();

    // Find root element
    this._root = this.closest("combobox-root") as ComboboxRoot;

    // Set popover attribute for light dismiss
    this.setAttribute("popover", "auto");
    this.setAttribute("role", "listbox");
    this.setAttribute("data-state", "closed");

    // Register with root
    if (this._root) {
      this._root.setContentElement(this);
    }

    // Listen for toggle to position content
    this.addEventListener("toggle", this._handleToggle as EventListener);
    this.addEventListener("keydown", this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPositioning();
    this.removeEventListener("toggle", this._handleToggle as EventListener);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    // Open/close popover based on context state
    if (changedProperties.has("_context")) {
      const { isOpen } = this._context;
      const isPopoverOpen = this.matches(":popover-open");

      if (isOpen && !isPopoverOpen) {
        // Set opening state BEFORE showing popover to prevent flicker
        this.setAttribute("data-state", "opening");
        this.showPopover();
      } else if (!isOpen && isPopoverOpen) {
        this.hidePopover();
      }
    }
  }

  private _handleToggle = (event: ToggleEvent) => {
    if (event.newState === "open") {
      // Opening state already set in updated(), just start positioning
      this._startPositioning();
      this._updateItems();
      // Highlight initial item (selected or first) after positioning
      requestAnimationFrame(() => {
        this._highlightInitialItem();
        // Auto-focus input
        this._focusInputIfInside();
      });
    } else {
      this.setAttribute("data-state", "closed");
      this.removeAttribute("data-side");
      this.removeAttribute("data-align");

      // Stop auto-updating position
      this._stopPositioning();

      // Return focus to trigger if it exists
      this._returnFocusToTrigger();

      // Notify root that popover closed (e.g., via Escape or light dismiss)
      if (this._context.isOpen) {
        this._context.onClose();
      }
    }
  };

  private _highlightInitialItem() {
    const { selectedValue, setHighlightedValue, filteredItems, items } = this._context;

    // Try to highlight selected item first (if not disabled)
    if (
      selectedValue &&
      !Array.isArray(selectedValue) &&
      filteredItems.has(selectedValue) &&
      !items.get(selectedValue)?.disabled
    ) {
      setHighlightedValue(selectedValue);
      return;
    }

    // Otherwise highlight first enabled item
    const values = Array.from(filteredItems);
    const firstEnabledValue = values.find((value) => !items.get(value)?.disabled);
    if (firstEnabledValue) {
      setHighlightedValue(firstEnabledValue);
    }
  }

  private _focusInputIfInside() {
    // Query from root to find combobox-input anywhere in the tree
    if (!this._root) return;

    const inputComponent = this._root.querySelector("combobox-input");
    if (!inputComponent) return;

    // Focus the actual input element inside the component's shadow DOM
    // (regardless of whether it's inside content or outside in anchor)
    const inputElement = inputComponent.shadowRoot?.querySelector("input");
    if (inputElement) {
      inputElement.focus();
    }
  }

  private _returnFocusToTrigger() {
    // Return focus to trigger if it exists
    const triggerElement = this._context.triggerElement;
    if (triggerElement && typeof triggerElement.focus === "function") {
      triggerElement.focus();
    }
  }

  private _startPositioning() {
    // Use anchor element if provided, otherwise fall back to input
    const anchor = this._context.anchorElement || this._context.inputElement;
    if (!anchor) return;

    // Start auto-updating position on scroll, resize, etc.
    this._cleanupAutoUpdate = autoUpdate(anchor, this, () => {
      this._updatePosition();
    });
  }

  private _stopPositioning() {
    if (this._cleanupAutoUpdate) {
      this._cleanupAutoUpdate();
      this._cleanupAutoUpdate = undefined;
    }
  }

  private async _updatePosition() {
    // Use anchor element if provided, otherwise fall back to input
    const anchor = this._context.anchorElement || this._context.inputElement;
    if (!anchor) return;

    const placement = this._getPlacement();

    const {
      x,
      y,
      placement: finalPlacement,
    } = await computePosition(anchor, this, {
      strategy: "fixed",
      placement,
      middleware: [
        offset({
          mainAxis: this.sideOffset,
          crossAxis: this.alignOffset,
        }),
        flip({
          fallbackAxisSideDirection: "start",
        }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply: ({ availableHeight, rects }) => {
            const maxHeight = this.maxHeight || availableHeight;
            this.style.setProperty(
              "--combobox-available-height",
              `${maxHeight}px`
            );
            this.style.setProperty(
              "--combobox-input-width",
              `${rects.reference.width}px`
            );
          },
        }),
      ],
    });

    this.style.left = `${x}px`;
    this.style.top = `${y}px`;

    // Set data attributes for styling
    const [side, align] = finalPlacement.split("-");
    this.setAttribute("data-side", side);
    this.setAttribute("data-align", align || "center");

    // Show content after first positioning is complete
    if (this.getAttribute("data-state") === "opening") {
      this.setAttribute("data-state", "open");
    }
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side;
    }
    return `${this.side}-${this.align}`;
  }

  private _updateItems() {
    // Get all visible items (not disabled and in filtered set)
    this._items = Array.from(
      this.querySelectorAll(
        'combobox-item:not([data-disabled]):not([style*="display: none"])'
      )
    ) as HTMLElement[];
  }

  private _handleKeydown = (event: KeyboardEvent) => {
    // Note: Keyboard navigation is handled by the input element
    // This handler is kept for potential future functionality
    // but should not interfere with input navigation
  };

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-content": ComboboxContent;
  }
}
