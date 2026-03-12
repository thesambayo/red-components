import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { tooltipRootContext } from "./context";
import type { TooltipRootContextValue } from "./types";

/**
 * Trigger element that shows/hides the tooltip on interaction.
 * Wrap your interactive element (button, link, etc.) inside this.
 *
 * @element tooltip-trigger
 *
 * @example
 * ```html
 * <tooltip-trigger>
 *   <button>Hover me</button>
 * </tooltip-trigger>
 * ```
 */
@customElement("tooltip-trigger")
export class TooltipTrigger extends LitElement {
  @consume({ context: tooltipRootContext, subscribe: true })
  private _rootContext?: TooltipRootContextValue;

  /** Track if pointer is down (for focus handling) */
  private _isPointerDown = false;

  /** Stored handler references for proper cleanup */
  private _handlePointerEnter = this._onPointerEnter.bind(this);
  private _handlePointerLeave = this._onPointerLeave.bind(this);
  private _handlePointerDown = this._onPointerDown.bind(this);
  private _handleFocus = this._onFocus.bind(this);
  private _handleBlur = this._onBlur.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);
  private _handleClick = this._onClick.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Register with root context
    this._rootContext?.onTriggerMount(this);

    // Add event listeners with stored references
    this.addEventListener("pointerenter", this._handlePointerEnter);
    this.addEventListener("pointerleave", this._handlePointerLeave);
    this.addEventListener("pointerdown", this._handlePointerDown);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("keydown", this._handleKeyDown);
    this.addEventListener("click", this._handleClick);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unregister from root context
    this._rootContext?.onTriggerUnmount();

    // Remove event listeners with same references
    this.removeEventListener("pointerenter", this._handlePointerEnter);
    this.removeEventListener("pointerleave", this._handlePointerLeave);
    this.removeEventListener("pointerdown", this._handlePointerDown);
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
    this.removeEventListener("keydown", this._handleKeyDown);
    this.removeEventListener("click", this._handleClick);
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  private _updateAttributes() {
    if (!this._rootContext) return;

    // Set aria-describedby when tooltip is open
    if (this._rootContext.open) {
      this.setAttribute("aria-describedby", this._rootContext.contentId);
    } else {
      this.removeAttribute("aria-describedby");
    }

    // Set data-state for styling
    this.setAttribute("data-state", this._rootContext.stateAttribute);
  }

  private _onPointerEnter(event: PointerEvent) {
    // Ignore touch events (handled differently)
    if (event.pointerType === "touch") return;

    this._rootContext?.onOpen();
  }

  private _onPointerLeave(event: PointerEvent) {
    // Ignore touch events
    if (event.pointerType === "touch") return;

    // When hoverable content is enabled, use delayed close
    // This gives the user time to move pointer to the content
    const instant = this._rootContext?.disableHoverableContent ?? true;
    this._rootContext?.onClose(instant);
  }

  private _onPointerDown() {
    this._isPointerDown = true;
    // Close immediately on pointer down (click)
    this._rootContext?.onClose(true);

    // Reset pointer down state after a tick
    setTimeout(() => {
      this._isPointerDown = false;
    }, 0);
  }

  private _onFocus(event: FocusEvent) {
    // Don't open if we just clicked (pointer down)
    if (this._isPointerDown) return;

    // Only open on keyboard focus (not programmatic)
    // Check for :focus-visible support
    const target = event.target as HTMLElement;
    try {
      if (!target.matches(":focus-visible")) return;
    } catch {
      // :focus-visible not supported, allow all focus
    }

    this._rootContext?.onOpen();
  }

  private _onBlur() {
    this._rootContext?.onClose(true);
  }

  private _onKeyDown(event: KeyboardEvent) {
    // Close on Escape
    if (event.key === "Escape") {
      this._rootContext?.onClose(true);
    }
  }

  private _onClick() {
    // Close on click (already handled by pointerdown, but safety)
    this._rootContext?.onClose(true);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tooltip-trigger": TooltipTrigger;
  }
}
