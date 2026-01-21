import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Trigger element that opens the alert dialog on click.
 *
 * With `as-child`, passes behavior to the slotted child element.
 * Without `as-child`, acts as the trigger itself.
 *
 * @element alert-dialog-trigger
 *
 * @example
 * ```html
 * <!-- With as-child: behavior passed to button -->
 * <alert-dialog-trigger as-child>
 *   <button>Delete Item</button>
 * </alert-dialog-trigger>
 *
 * <!-- Without as-child: component is the trigger -->
 * <alert-dialog-trigger>Delete Item</alert-dialog-trigger>
 * ```
 */
@customElement("alert-dialog-trigger")
export class AlertDialogTrigger extends LitElement {
  /**
   * Pass behavior to slotted child instead of rendering wrapper
   */
  @property({ type: Boolean, attribute: "as-child" })
  asChild = false;

  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /** Reference to the child element when using as-child */
  private _childElement: HTMLElement | null = null;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);
  private _handleSlotChange = this._onSlotChange.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Register with root context
    if (this.asChild) {
      // Will register child element after slot change
    } else {
      this._rootContext?.onTriggerMount(this);
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

  protected willUpdate() {
    this._updateAttributes();
  }

  private _setupSelfAsTrigger() {
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    // Set accessibility attributes
    this.setAttribute("aria-haspopup", "dialog");
  }

  private _cleanupSelfAsTrigger() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _setupChildTrigger(child: HTMLElement) {
    this._childElement = child;

    // Register child with root context
    this._rootContext?.onTriggerMount(child);

    // Add event listeners to child
    child.addEventListener("click", this._handleClick);
    child.addEventListener("keydown", this._handleKeyDown);

    // Set accessibility attributes on child
    child.setAttribute("aria-haspopup", "dialog");

    // Update attributes on child
    this._updateChildAttributes();
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

  private _updateAttributes() {
    if (!this._rootContext) return;

    if (this.asChild) {
      this._updateChildAttributes();
    } else {
      this._updateSelfAttributes();
    }
  }

  private _updateSelfAttributes() {
    if (!this._rootContext) return;

    this.setAttribute(
      "aria-expanded",
      this._rootContext.open ? "true" : "false"
    );
    this.setAttribute("data-state", this._rootContext.open ? "open" : "closed");

    if (this._rootContext.dialogElement) {
      const dialogId =
        this._rootContext.dialogElement.id || this._rootContext.titleId;
      if (dialogId) {
        this.setAttribute("aria-controls", dialogId);
      }
    }
  }

  private _updateChildAttributes() {
    if (!this._rootContext || !this._childElement) return;

    this._childElement.setAttribute(
      "aria-expanded",
      this._rootContext.open ? "true" : "false"
    );
    this._childElement.setAttribute(
      "data-state",
      this._rootContext.open ? "open" : "closed"
    );

    if (this._rootContext.dialogElement) {
      const dialogId =
        this._rootContext.dialogElement.id || this._rootContext.titleId;
      if (dialogId) {
        this._childElement.setAttribute("aria-controls", dialogId);
      }
    }
  }

  private _onClick() {
    this._rootContext?.onOpenChange(true);
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this._rootContext?.onOpenChange(true);
    }
  }

  protected render() {
    return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-trigger": AlertDialogTrigger;
  }
}
