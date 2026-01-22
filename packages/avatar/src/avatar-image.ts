import { consume } from "@lit/context";
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AvatarContext, avatarContext, ImageLoadingStatus } from "./avatar-context";

/**
 * Image element for the avatar component.
 *
 * @element avatar-image
 *
 * @example
 * ```html
 * <avatar-image
 *   src="https://example.com/avatar.jpg"
 *   alt="User avatar"
 *   referrer-policy="no-referrer"
 *   cross-origin="anonymous">
 * </avatar-image>
 * ```
 */
@customElement("avatar-image")
export class AvatarImage extends LitElement {
  @consume({ context: avatarContext, subscribe: true })
  private _context?: AvatarContext;

  @property({ type: String, reflect: true })
  src?: string;

  @property({ attribute: "alt" })
  alt?: string;

  /**
   * Referrer policy for the image request
   */
  @property({ type: String, attribute: "referrer-policy" })
  referrerPolicy?: string;

  /**
   * CORS setting for the image request
   */
  @property({ type: String, attribute: "cross-origin" })
  crossOrigin?: "anonymous" | "use-credentials";

  /** Internal reference to the image element for cleanup */
  private _imageElement: HTMLImageElement | null = null;

  /** Track the last loaded src to detect changes */
  private _lastLoadedSrc?: string;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupImageElement();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Reload image when src, referrerPolicy, or crossOrigin change
    if (
      changed.has("src") ||
      changed.has("referrerPolicy") ||
      changed.has("crossOrigin")
    ) {
      this._loadImage();
    }
  }

  protected render() {
    if (!this._context) {
      return nothing;
    }

    const imageStatus = this._context.imageLoadingStatus;
    const renderedImg = html`<img src="${this.src}" alt="${this.alt || ""}" />`;

    return imageStatus === "loaded" ? renderedImg : nothing;
  }

  private _loadImage() {
    // Clean up any existing image element
    this._cleanupImageElement();

    if (!this.src || !this._context) {
      return;
    }

    // Check if we need to reload (src changed)
    if (this._lastLoadedSrc === this.src) {
      return;
    }

    // Set loading state before starting load
    this._context.onImageLoadingStatusChange("loading");

    // Create new image element
    this._imageElement = new window.Image();

    // Set CORS and referrer policy if provided
    if (this.crossOrigin) {
      this._imageElement.crossOrigin = this.crossOrigin;
    }
    if (this.referrerPolicy) {
      this._imageElement.referrerPolicy = this.referrerPolicy;
    }

    // Set up event handlers
    this._imageElement.onload = () => {
      if (this._context) {
        this._context.onImageLoadingStatusChange("loaded");
        this._lastLoadedSrc = this.src;
      }
    };

    this._imageElement.onerror = () => {
      if (this._context) {
        this._context.onImageLoadingStatusChange("error");
      }
    };

    // Start loading
    this._imageElement.src = this.src;
  }

  private _cleanupImageElement() {
    if (this._imageElement) {
      // Remove event handlers to prevent memory leaks
      this._imageElement.onload = null;
      this._imageElement.onerror = null;
      this._imageElement = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "avatar-image": AvatarImage;
  }
}

