import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext, ComboboxRoot } from "./combobox-root";

/**
 * Trigger button for opening the combobox.
 * Shows the selected value and opens the combobox content on click.
 *
 * With `as-child`, passes behavior to the slotted child element.
 * Without `as-child`, acts as the trigger itself.
 *
 * @element combobox-trigger
 * @slot - Button content (or child element when using as-child)
 *
 * @example
 * ```html
 * <!-- With as-child: behavior passed to button -->
 * <combobox-trigger as-child>
 *   <button>Select framework...</button>
 * </combobox-trigger>
 *
 * <!-- Without as-child: component is the trigger -->
 * <combobox-trigger>Select framework...</combobox-trigger>
 * ```
 */
@customElement("combobox-trigger")
export class ComboboxTrigger extends LitElement {
  /**
   * Pass behavior to slotted child instead of acting as trigger itself
   */
  @property({ type: Boolean, attribute: "as-child" })
  asChild = false;

  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  private _root: ComboboxRoot | null = null;
  private _childElement: HTMLElement | null = null;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);
  private _handleSlotChange = this._onSlotChange.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Find root element
    this._root = this.closest("combobox-root") as ComboboxRoot;

    if (!this.asChild) {
      this._setupSelfAsTrigger();
    }
  }

  protected firstUpdated() {
    // Register trigger element with root
    if (this._root) {
      const triggerElement = this.asChild ? this._childElement : this;
      if (triggerElement) {
        this._root.setTriggerElement(triggerElement);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.asChild) {
      this._cleanupChildTrigger();
    } else {
      this._cleanupSelfAsTrigger();
    }

    // Unregister trigger
    if (this._root) {
      this._root.setTriggerElement(null);
    }
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("_context")) {
      this._updateState();
    }
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
    this.setAttribute("aria-haspopup", "listbox");
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
    child.setAttribute("aria-haspopup", "listbox");
    child.setAttribute("aria-expanded", "false");
    child.setAttribute("data-state", "closed");

    // Register child as trigger
    if (this._root) {
      this._root.setTriggerElement(child);
    }
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
    if (this._context.disabled) return;

    if (this._context.isOpen) {
      this._context.onClose();
    } else {
      this._context.onOpen();
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (this._context.disabled) return;

    if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      if (!this._context.isOpen) {
        this._context.onOpen();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!this._context.isOpen) {
        this._context.onOpen();
      }
    }
  }

  private _updateState() {
    const { isOpen } = this._context;
    const target = this.asChild ? this._childElement : this;

    if (target) {
      target.setAttribute("aria-expanded", String(isOpen));
      target.setAttribute("data-state", isOpen ? "open" : "closed");
      target.setAttribute("aria-controls", this._context.contentId);
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
    "combobox-trigger": ComboboxTrigger;
  }
}
