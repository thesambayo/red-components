import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { dropdownContext } from "./dropdown.context";

@customElement("dropdown-trigger")
export class DropdownTrigger extends LitElement {
  @state()
  _consumer = new ContextConsumer(this, {
    context: dropdownContext,
    subscribe: true,
  });

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-haspopup", "menu");
    this.setAttribute("tabindex", "0");

    // Handle click for toggle behavior
    this.addEventListener("click", () => {
      if (this._consumer.value?.isOpen) {
        this._consumer.value.onClose("click");
      } else {
        this._consumer.value?.onOpen("click");
      }
    });

    // Handle keyboard events
    this.addEventListener("keydown", (event) => {
      // toggle for SPACE and ENTER key
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault(); // Prevent page scroll on spacebar
        if (this._consumer.value?.isOpen) {
          this._consumer.value?.onClose("keyboard");
        } else {
          this._consumer.value?.onOpen("keyboard");
        }
      }

      // close for ESCAPE key
      if (event.key === "Escape") {
        event.preventDefault();
        if (this._consumer.value?.isOpen) {
          this._consumer.value?.onClose("keyboard");
        }
      }
    });

    // click outside close event
    document.addEventListener("click", (event) => {
      if (
        !this.contains(event.target as Node) &&
        this._consumer.value?.isOpen
      ) {
        this._consumer.value?.onClose("click-outside");
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
