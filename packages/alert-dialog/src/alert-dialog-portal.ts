import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { alertDialogRootContext } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Portal component that moves its children to the body (or specified container).
 * This ensures the alert dialog renders above other content.
 *
 * @element alert-dialog-portal
 *
 * @example
 * ```html
 * <alert-dialog-portal>
 *   <alert-dialog-overlay></alert-dialog-overlay>
 *   <alert-dialog-content>...</alert-dialog-content>
 * </alert-dialog-portal>
 * ```
 */
@customElement("alert-dialog-portal")
export class AlertDialogPortal extends LitElement {
  static styles = css`
    :host {
      display: none !important;
    }
  `;

  @consume({ context: alertDialogRootContext, subscribe: true })
  private _rootContext?: AlertDialogRootContextValue;

  /**
   * Container element selector or "body" (default).
   */
  @property({ type: String })
  container = "body";

  /**
   * Whether to force-mount the portal content regardless of open state.
   */
  @property({ type: Boolean, attribute: "force-mount" })
  forceMount = false;

  /** Cached container element */
  @state()
  private _containerElement: HTMLElement | null = null;

  /** Track previous open state to detect changes */
  private _wasOpen = false;

  /** Store original children for cleanup */
  private _originalChildren: Element[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._containerElement = this._getContainerElement();
  }

  disconnectedCallback() {
    this._moveChildrenBack();
    super.disconnectedCallback();
  }

  protected willUpdate() {
    if (!this._rootContext) return;

    const shouldShow = this.forceMount || this._rootContext.open;
    const wasShown = this._wasOpen;

    if (shouldShow && !wasShown) {
      this._moveChildrenToContainer();
    } else if (!shouldShow && wasShown) {
      this._moveChildrenBack();
    }

    this._wasOpen = shouldShow;
  }

  /**
   * Get the container element to portal into
   */
  private _getContainerElement(): HTMLElement {
    if (!this.container || this.container === "body") {
      return document.body;
    }
    return document.querySelector(this.container) ?? document.body;
  }

  /**
   * Move children to the container
   */
  private _moveChildrenToContainer() {
    if (!this._containerElement) return;

    // Store reference to original children
    this._originalChildren = Array.from(this.children);

    // Move children to portal container
    this._originalChildren.forEach((child) => {
      this._containerElement!.appendChild(child);
    });
  }

  /**
   * Move children back to this element
   */
  private _moveChildrenBack() {
    this._originalChildren.forEach((child) => {
      if (child.parentElement === this._containerElement) {
        this.appendChild(child);
      }
    });
    this._originalChildren = [];
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-portal": AlertDialogPortal;
  }
}
