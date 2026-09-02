import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, property, state } from "lit/decorators.js";
import { AvatarContext, avatarContext, ImageLoadingStatus, AVATAR_EVENTS } from "./avatar-context";
import { dispatch } from "@red-elements/core";

/**
 * Root container for the avatar component.
 *
 * @element avatar-root
 *
 * @fires loadingStatusChange - Emitted when the image loading status changes. Detail contains the ImageLoadingStatus.
 *
 * @example
 * ```html
 * <avatar-root delay-ms="600">
 *   <avatar-image src="https://..." alt="User"></avatar-image>
 *   <avatar-fallback>AB</avatar-fallback>
 * </avatar-root>
 * ```
 */
@customElement("avatar-root")
export class AvatarRoot extends LitElement {
  /**
   * Delay in milliseconds before showing the fallback
   * @defaultValue 0
   */
  @property({ type: Number, attribute: "delay-ms" })
  delayMs = 0;

  /** Internal state for image loading status */
  @state()
  private _imageLoadingStatus: ImageLoadingStatus = "idle";

  /** Context value provided to children - used by @provide decorator */
  @provide({ context: avatarContext })
  @property({ attribute: false })
  context: AvatarContext = this._createContext();

  protected willUpdate(changed: Map<string, unknown>) {
    // Update context when any relevant property changes
    if (
      changed.has("delayMs") ||
      changed.has("_imageLoadingStatus")
    ) {
      this._updateContext();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _createContext(): AvatarContext {
    return {
      imageLoadingStatus: this._imageLoadingStatus,
      delayMs: this.delayMs,
      onImageLoadingStatusChange: this._updateImageLoadingStatus.bind(this),
    };
  }

  private _updateContext() {
    this.context = this._createContext();
  }

  private _updateImageLoadingStatus(status: ImageLoadingStatus) {
    if (status === this._imageLoadingStatus) return;

    this._imageLoadingStatus = status;

    dispatch(this, AVATAR_EVENTS.LOADING_STATUS_CHANGE, status);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "avatar-root": AvatarRoot;
  }
}

