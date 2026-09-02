import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { dialogRootContext } from "./context";
import type { DialogRootContextValue } from "./types";

/**
 * Trigger element that opens the dialog on click.
 *
 * @element dialog-trigger
 *
 * @example
 * ```html
 * <dialog-trigger>Open Dialog</dialog-trigger>
 * ```
 */
@customElement("dialog-trigger")
export class DialogTrigger extends LitElement {
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

    // Register with root context
    this._rootContext?.onTriggerMount(this);
    this._setupTrigger();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._cleanupTrigger();
  }

  protected willUpdate() {
    this._updateTriggerAttributes();
  }

  private _setupTrigger() {
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

    // Set accessibility attributes
    this.setAttribute("aria-haspopup", "dialog");
  }

  private _cleanupTrigger() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _updateTriggerAttributes() {
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
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-trigger": DialogTrigger;
  }
}
