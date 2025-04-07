import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { SignalWatcher } from "@lit-labs/signals";
import { DIALOG_ATTRIBUTES, DIALOG_EVENTS_RECORD } from "./dialog.context";

@customElement("dialog-trigger")
export class DialogTrigger extends SignalWatcher(LitElement) {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
    this.setAttribute("aria-haspopup", "dialog");
    this.setAttribute("aria-controls", "contentId");

    // dynamic attributes
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("data-state", "closed");

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
    return html` <slot></slot> `;
  }

  openDialogEvent() {
    this.dispatchEvent(
      DIALOG_EVENTS_RECORD.OPEN({
        dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY),
      })
    );
    this.setAttribute("aria-expanded", "true");
    this.setAttribute("data-state", "open");
  }

  closeDialogEvent() {
    this.dispatchEvent(
      DIALOG_EVENTS_RECORD.CLOSE({
        dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY),
      })
    );
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("data-state", "closed");
  }

  clickHandler = () => {
    this.openDialogEvent();
  };

  keyDownHandler = (event: KeyboardEvent) => {
    // toggle for SPACE and ENTER key
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent page scroll on spacebar
      this.openDialogEvent();
    }

    // close for ESCAPE key
    if (event.key === "Escape") {
      event.preventDefault();
      this.closeDialogEvent();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-trigger": DialogTrigger;
  }
}
