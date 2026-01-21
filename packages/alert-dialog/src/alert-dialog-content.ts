import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";
import { FocusTrap } from "./utils/focus-trap";
import { lockScroll, unlockScroll } from "./utils/scroll-lock";

/**
 * Main content container for the alert dialog.
 * Handles focus trapping, escape key, and scroll lock.
 * Uses role="alertdialog" and auto-focuses the cancel button.
 *
 * @element alert-dialog-content
 *
 * @example
 * ```html
 * <alert-dialog-content>
 *   <alert-dialog-title>Confirm Action</alert-dialog-title>
 *   <alert-dialog-description>Are you sure?</alert-dialog-description>
 *   <alert-dialog-cancel><button>Cancel</button></alert-dialog-cancel>
 *   <alert-dialog-action><button>Confirm</button></alert-dialog-action>
 * </alert-dialog-content>
 * ```
 */
@customElement("alert-dialog-content")
export class AlertDialogContent extends LitElement {
  static styles = css`
    :host {
      pointer-events: auto;
    }

    :host([data-state="closed"]) {
      display: none !important;
    }
  `;

  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /**
   * Whether to force-mount the content regardless of open state.
   */
  @property({ type: Boolean, attribute: "force-mount" })
  forceMount = false;

  /** Focus trap instance */
  private _focusTrap: FocusTrap | null = null;

  /** Track if we applied scroll lock */
  private _hasScrollLock = false;

  /** Track previous open state */
  private _wasOpen = false;

  /** Stored handler for escape key */
  private _handleKeyDown = this._onKeyDown.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Register with root context
    this._rootContext?.onContentMount(this);

    // Add keyboard listener
    this.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    this._cleanup();
    this.removeEventListener("keydown", this._handleKeyDown);
    super.disconnectedCallback();
  }

  protected willUpdate() {
    if (!this._rootContext) return;

    const shouldShow = this.forceMount || this._rootContext.open;
    const wasShown = this._wasOpen;

    if (shouldShow && !wasShown) {
      this._onOpen();
    } else if (!shouldShow && wasShown) {
      this._onClose();
    }

    this._wasOpen = shouldShow;
    this._updateAttributes();
  }

  private _updateAttributes() {
    if (!this._rootContext) return;

    const shouldShow = this.forceMount || this._rootContext.open;

    // Set data-state for styling
    this.setAttribute("data-state", shouldShow ? "open" : "closed");

    // Set accessibility attributes - alertdialog role
    this.setAttribute("role", "alertdialog");
    this.setAttribute("id", this._rootContext.contentId);
    this.setAttribute("aria-modal", "true");

    // Link to title and description
    this.setAttribute("aria-labelledby", this._rootContext.titleId);
    this.setAttribute("aria-describedby", this._rootContext.descriptionId);
  }

  private _onOpen() {
    // Apply scroll lock (alert dialogs are always modal)
    lockScroll();
    this._hasScrollLock = true;

    // Create and activate focus trap
    // Pass the cancel element for initial focus
    this._focusTrap = new FocusTrap(this);
    this._focusTrap.activate(this._rootContext?.cancelElement);
  }

  private _onClose() {
    this._cleanup();
  }

  private _cleanup() {
    // Deactivate focus trap
    if (this._focusTrap) {
      this._focusTrap.deactivate();
      this._focusTrap = null;
    }

    // Release scroll lock
    if (this._hasScrollLock) {
      unlockScroll();
      this._hasScrollLock = false;
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    // Escape closes the alert dialog (via cancel action)
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this._rootContext?.onOpenChange(false);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-content": AlertDialogContent;
  }
}
