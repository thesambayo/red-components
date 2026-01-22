import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { generateDropdownId, DROPDOWN_EVENTS } from "./dropdown.context";

/**
 * Root container for dropdown menu.
 * Coordinates trigger and content elements.
 *
 * @element dropdown-root
 * @slot - Contains dropdown-trigger and dropdown-content
 *
 * @fires dropdown:open - When dropdown opens
 * @fires dropdown:close - When dropdown closes
 */
@customElement("dropdown-root")
export class DropdownRoot extends LitElement {
  /** Unique ID for this dropdown instance */
  @state()
  private _dropdownId = generateDropdownId();

  /** Current open state */
  @state()
  accessor isOpen = false;

  /**
   * Controlled open state
   */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  private _trigger: HTMLElement | null = null;
  private _content: HTMLElement | null = null;

  get dropdownId() {
    return this._dropdownId;
  }

  get trigger() {
    return this._trigger;
  }

  get content() {
    return this._content;
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupChildren();
  }

  private _setupChildren() {
    // Find and configure trigger
    this._trigger = this.querySelector("dropdown-trigger");
    if (this._trigger) {
      this._trigger.setAttribute("data-dropdown-id", this._dropdownId);
    }

    // Find and configure content
    this._content = this.querySelector("dropdown-content");
    if (this._content) {
      this._content.setAttribute("data-dropdown-id", this._dropdownId);
      this._content.setAttribute("id", `${this._dropdownId}-content`);

      // Listen for toggle events from popover
      this._content.addEventListener("toggle", this._handleContentToggle as EventListener);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._content) {
      this._content.removeEventListener("toggle", this._handleContentToggle as EventListener);
    }
  }

  private _handleContentToggle = (event: ToggleEvent) => {
    const wasOpen = this.isOpen;
    this.isOpen = event.newState === "open";

    // Update trigger aria-expanded
    this._trigger?.setAttribute("aria-expanded", String(this.isOpen));

    if (this.isOpen && !wasOpen) {
      this._dispatchOpen();
    } else if (!this.isOpen && wasOpen) {
      this._dispatchClose();
      // Return focus to trigger
      this._trigger?.focus();
    }
  };

  private _dispatchOpen() {
    this.dispatchEvent(
      new CustomEvent(DROPDOWN_EVENTS.OPEN, {
        bubbles: true,
        composed: true,
        detail: { dropdownId: this._dropdownId },
      })
    );
  }

  private _dispatchClose() {
    this.dispatchEvent(
      new CustomEvent(DROPDOWN_EVENTS.CLOSE, {
        bubbles: true,
        composed: true,
        detail: { dropdownId: this._dropdownId },
      })
    );
  }

  /** Programmatically close the dropdown */
  close() {
    if (this._content && "hidePopover" in this._content) {
      (this._content as HTMLElement).hidePopover();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-root": DropdownRoot;
  }
}
