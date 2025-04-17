import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { DIALOG_EVENTS_RECORD, DIALOG_ATTRIBUTES } from "./dialog.context";

/**
 * should be useable as
    1. <dialog-close></dialog-close>
 *  or 2. <button data-dialog-close><button>
 * we will be adding eventlisteners to the ported clones
 */
@customElement("dialog-close")
export class DialogClose extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
    this.addEventListener("click", this.handleDialogCloseEvent);
    this.addEventListener("keydown", this.keyDownHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleDialogCloseEvent);
    this.removeEventListener("keydown", this.keyDownHandler);
  }

  protected render() {
    return html` <slot></slot>`;
  }

  private handleDialogCloseEvent = () => {
    this.dispatchEvent(
      DIALOG_EVENTS_RECORD.CLOSE({
        dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.PORTALLED_ID_KEY),
      })
    );
  };

  private keyDownHandler = (event: KeyboardEvent) => {
    // trigger with SPACE and ENTER key
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent page scroll on spacebar
      this.handleDialogCloseEvent();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-close": DialogClose;
  }
}
