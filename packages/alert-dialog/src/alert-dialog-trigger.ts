import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Trigger element that opens the alert dialog on click.
 * Wrap your interactive element (button, etc.) inside this.
 *
 * @element alert-dialog-trigger
 *
 * @example
 * ```html
 * <alert-dialog-trigger>
 *   <button>Delete Item</button>
 * </alert-dialog-trigger>
 * ```
 */
@customElement("alert-dialog-trigger")
export class AlertDialogTrigger extends LitElement {
  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Register with root context
    this._rootContext?.onTriggerMount(this);

    // Add event listeners
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    // Set accessibility attributes
    this.setAttribute("aria-haspopup", "dialog");
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Remove event listeners
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  private _updateAttributes() {
    if (!this._rootContext) return;

    // Set aria-expanded
    this.setAttribute(
      "aria-expanded",
      this._rootContext.open ? "true" : "false"
    );

    // Set aria-controls
    this.setAttribute("aria-controls", this._rootContext.contentId);

    // Set data-state for styling
    this.setAttribute("data-state", this._rootContext.stateAttribute);
  }

  private _onClick() {
    this._rootContext?.onOpenChange(true);
  }

  private _onKeyDown(event: KeyboardEvent) {
    // Trigger with SPACE and ENTER key
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this._rootContext?.onOpenChange(true);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-trigger": AlertDialogTrigger;
  }
}
