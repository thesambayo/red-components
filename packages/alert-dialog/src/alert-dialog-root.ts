import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { alertDialogRootContext, generateId } from "./context";
import type { AlertDialogRootContextValue, AlertDialogState } from "./types";

/**
 * Root component for an alert dialog. Always modal.
 * Manages open/close state and provides context.
 *
 * @element alert-dialog-root
 *
 * @fires openChange - Emitted when open state changes. Detail: { open: boolean }
 *
 * @example
 * ```html
 * <alert-dialog-root>
 *   <alert-dialog-trigger>
 *     <button>Delete Item</button>
 *   </alert-dialog-trigger>
 *   <alert-dialog-portal>
 *     <alert-dialog-overlay></alert-dialog-overlay>
 *     <alert-dialog-content>
 *       <alert-dialog-title>Confirm Deletion</alert-dialog-title>
 *       <alert-dialog-description>This action cannot be undone.</alert-dialog-description>
 *       <alert-dialog-cancel><button>Cancel</button></alert-dialog-cancel>
 *       <alert-dialog-action><button>Delete</button></alert-dialog-action>
 *     </alert-dialog-content>
 *   </alert-dialog-portal>
 * </alert-dialog-root>
 * ```
 */
@customElement("alert-dialog-root")
export class AlertDialogRoot extends LitElement {
  /**
   * Controlled open state. When set, component is controlled.
   */
  @property({ type: Boolean })
  open?: boolean;

  /**
   * Default open state for uncontrolled mode.
   */
  @property({ type: Boolean, attribute: "default-open" })
  defaultOpen = false;

  /** Internal open state for uncontrolled mode */
  @state()
  private _internalOpen = false;

  /** Reference to trigger element */
  @state()
  private _trigger: HTMLElement | null = null;

  /** Reference to content element */
  @state()
  private _contentElement: HTMLElement | null = null;

  /** Reference to cancel element */
  @state()
  private _cancelElement: HTMLElement | null = null;

  /** Unique ID for content */
  private _contentId = generateId("alert-dialog-content");

  /** Unique ID for title */
  private _titleId = generateId("alert-dialog-title");

  /** Unique ID for description */
  private _descriptionId = generateId("alert-dialog-description");

  /** Provide root context to children */
  @provide({ context: alertDialogRootContext })
  @property({ attribute: false })
  context: AlertDialogRootContextValue = this._createContext();

  /** Whether controlled mode is active */
  private get _isControlled(): boolean {
    return this.open !== undefined;
  }

  /** Current open state (controlled or uncontrolled) */
  private get _isOpen(): boolean {
    return this._isControlled ? !!this.open : this._internalOpen;
  }

  /** State attribute for styling */
  private get _stateAttribute(): AlertDialogState {
    return this._isOpen ? "open" : "closed";
  }

  connectedCallback() {
    super.connectedCallback();
    this._internalOpen = this.defaultOpen;
    this._updateContext();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (
      changed.has("open") ||
      changed.has("_internalOpen") ||
      changed.has("_trigger") ||
      changed.has("_contentElement") ||
      changed.has("_cancelElement")
    ) {
      this._updateContext();
    }
  }

  private _createContext(): AlertDialogRootContextValue {
    return {
      open: this._isOpen,
      stateAttribute: this._stateAttribute,
      contentId: this._contentId,
      titleId: this._titleId,
      descriptionId: this._descriptionId,
      trigger: this._trigger,
      contentElement: this._contentElement,
      cancelElement: this._cancelElement,
      onOpenChange: this._handleOpenChange.bind(this),
      onTriggerMount: this._handleTriggerMount.bind(this),
      onContentMount: this._handleContentMount.bind(this),
      onCancelMount: this._handleCancelMount.bind(this),
    };
  }

  private _updateContext() {
    this.context = this._createContext();
  }

  private _handleOpenChange(value: boolean) {
    if (this._isControlled) {
      // In controlled mode, just emit event
      this._emitOpenChange(value);
    } else {
      // In uncontrolled mode, update internal state
      if (this._internalOpen !== value) {
        this._internalOpen = value;
        this._emitOpenChange(value);
      }
    }
  }

  private _emitOpenChange(open: boolean) {
    this.dispatchEvent(
      new CustomEvent("openChange", {
        bubbles: true,
        composed: true,
        detail: { open },
      })
    );
  }

  private _handleTriggerMount(el: HTMLElement) {
    this._trigger = el;
  }

  private _handleContentMount(el: HTMLElement) {
    this._contentElement = el;
  }

  private _handleCancelMount(el: HTMLElement) {
    this._cancelElement = el;
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-dialog-root": AlertDialogRoot;
  }
}
