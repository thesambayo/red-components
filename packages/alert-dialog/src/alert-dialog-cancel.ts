import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Cancel button that dismisses the alert dialog without action.
 * Receives auto-focus when the dialog opens.
 *
 * @element alert-dialog-cancel
 *
 * @example
 * ```html
 * <alert-dialog-cancel>Cancel</alert-dialog-cancel>
 * ```
 */
@customElement("alert-dialog-cancel")
export class AlertDialogCancel extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Register with root context for auto-focus
    this._rootContext?.onCancelMount(this);
    this._setupCancel();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._cleanupCancel();
  }

  private _setupCancel() {
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // The host is the control itself, so it must carry button semantics -
    // tabindex alone leaves screen readers announcing a generic element.
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
  }

  private _cleanupCancel() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _onClick() {
    this._rootContext?.onOpenChange(false);
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this._rootContext?.onOpenChange(false);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-cancel": AlertDialogCancel;
  }
}
