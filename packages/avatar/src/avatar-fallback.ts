import { consume } from "@lit/context";
import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AvatarContext, avatarContext } from "./avatar-context";

/**
 * Fallback content shown when the avatar image is loading or fails to load.
 *
 * @element avatar-fallback
 *
 * @example
 * ```html
 * <avatar-fallback>AB</avatar-fallback>
 * ```
 */
@customElement("avatar-fallback")
export class AvatarFallback extends LitElement {
  @consume({ context: avatarContext, subscribe: true })
  private _context?: AvatarContext;

  /** Internal state for tracking if delay has elapsed */
  @state()
  private _canShow = false;

  /** Timer reference for cleanup */
  private _delayTimer: number | null = null;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearDelayTimer();
  }

  protected willUpdate() {
    this._updateDelayTimer();
  }

  protected render() {
    if (!this._context) {
      return nothing;
    }

    const { imageLoadingStatus } = this._context;

    // Don't show fallback if image is loaded
    if (imageLoadingStatus === "loaded") {
      return nothing;
    }

    // Show immediately on error
    if (imageLoadingStatus === "error") {
      return html`<slot></slot>`;
    }

    // For loading/idle, wait for delay timer
    if (this._canShow) {
      return html`<slot></slot>`;
    }

    return nothing;
  }

  private _updateDelayTimer() {
    if (!this._context) return;

    const { imageLoadingStatus, delayMs } = this._context;

    // If image is loaded, clear timer and hide
    if (imageLoadingStatus === "loaded") {
      this._clearDelayTimer();
      this._canShow = false;
      return;
    }

    // If error, show immediately
    if (imageLoadingStatus === "error") {
      this._clearDelayTimer();
      this._canShow = true;
      return;
    }

    // For loading/idle states, handle delay
    if (imageLoadingStatus === "loading" || imageLoadingStatus === "idle") {
      // If no delay, show immediately
      if (delayMs === 0) {
        this._canShow = true;
        return;
      }

      // If delay timer not set, start it
      if (this._delayTimer === null) {
        this._canShow = false;
        this._delayTimer = window.setTimeout(() => {
          this._canShow = true;
          this._delayTimer = null;
          this.requestUpdate();
        }, delayMs);
      }
    }
  }

  private _clearDelayTimer() {
    if (this._delayTimer !== null) {
      window.clearTimeout(this._delayTimer);
      this._delayTimer = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "avatar-fallback": AvatarFallback;
  }
}

