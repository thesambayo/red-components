import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Trigger button for opening the dropdown.
 *
 * @element dropdown-trigger
 * @slot - Button content
 */
@customElement("dropdown-trigger")
export class DropdownTrigger extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    // Accessibility
    this.setAttribute("role", "button");
    this.setAttribute("aria-haspopup", "menu");
    this.setAttribute("aria-expanded", "false");

    // Make focusable
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private _getContent(): HTMLElement | null {
    const dropdownId = this.getAttribute("data-dropdown-id");
    if (!dropdownId) return null;
    return document.getElementById(`${dropdownId}-content`);
  }

  private _handleClick = () => {
    const content = this._getContent();
    if (content && "togglePopover" in content) {
      content.togglePopover();
    }
  };

  private _handleKeydown = (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      const content = this._getContent();
      if (content && "showPopover" in content) {
        content.showPopover();
      }
    }
  };

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-trigger": DropdownTrigger;
  }
}
