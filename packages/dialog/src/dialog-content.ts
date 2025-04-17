import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { DIALOG_ATTRIBUTES, DIALOG_EVENTS_RECORD } from "./dialog.context";

@customElement("dialog-content")
export class DialogContent extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
    requestAnimationFrame(() => {
      if (this.hasAttribute(DIALOG_ATTRIBUTES.PORTALLED_ID_KEY)) {
        this.focus();
        this.addEventListener("keydown", this.handleKeyDown);
      }
    });
  }

  disconnectedCallback() {
    this.removeEventListener("keydown", this.handleKeyDown);
    super.disconnectedCallback();
  }

  protected render() {
    return html` <slot></slot> `;
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.closeDropdownEvent();
        break;
    }
  }

  private closeDropdownEvent() {
    this.dispatchEvent(
      DIALOG_EVENTS_RECORD.CLOSE({
        dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.PORTALLED_ID_KEY),
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-content": DialogContent;
  }
}
