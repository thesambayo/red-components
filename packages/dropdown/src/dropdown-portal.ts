import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  CustomDropdownEvent,
  DROPDOWN_ATTRIBUTES,
  DROPDOWN_EVENTS_NAME,
  DROPDOWN_EVENTS_RECORD,
  dropdownTags,
} from "./dropdown.context";
import { DropdownContent } from "./dropdown-content";

/**
 * DropdownPortal - Renders its children into a specified DOM container
 */
@customElement("dropdown-portal")
export class DropdownPortal extends LitElement {
  static styles = css`
    :host {
      display: none !important;
    }
  `;

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
    // 2FA for display:none
    this.style.display = "none";

    // Create a placeholder to maintain original position
    const positionComment = document.createComment("dropdown-portal-anchor");
    this.parentNode?.insertBefore(positionComment, this);

    // Create the containerElement, so we dont query the DOM everytime we want to use it
    this.containerElement = this.getContainerElement();

    // Initialize portal to closed state
    this.updatePortal();

    // Listen for dropdown state changes
    document.addEventListener(
      DROPDOWN_EVENTS_NAME.STATE_CHANGE,
      this.handleDropdownStateChangeEvent
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
      DROPDOWN_EVENTS_NAME.STATE_CHANGE,
      this.handleDropdownStateChangeEvent
    );
  }

  render() {
    return html` <slot></slot> `;
  }

  private handleDropdownStateChangeEvent = (event: Event) => {
    const dropdownEvent = event as CustomDropdownEvent;

    if (
      this.getAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY) !==
      dropdownEvent.detail.dropdownDataId
    ) {
      return;
    }
    this._open = dropdownEvent.detail.open ?? false;
    this.requestUpdate();
  };

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
      const clonedContent = this.cloneElementWithEventListeners(child);
      // append portal child
      this.containerElement.appendChild(clonedContent);
    });
  }

  // Check if this is a component we care about
  private isTrackedComponent(element: Element): boolean {
    const trackedTags = [
      "dropdown-item",
      "dropdown-content",
      // Add others as needed
    ];

    return trackedTags.includes(element.tagName.toLowerCase());
  }

  // Clone an element and its children, preserving event listeners
  private cloneElementWithEventListeners(original: Element): Element {
    // Basic node clone
    const clone = original.cloneNode(false) as Element;
    if (original.tagName.toLowerCase() === dropdownTags.CONTENT.toLowerCase()) {
      const { side, sideOffset, align, alignOffset } =
        original as DropdownContent;
      (clone as DropdownContent).side = side;
      (clone as DropdownContent).sideOffset = sideOffset;
      (clone as DropdownContent).align = align;
      (clone as DropdownContent).alignOffset = alignOffset;
    }

    clone.setAttribute(
      DROPDOWN_ATTRIBUTES.PORTALLED_ID_KEY,
      this.getAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY) ?? ""
    );

    // Set up event forwarding if this is a tracked component
    if (this.isTrackedComponent(original)) {
      this.setupEventForwarding(original as HTMLElement, clone as HTMLElement);
    }

    // Clone all child nodes recursively
    original.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        clone.appendChild(
          this.cloneElementWithEventListeners(child as Element)
        );
      } else {
        clone.appendChild(child.cloneNode(true));
      }
    });

    return clone;
  }

  // Set up event forwarding between original and clone
  private setupEventForwarding(original: HTMLElement, clone: HTMLElement) {
    if (clone.tagName.toLowerCase() === dropdownTags.ITEM.toLowerCase()) {
      const handleSelectDropdownItemAction = () => {
        original.dispatchEvent(
          DROPDOWN_EVENTS_RECORD.ITEM_SELECTED({
            dropdownDataId: this.getAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY),
          })
        );
        clone.dispatchEvent(
          DROPDOWN_EVENTS_RECORD.CLOSE({
            dropdownDataId: this.getAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY),
          })
        );
      };
      clone.addEventListener("click", () => {
        handleSelectDropdownItemAction();
      });
      clone.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          handleSelectDropdownItemAction();
        }
      });
    }
  }

  // cleanups
  private removePortalledContent() {
    this.containerElement
      .querySelectorAll(
        `[${DROPDOWN_ATTRIBUTES.PORTALLED_ID_KEY}="${this.getAttribute(
          DROPDOWN_ATTRIBUTES.DATA_ID_KEY
        )}"]`
      )
      .forEach((portalledElement) => {
        portalledElement.remove();
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-portal": DropdownPortal;
  }
}
