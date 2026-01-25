import { consume } from "@lit/context";
import { html, LitElement, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import {
  computePosition,
  flip,
  shift,
  offset,
  size,
  Placement,
} from "@floating-ui/dom";
import { SelectContextValue } from "./select-context";
import { selectRootContext } from "./select-context";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

/**
 * Content container for select dropdown.
 * Uses Popover API for top-layer rendering and floating-ui for positioning.
 *
 * @element select-content
 * @slot - Contains select-item, select-group, select-label elements
 *
 * @cssprop --select-trigger-width - Width of trigger (set automatically)
 * @cssprop --select-trigger-height - Height of trigger (set automatically)
 * @cssprop --select-available-width - Available width (set automatically)
 * @cssprop --select-available-height - Available height (set automatically)
 */
@customElement("select-content")
export class SelectContent extends LitElement {
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
  `;

  @consume({ context: selectRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: SelectContextValue;

  /**
   * Side of trigger to display content
   */
  @property({ type: String })
  side: Side = "bottom";

  /**
   * Distance from trigger in pixels
   */
  @property({ type: Number, attribute: "side-offset" })
  sideOffset = 4;

  /**
   * Alignment relative to trigger
   */
  @property({ type: String })
  align: Align = "start";

  /**
   * Offset along alignment axis
   */
  @property({ type: Number, attribute: "align-offset" })
  alignOffset = 0;

  private _previousOpen = false;

  connectedCallback() {
    super.connectedCallback();

    // Set popover attribute for top-layer rendering with automatic light dismiss
    this.setAttribute("popover", "auto");
    this.setAttribute("role", "listbox");
    this.setAttribute("tabindex", "-1");
    this.setAttribute("data-state", "closed");

    this.addEventListener("toggle", this._handleToggle as EventListener);
    this.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("toggle", this._handleToggle as EventListener);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  protected updated() {
    if (!this._context) return;

    // Update ARIA attributes
    this.setAttribute("id", this._context.contentId);

    if (this._context.multiple) {
      this.setAttribute("aria-multiselectable", "true");
    } else {
      this.removeAttribute("aria-multiselectable");
    }

    // Handle popover state
    if (this._context.isOpen && !this._previousOpen) {
      // Opening
      try {
        this.showPopover();
      } catch (e) {
        // Popover may already be open
      }
    } else if (!this._context.isOpen && this._previousOpen) {
      // Closing
      try {
        this.hidePopover();
      } catch (e) {
        // Popover may already be hidden
      }
    }

    this._previousOpen = this._context.isOpen;
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _handleToggle = (event: ToggleEvent) => {
    if (event.newState === "open") {
      this.setAttribute("data-state", "open");
      this._positionContent();
      requestAnimationFrame(() => {
        this._focusFirstSelectedOrEnabledItem();
      });
    } else {
      this.setAttribute("data-state", "closed");
      this.removeAttribute("data-side");
      this.removeAttribute("data-align");

      // User closed via Escape or outside click
      if (this._context?.isOpen) {
        this._context.onClose();
      }
    }
  };

  private async _positionContent() {
    if (!this._context?.triggerElement) return;

    const placement = this._getPlacement();

    const { x, y, placement: finalPlacement } = await computePosition(
      this._context.triggerElement,
      this,
      {
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
            apply: ({ availableWidth, availableHeight, rects }) => {
              this.style.setProperty(
                "--select-trigger-width",
                `${rects.reference.width}px`
              );
              this.style.setProperty(
                "--select-trigger-height",
                `${rects.reference.height}px`
              );
              this.style.setProperty(
                "--select-available-width",
                `${availableWidth}px`
              );
              this.style.setProperty(
                "--select-available-height",
                `${availableHeight}px`
              );
            },
          }),
        ],
      }
    );

    this.style.left = `${x}px`;
    this.style.top = `${y}px`;

    // Set data attributes for styling
    const [side, align] = finalPlacement.split("-");
    this.setAttribute("data-side", side);
    this.setAttribute("data-align", align || "center");
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side;
    }
    return `${this.side}-${this.align}` as Placement;
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (!this._context || !this._context.isOpen) return;

    const { key } = e;
    const items = Array.from(this._context.items.values())
      .filter((item) => !item.disabled)
      .sort((a, b) => {
        // Maintain DOM order
        const aIndex = Array.from(this._context.items.keys()).indexOf(a.value);
        const bIndex = Array.from(this._context.items.keys()).indexOf(b.value);
        return aIndex - bIndex;
      });

    const currentIndex = items.findIndex(
      (item) => item.value === this._context.highlightedValue
    );

    switch (key) {
      case "ArrowDown":
        e.preventDefault();
        this._highlightNext(items, currentIndex);
        break;

      case "ArrowUp":
        e.preventDefault();
        this._highlightPrevious(items, currentIndex);
        break;

      case "Home":
        e.preventDefault();
        if (items.length > 0) {
          this._context.setHighlightedValue(items[0].value);
          items[0].element.focus();
        }
        break;

      case "End":
        e.preventDefault();
        if (items.length > 0) {
          const lastItem = items[items.length - 1];
          this._context.setHighlightedValue(lastItem.value);
          lastItem.element.focus();
        }
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        if (this._context.highlightedValue) {
          const isSelected = Array.isArray(this._context.selectedValue)
            ? this._context.selectedValue.includes(this._context.highlightedValue)
            : this._context.selectedValue === this._context.highlightedValue;

          if (this._context.multiple && isSelected) {
            this._context.onDeselect(this._context.highlightedValue);
          } else {
            this._context.onSelect(this._context.highlightedValue);
          }
        }
        break;

      case "Escape":
        e.preventDefault();
        this._context.onClose();
        break;

      case "Tab":
        // Allow tab to close and move focus
        e.preventDefault();
        this._context.onClose();
        break;
    }
  };

  private _highlightNext(items: any[], currentIndex: number) {
    if (items.length === 0) return;

    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    const nextItem = items[nextIndex];

    this._context.setHighlightedValue(nextItem.value);
    nextItem.element.focus();
  }

  private _highlightPrevious(items: any[], currentIndex: number) {
    if (items.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    const prevItem = items[prevIndex];

    this._context.setHighlightedValue(prevItem.value);
    prevItem.element.focus();
  }

  private _focusFirstSelectedOrEnabledItem() {
    if (!this._context) return;

    const items = Array.from(this._context.items.values())
      .filter((item) => !item.disabled);

    if (items.length === 0) return;

    // Try to focus the first selected item
    if (this._context.selectedValue) {
      const selectedValue = Array.isArray(this._context.selectedValue)
        ? this._context.selectedValue[0]
        : this._context.selectedValue;

      const selectedItem = items.find((item) => item.value === selectedValue);
      if (selectedItem) {
        this._context.setHighlightedValue(selectedItem.value);
        selectedItem.element.focus();
        return;
      }
    }

    // Otherwise focus first enabled item
    const firstItem = items[0];
    this._context.setHighlightedValue(firstItem.value);
    firstItem.element.focus();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-content": SelectContent;
  }
}
