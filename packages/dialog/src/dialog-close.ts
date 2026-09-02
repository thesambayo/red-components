import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dialogRootContext } from "./context";
import type { DialogRootContextValue } from "./types";

/**
 * Close button that closes the dialog when clicked.
 *
 * Note: You can also use the `data-dialog-close` attribute on any element
 * inside the dialog to close it without using this component.
 *
 * @element dialog-close
 *
 * @example
 * ```html
 * <dialog-close>Close</dialog-close>
 *
 * <!-- Alternative: use data attribute directly -->
 * <button data-dialog-close>Close</button>
 * ```
 */
@customElement("dialog-close")
export class DialogClose extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  @consume({ context: dialogRootContext, subscribe: true })
  private _rootContext?: DialogRootContextValue;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);

  connectedCallback() {
    super.connectedCallback();

    this._setupClose();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._cleanupClose();
  }

  private _setupClose() {
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

  private _cleanupClose() {
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
    "dialog-close": DialogClose;
  }
}
