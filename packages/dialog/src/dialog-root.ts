import { LitElement, PropertyValues, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  DIALOG_ATTRIBUTES,
  DIALOG_EVENTS_RECORD,
  DIALOG_EVENTS_NAME,
  dialogTags,
} from "./dialog.context";
import type { CustomDialogEvent } from "./dialog.context";
import { nextId } from "./randomId";

@customElement("dialog-root")
export class DialogRoot extends LitElement {
  /**
   * The controlled display of tooltip content
   * @default false
   */
  @property({
    attribute: "open",
    type: Boolean,
    converter: {
      fromAttribute: (attrValue: string | null) => {
        if (attrValue === null) return false;
        if (attrValue === "") return true;
        return attrValue === "true";
      },
      toAttribute: (value: boolean | null) => {
        return value ? "true" : "false";
      },
    },
  })
  accessor open = false;

  /**
    This monitors is dialog is opened or not.
    Unlike open (which tracks open attribute from the user/outside environment)
  */
  @state()
  accessor currentDialogOpenState = false;

  connectedCallback() {
    super.connectedCallback();
    const DATA_DIALOG_ID = nextId();

    this.setAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY, DATA_DIALOG_ID);
    this.querySelector(dialogTags.TRIGGER)?.setAttribute(
      DIALOG_ATTRIBUTES.DATA_ID_KEY,
      DATA_DIALOG_ID
    );
    this.querySelector(dialogTags.PORTAL)?.setAttribute(
      DIALOG_ATTRIBUTES.DATA_ID_KEY,
      DATA_DIALOG_ID
    );

    document.addEventListener(DIALOG_EVENTS_NAME.OPEN, this.handleOpenAction);
    document.addEventListener(DIALOG_EVENTS_NAME.CLOSE, this.handleCloseAction);
  }

  protected willUpdate(_changedProperties: PropertyValues<this>): void {
    if (
      _changedProperties.has("open") &&
      _changedProperties.get("open") !== this.open
    ) {
      this.open
        ? this.handleOpenAction(
            DIALOG_EVENTS_RECORD.OPEN({
              dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY),
            })
          )
        : this.handleCloseAction(
            DIALOG_EVENTS_RECORD.CLOSE({
              dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY),
            })
          );
    }
    if (
      _changedProperties.has("currentDialogOpenState") &&
      _changedProperties.get("open") !== this.open
    ) {
      this.emitOpenChangeEvent();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener(
      DIALOG_EVENTS_NAME.OPEN,
      this.handleOpenAction
    );
    document.removeEventListener(
      DIALOG_EVENTS_NAME.CLOSE,
      this.handleCloseAction
    );
  }

  protected render() {
    return html` <slot></slot> `;
  }

  emitOpenChangeEvent() {
    this.dispatchEvent(
      DIALOG_EVENTS_RECORD.STATE_CHANGE({
        open: this.currentDialogOpenState,
        dialogDataId: this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY),
      })
    );
  }

  private checkSameDialogId(event: CustomDialogEvent): boolean {
    return (
      this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY) ===
      event.detail.dialogDataId
    );
  }

  handleOpenAction = (event: Event) => {
    const dialogEvent = event as CustomDialogEvent;
    if (!this.checkSameDialogId(dialogEvent)) {
      return;
    }
    this.currentDialogOpenState = true;
  };

  handleCloseAction = (event: Event) => {
    const dialogEvent = event as CustomDialogEvent;
    if (!this.checkSameDialogId(dialogEvent)) {
      return;
    }
    this.currentDialogOpenState = false;
    (this.querySelector(dialogTags.TRIGGER) as HTMLElement).focus();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-root": DialogRoot;
  }
}
