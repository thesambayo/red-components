import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  CustomDialogEvent,
  DIALOG_ATTRIBUTES,
  DIALOG_EVENTS_NAME,
  DIALOG_EVENTS_RECORD,
  dialogTags,
} from "./dialog.context";

/**
 * DialogPortal - Renders its children into a specified DOM container
 */
@customElement("dialog-portal")
export class DialogPortal extends LitElement {
  static styles = css`
    :host {
      display: none !important;
    }
  `;

  /**
      @description destination is the id of the element you want to be the container of the portal content.
      @default document.body
    */
  @property({ type: String }) container = "body";
  @state() _open = false;

  /**
    @description containerElement is the element queried from the DOM using the container property.
    It is expected to always have a value (with document.body being the backup if user-given container
    is not in the DOM)
  */
  @state() private containerElement!: HTMLElement;

  // Keep track of original children to restore them later
  private originalChildren: Element[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.style.display = "none";

    // Find container element
    this.containerElement = this.getContainerElement();

    // Listen for the dialog state change event
    document.addEventListener(
      DIALOG_EVENTS_NAME.STATE_CHANGE,
      this.handleDialogStateChangeEvent
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      DIALOG_EVENTS_NAME.STATE_CHANGE,
      this.handleDialogStateChangeEvent
    );

    // cleanup portalled children and ensure they are returned to the original component
    this._moveChildrenBack();

    super.disconnectedCallback();
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("_open")) {
      if (this._open) {
        this._moveChildrenToContainer();
      } else {
        this._moveChildrenBack();
      }
    }
  }

  render() {
    return html`<slot></slot>`;
  }

  /**
   * @description Returns the element to which the content should be "portal-ed"
   * @returns {HTMLElement}
   */
  private getContainerElement(): HTMLElement {
    // no container set
    if (!this.container || this.container.trim().length === 0) {
      return document.body;
    }
    // container is default body
    if (this.container === "body") {
      return document.body;
    }
    //  container cannot be found
    return document.getElementById(this.container) ?? document.body;
  }

  private handleDialogStateChangeEvent = (event: Event) => {
    const { detail } = event as CustomDialogEvent;
    if (
      this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY) !== detail.dialogDataId
    ) {
      return;
    }
    this._open = detail.open ?? false;
  };

  private _moveChildrenToContainer = () => {
    if (!this.containerElement) return;

    // Store reference to original children
    this.originalChildren = Array.from(this.children);

    // Move children to portal container
    this.originalChildren.forEach((child) => {
      child.setAttribute(
        DIALOG_ATTRIBUTES.PORTALLED_ID_KEY,
        this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY) ?? ""
      );

      // add attribute to dialog-close and [data-dialog-close]
      // adding this means on click we dont have to find parent's data-dialog-portalled-id
      child
        .querySelectorAll(
          `${dialogTags.CLOSE}, [${DIALOG_ATTRIBUTES.DATA_DIALOG_CLOSE}]`
        )
        .forEach((dialogClose) => {
          dialogClose.setAttribute(
            DIALOG_ATTRIBUTES.PORTALLED_ID_KEY,
            this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY) ?? ""
          );
          // for <element data-dialog-close>{xxxx}</element>
          if (dialogClose.tagName !== dialogTags.CLOSE.toUpperCase()) {
            dialogClose.addEventListener("click", this.handleDialogCloseEvent);
          }
        });

      this.containerElement.appendChild(child);
    });
  };

  private _moveChildrenBack = () => {
    // Get all current children in the portal
    const currentPortalledChildren = [...this.originalChildren];

    // Move them back to the component
    currentPortalledChildren.forEach((child) => {
      child.removeAttribute(DIALOG_ATTRIBUTES.PORTALLED_ID_KEY);

      child
        .querySelectorAll(
          `${dialogTags.CLOSE}, [${DIALOG_ATTRIBUTES.DATA_DIALOG_CLOSE}]`
        )
        .forEach((dialogClose) => {
          dialogClose.removeAttribute(DIALOG_ATTRIBUTES.PORTALLED_ID_KEY);
          // for <element data-dialog-close>{xxxx}</element>
          if (dialogClose.tagName !== dialogTags.CLOSE.toUpperCase()) {
            dialogClose.removeEventListener(
              "click",
              this.handleDialogCloseEvent
            );
          }
        });
      this.appendChild(child);
    });
    // empty the original children array
    this.originalChildren = [];
  };

  private handleDialogCloseEvent = (event: Event) => {
    const dialogCloseElement = event.currentTarget as HTMLElement;
    dialogCloseElement.dispatchEvent(
      DIALOG_EVENTS_RECORD.CLOSE({
        dialogDataId: dialogCloseElement.getAttribute(
          DIALOG_ATTRIBUTES.PORTALLED_ID_KEY
        ),
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-portal": DialogPortal;
  }
}
