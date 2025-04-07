import { LitElement, PropertyValues, html } from "lit";
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
  /**
      @description  destination is the id of the element you want to be the container of the portal content.
      @default document.body
    */
  @property({ type: String }) container = "body";
  @property({ type: Boolean, state: true }) _open = false;

  /**
    @description containerElement is the element queried from the DOM using the container property.
    It is expected to always have a value (with document.body being the backup if user-given container
    is not in the DOM)

  */
  @state() private containerElement!: HTMLElement;
  @state() private observer: MutationObserver | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.style.display = "none";

    // Create a placeholder to maintain original position
    const positionComment = document.createComment("dialog-portal-anchor");
    this.parentNode?.insertBefore(positionComment, this);

    // Create the containerElement, so we dont query the DOM everytime we want to use it
    // containerElement is not expected to change after initial render AT THE MOMENT
    this.containerElement = this.getContainerElement();

    // Initialize portal to closed state
    this.updatePortal();

    // Listen for dialog state changes
    document.addEventListener(
      DIALOG_EVENTS_NAME.STATE_CHANGE,
      this.handleDialogStateChangeEvent
    );
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    // if (changedProperties.has("container")) {
    //   this.containerElement = this.getContainerElement();
    // }
    if (changedProperties.has("_open") || changedProperties.has("container")) {
      this.updatePortal();
    }
  }

  disconnectedCallback() {
    // Clean up the portal when component is removed
    this.removePortalledContent();

    // Remove the observer
    if (this.observer) {
      this.observer.disconnect();
    }

    super.disconnectedCallback();

    document.removeEventListener(
      DIALOG_EVENTS_NAME.STATE_CHANGE,
      this.handleDialogStateChangeEvent
    );
  }

  render() {
    return html` <slot></slot> `;
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

  private updatePortal() {
    // Clean up the portal when component is removed
    this.removePortalledContent();

    // Only updatePortalledContent to DOM if open
    if (this._open) {
      // Create content observer if not already created
      if (!this.observer) {
        this.observer = new MutationObserver(() => {
          this.updatePortalledContent();
        });
      }

      // Start observing this element for slotted content changes
      this.observer.observe(this, { childList: true, subtree: true });

      // Initial content update
      this.updatePortalledContent();
    }
  }

  private updatePortalledContent() {
    // Clone all child nodes and add to portal
    Array.from(this.children).forEach((child) => {
      const clone = child.cloneNode(true) as Element;
      clone.setAttribute(
        DIALOG_ATTRIBUTES.PORTALLED_ID_KEY,
        this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY) ?? ""
      );

      // add attribute to dialog-close and [data-dialog-close]
      // adding this means on click we dont have to find parent's data-dialog-portalled-id
      clone
        .querySelectorAll(
          `${dialogTags.CLOSE}, [${DIALOG_ATTRIBUTES.DATA_DIALOG_CLOSE}]`
        )
        .forEach((dialogClose) => {
          if (dialogClose.tagName === dialogTags.CLOSE.toUpperCase()) {
            dialogClose.setAttribute("tabindex", "0");
          }
          dialogClose.setAttribute(
            DIALOG_ATTRIBUTES.PORTALLED_ID_KEY,
            this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY) ?? ""
          );
          dialogClose.addEventListener("click", this.handleDialogCloseEvent);
        });

      // append portal child
      this.containerElement.appendChild(clone);
    });
  }

  // cleanups
  private removePortalledContent() {
    this.containerElement
      .querySelectorAll(
        `[${DIALOG_ATTRIBUTES.PORTALLED_ID_KEY}="${this.getAttribute(
          DIALOG_ATTRIBUTES.DATA_ID_KEY
        )}"]`
      )
      .forEach((portalledElement) => {
        // get elements with dialog-close tags and data-dialog-close attributes
        // for cleanup event listeners

        portalledElement
          .querySelectorAll(
            `${dialogTags.CLOSE}, [${DIALOG_ATTRIBUTES.DATA_DIALOG_CLOSE}]`
          )
          .forEach((dialogClose) => {
            dialogClose.removeEventListener(
              "click",
              this.handleDialogCloseEvent
            );
          });

        // remove actual portalled elements
        portalledElement.remove();
      });
  }

  handleDialogStateChangeEvent = (event: Event) => {
    const dialogEvent = event as CustomDialogEvent;

    if (
      this.getAttribute(DIALOG_ATTRIBUTES.DATA_ID_KEY) !==
      dialogEvent.detail.dialogDataId
    ) {
      return;
    }
    this._open = dialogEvent.detail.open ?? false;
    this.requestUpdate();
  };

  handleDialogCloseEvent = (event: Event) => {
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
