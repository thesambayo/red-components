import { css, html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { DIALOG_EVENTS_RECORD, DIALOG_ATTRIBUTES } from "./dialog.context";

@customElement("dialog-overlay")
export class DialogOverlay extends LitElement {
  static styles = css`
    :host {
      pointer-events: auto;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("data-state", "true");
    this.setAttribute("aria-hidden", "true");
    this.setAttribute("data-aria-hidden", "true");
    this.addEventListener("click", this.closeDialogEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setAttribute("data-state", "false");
    this.setAttribute("aria-hidden", "false");
    this.setAttribute("data-aria-hidden", "false");
    this.removeEventListener("click", this.closeDialogEvent);
  }

  protected render() {
    return html`${nothing}`;
  }

  closeDialogEvent() {
    this.dispatchEvent(
      DIALOG_EVENTS_RECORD.CLOSE({
        dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.PORTALLED_ID_KEY),
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-overlay": DialogOverlay;
  }
}
