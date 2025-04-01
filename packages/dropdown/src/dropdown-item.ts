import { ContextConsumer } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { dropdownContext } from "./dropdown.context";

@customElement("dropdown-item")
export class DropdownItem extends LitElement {
  @state()
  private _consumer = new ContextConsumer(this, {
    context: dropdownContext,
    subscribe: true,
  });

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this._handleClick();
      }
    });
    this.setAttribute("role", "menuitem");
    this.setAttribute("tabindex", "-1");

    this.addEventListener("pointermove", this._handlePointerMove);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this._handleClick();
      }
    });
    this.removeEventListener("pointermove", this._handlePointerMove);
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
  }

  protected render() {
    return html`<slot></slot>`;
  }

  _handlePointerMove() {
    this.focus();
  }

  _handleFocus() {
    this.setAttribute("data-highlighted", "");
    this.setAttribute("tabindex", "0");
  }

  _handleBlur() {
    this.removeAttribute("data-highlighted");
    this.setAttribute("tabindex", "-1");
  }

  _handleClick() {
    this.dispatchEvent(
      new CustomEvent("onSelect", {
        detail: { itemId: this.id },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    this._consumer.value?.onClose("item-selected");
  }
}
