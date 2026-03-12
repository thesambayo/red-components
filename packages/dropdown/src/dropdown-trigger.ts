import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Trigger button for opening the dropdown.
 *
 * With `as-child`, passes behavior to the slotted child element.
 * Without `as-child`, acts as the trigger itself.
 *
 * @element dropdown-trigger
 * @slot - Button content (or child element when using as-child)
 *
 * @example
 * ```html
 * <!-- With as-child: behavior passed to button -->
 * <dropdown-trigger as-child>
 *   <button>Open Menu</button>
 * </dropdown-trigger>
 *
 * <!-- Without as-child: component is the trigger -->
 * <dropdown-trigger>Open Menu</dropdown-trigger>
 * ```
 */
@customElement("dropdown-trigger")
export class DropdownTrigger extends LitElement {
  /**
   * Pass behavior to slotted child instead of acting as trigger itself
   */
  @property({ type: Boolean, attribute: "as-child" })
  asChild = false;

  /** Reference to the child element when using as-child */
  private _childElement: HTMLElement | null = null;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);
  private _handleSlotChange = this._onSlotChange.bind(this);

  connectedCallback() {
    super.connectedCallback();

    if (!this.asChild) {
      this._setupSelfAsTrigger();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.asChild) {
      this._cleanupChildTrigger();
    } else {
      this._cleanupSelfAsTrigger();
    }
  }

  private _getContent(): HTMLElement | null {
    const dropdownId = this.getAttribute("data-dropdown-id");
    if (!dropdownId) return null;
    return document.getElementById(`${dropdownId}-content`);
  }

  private _setupSelfAsTrigger() {
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    // Set accessibility attributes
    this.setAttribute("role", "button");
    this.setAttribute("aria-haspopup", "menu");
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("data-state", "closed");
  }

  private _cleanupSelfAsTrigger() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _setupChildTrigger(child: HTMLElement) {
    this._childElement = child;

    // Add event listeners to child
    child.addEventListener("click", this._handleClick);
    child.addEventListener("keydown", this._handleKeyDown);

    // Set accessibility attributes on child
    child.setAttribute("aria-haspopup", "menu");
    child.setAttribute("aria-expanded", "false");
    child.setAttribute("data-state", "closed");
  }

  private _cleanupChildTrigger() {
    if (this._childElement) {
      this._childElement.removeEventListener("click", this._handleClick);
      this._childElement.removeEventListener("keydown", this._handleKeyDown);
      this._childElement = null;
    }
  }

  private _onSlotChange(event: Event) {
    if (!this.asChild) return;

    const slot = event.target as HTMLSlotElement;
    const children = slot.assignedElements();

    // Cleanup previous child
    this._cleanupChildTrigger();

    // Setup new child
    if (children.length > 0) {
      const child = children[0] as HTMLElement;
      this._setupChildTrigger(child);
    }
  }

  private _onClick() {
    const content = this._getContent();
    if (content && "togglePopover" in content) {
      content.togglePopover();
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      const content = this._getContent();
      if (content && "showPopover" in content) {
        content.showPopover();
      }
    }
  }

  /**
   * Update state attributes on the appropriate element (self or child)
   */
  updateState(isOpen: boolean) {
    const target = this.asChild ? this._childElement : this;
    if (target) {
      target.setAttribute("aria-expanded", String(isOpen));
      target.setAttribute("data-state", isOpen ? "open" : "closed");
    }
  }

  /**
   * Get the actual trigger element (self or child)
   */
  getTriggerElement(): HTMLElement | null {
    return this.asChild ? this._childElement : this;
  }

  protected render() {
    return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-trigger": DropdownTrigger;
  }
}
