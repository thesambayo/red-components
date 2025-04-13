import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import {
  DROPDOWN_ATTRIBUTES,
  DROPDOWN_EVENTS_RECORD,
} from "./dropdown.context";

@customElement("dropdown-trigger")
export class DropdownTrigger extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-haspopup", "menu");
    this.setAttribute("tabindex", "0");

    // Handle click for toggle behavior
    this.addEventListener("click", this.clickHandler);
    // Handle keyboard events
    this.addEventListener("keydown", this.keyDownHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.clickHandler);
    this.removeEventListener("keydown", this.keyDownHandler);
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private clickHandler = () => {
    this.openDropdownEvent();
    // maybe toggle
  };

  private keyDownHandler = (event: KeyboardEvent) => {
    // toggle for SPACE and ENTER key
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent page scroll on spacebar
      this.openDropdownEvent();
    }
  };

  private openDropdownEvent() {
    this.dispatchEvent(
      DROPDOWN_EVENTS_RECORD.OPEN({
        dropdownDataId: this.getAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY),
      })
    );
    this.setAttribute("aria-expanded", "true");
    this.setAttribute("data-state", "open");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-trigger": DropdownTrigger;
  }
}
