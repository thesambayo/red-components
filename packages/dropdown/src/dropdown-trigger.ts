import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { attachPopoverToggle } from "@red-elements/core";
import type { ActivationSource, BehaviorCleanup } from "@red-elements/core";

/**
 * Trigger button for opening the dropdown.
 *
 * @element dropdown-trigger
 * @slot - Button content
 *
 * @example
 * ```html
 * <dropdown-trigger>Open Menu</dropdown-trigger>
 * ```
 */
@customElement("dropdown-trigger")
export class DropdownTrigger extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  /** Stored handler references for proper cleanup */
  private _handleKeyDown = this._onKeyDown.bind(this);
  private _disposeToggle?: BehaviorCleanup;

  connectedCallback() {
    super.connectedCallback();

    this._setupTrigger();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._cleanupTrigger();
  }

  private _getContent(): HTMLElement | null {
    const dropdownId = this.getAttribute("data-dropdown-id");
    if (!dropdownId) return null;
    return document.getElementById(`${dropdownId}-content`);
  }

  private _setupTrigger() {
    // Toggling is delegated so that a click which *began* while the menu was
    // open closes it, rather than racing the Popover API's light dismiss and
    // reopening what the browser just closed.
    this._disposeToggle = attachPopoverToggle(this, {
      isOpen: () => this._getContent()?.matches(":popover-open") ?? false,
      open: (source) => this._open(source),
      close: () => this._getContent()?.hidePopover(),
    });
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

  private _cleanupTrigger() {
    this._disposeToggle?.();
    this._disposeToggle = undefined;
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  /**
   * Opens the menu, telling the content how it was opened.
   *
   * `dropdown-content` focuses its first item only for keyboard opens; on a
   * mouse open it focuses itself instead, so arrow keys still work but no item
   * shows a focus ring the user never asked for. The popover `toggle` event
   * carries no such information, hence the handoff via an attribute.
   */
  private _open(source: ActivationSource) {
    const content = this._getContent();
    if (!content) return;
    content.setAttribute("data-open-source", source);
    content.showPopover();
  }

  private _onKeyDown(event: KeyboardEvent) {
    const content = this._getContent();
    if (!content) return;

    if (event.key === " " || event.key === "Enter") {
      // preventDefault suppresses the synthetic click, so this is the whole
      // activation path for the keyboard - it has to toggle, not just open,
      // or Enter on an open menu would do nothing.
      event.preventDefault();
      if (content.matches(":popover-open")) content.hidePopover();
      else this._open("keyboard");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!content.matches(":popover-open")) this._open("keyboard");
    }
  }

  /**
   * Update state attributes on the trigger
   */
  updateState(isOpen: boolean) {
    const target = this;
    if (target) {
      target.setAttribute("aria-expanded", String(isOpen));
      target.setAttribute("data-state", isOpen ? "open" : "closed");
    }
  }

  /** The trigger element. The host is the trigger. */
  getTriggerElement(): HTMLElement {
    return this;
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-trigger": DropdownTrigger;
  }
}
