import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  computePosition,
  flip,
  shift,
  offset,
  size,
  Placement,
} from "@floating-ui/dom";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

/**
 * Dropdown menu content container.
 * Uses Popover API for top-layer rendering and floating-ui for positioning.
 *
 * @element dropdown-content
 * @slot - Menu items (dropdown-item, dropdown-label, dropdown-separator)
 *
 * @cssprop --dropdown-trigger-width - Width of trigger (set automatically)
 * @cssprop --dropdown-trigger-height - Height of trigger (set automatically)
 * @cssprop --dropdown-available-width - Available width (set automatically)
 * @cssprop --dropdown-available-height - Available height (set automatically)
 */
@customElement("dropdown-content")
export class DropdownContent extends LitElement {
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

  private _items: HTMLElement[] = [];

  connectedCallback() {
    super.connectedCallback();

    // Set popover attribute for light dismiss
    this.setAttribute("popover", "auto");
    this.setAttribute("role", "menu");
    this.setAttribute("data-state", "closed");

    // Listen for toggle to position content
    this.addEventListener("toggle", this._handleToggle as EventListener);
    this.addEventListener("keydown", this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("toggle", this._handleToggle as EventListener);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private _handleToggle = (event: ToggleEvent) => {
    if (event.newState === "open") {
      this.setAttribute("data-state", "open");
      this._positionContent();
      this._updateItems();
      // Focus first item after positioning
      requestAnimationFrame(() => {
        this._items[0]?.focus();
      });
    } else {
      this.setAttribute("data-state", "closed");
      this.removeAttribute("data-side");
      this.removeAttribute("data-align");
    }
  };

  private async _positionContent() {
    const dropdownId = this.getAttribute("data-dropdown-id");
    const trigger = document.querySelector(
      `dropdown-trigger[data-dropdown-id="${dropdownId}"]`
    );

    if (!trigger) return;

    const placement = this._getPlacement();

    const {
      x,
      y,
      placement: finalPlacement,
    } = await computePosition(trigger, this, {
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
              "--dropdown-trigger-width",
              `${rects.reference.width}px`
            );
            this.style.setProperty(
              "--dropdown-trigger-height",
              `${rects.reference.height}px`
            );
            this.style.setProperty(
              "--dropdown-available-width",
              `${availableWidth}px`
            );
            this.style.setProperty(
              "--dropdown-available-height",
              `${availableHeight}px`
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
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side;
    }
    return `${this.side}-${this.align}`;
  }

  private _updateItems() {
    this._items = Array.from(
      this.querySelectorAll("dropdown-item:not([data-disabled])")
    ) as HTMLElement[];
  }

  private _handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this._focusNext();
        break;
      case "ArrowUp":
        event.preventDefault();
        this._focusPrevious();
        break;
      case "Home":
        event.preventDefault();
        this._items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        this._items[this._items.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        this.hidePopover();
        break;
    }
  };

  private _focusNext() {
    const currentIndex = this._items.findIndex(
      (item) => item === document.activeElement
    );
    const nextIndex =
      currentIndex === -1 || currentIndex === this._items.length - 1
        ? 0
        : currentIndex + 1;
    this._items[nextIndex]?.focus();
  }

  private _focusPrevious() {
    const currentIndex = this._items.findIndex(
      (item) => item === document.activeElement
    );
    const prevIndex =
      currentIndex <= 0 ? this._items.length - 1 : currentIndex - 1;
    this._items[prevIndex]?.focus();
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-content": DropdownContent;
  }
}
