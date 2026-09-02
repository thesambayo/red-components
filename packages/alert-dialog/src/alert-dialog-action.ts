import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Action button that confirms and closes the alert dialog.
 *
 * @element alert-dialog-action
 *
 * @example
 * ```html
 * <alert-dialog-action>Delete</alert-dialog-action>
 * ```
 */
@customElement("alert-dialog-action")
export class AlertDialogAction extends LitElement {
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

    this._setupAction();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._cleanupAction();
  }

  private _setupAction() {
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

  private _cleanupAction() {
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
    "alert-dialog-action": AlertDialogAction;
  }
}
