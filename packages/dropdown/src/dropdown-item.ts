import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DROPDOWN_EVENTS } from "./dropdown.context";

/**
 * A selectable item within the dropdown menu.
 *
 * @element dropdown-item
 * @slot - Item content
 *
 * @fires dropdown:item-select - When item is selected
 */
@customElement("dropdown-item")
export class DropdownItem extends LitElement {
  /**
   * Value associated with this item
   */
  @property({ type: String })
  value?: string;

  /**
   * Whether the item is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("role", "menuitem");
    this.setAttribute("tabindex", "-1");
    this._updateDisabledState();

    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeydown);
    this.addEventListener("pointerenter", this._handlePointerEnter);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeydown);
    this.removeEventListener("pointerenter", this._handlePointerEnter);
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("disabled")) {
      this._updateDisabledState();
    }
  }

  private _updateDisabledState() {
    if (this.disabled) {
      this.setAttribute("data-disabled", "");
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("data-disabled");
      this.removeAttribute("aria-disabled");
    }
  }

  private _handleClick = () => {
    if (this.disabled) return;
    this._select();
  };

  private _handleKeydown = (event: KeyboardEvent) => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._select();
    }
  };

  private _handlePointerEnter = () => {
    if (!this.disabled) {
      this.focus();
    }
  };

  private _select() {
    const content = this.closest("dropdown-content");
    const dropdownId = content?.getAttribute("data-dropdown-id");

    // Dispatch select event
    this.dispatchEvent(
      new CustomEvent(DROPDOWN_EVENTS.ITEM_SELECT, {
        bubbles: true,
        composed: true,
        detail: {
          dropdownId,
          value: this.value,
        },
      })
    );

    // Close the dropdown
    if (content && "hidePopover" in content) {
      (content as HTMLElement).hidePopover();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-item": DropdownItem;
  }
}
