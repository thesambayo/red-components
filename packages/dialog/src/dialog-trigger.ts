import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { DIALOG_ATTRIBUTES, DIALOG_EVENTS_RECORD } from "./dialog.context";

@customElement("dialog-trigger")
export class DialogTrigger extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
    this.setAttribute("aria-haspopup", "dialog");
    // to fix
    this.setAttribute("aria-controls", "contentId");
    // dynamic attributes
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("data-state", "closed");

    this.addEventListener("click", this.clickHandler);
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

  private clickHandler = () => {
    this.openDialogEvent();
  };

  private keyDownHandler = (event: KeyboardEvent) => {
    //  trigger with SPACE and ENTER key
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent page scroll on spacebar
      this.openDialogEvent();
    }
  };

  private openDialogEvent() {
    this.dispatchEvent(
      DIALOG_EVENTS_RECORD.OPEN({
        dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY),
      })
    );
    this.setAttribute("aria-expanded", "true");
    this.setAttribute("data-state", "open");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-trigger": DialogTrigger;
  }
}
