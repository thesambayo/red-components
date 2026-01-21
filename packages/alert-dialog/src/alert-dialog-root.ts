import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { alertDialogRootContext, generateId } from "./context";
import type { AlertDialogRootContextValue } from "./types";

/**
 * Root component for an alert dialog. Uses native `<dialog>` element under the hood.
 * Always modal, cannot be dismissed by clicking backdrop or pressing Escape.
 *
 * Differences from regular Dialog:
 * - Always modal (no `modal` prop)
 * - Escape key does NOT close (preventDefault on cancel event)
 * - Backdrop click does NOT close
 * - Focus moves to cancel button on open
 * - Uses role="alertdialog"
 *
 * @element alert-dialog-root
 *
 * @fires openChange - Emitted when open state changes. Detail: { open: boolean }
 *
 * @example
 * ```html
 * <alert-dialog-root>
 *   <alert-dialog-trigger as-child>
 *     <button>Delete Item</button>
 *   </alert-dialog-trigger>
 *
 *   <dialog>
 *     <h2 data-dialog-title>Confirm Deletion</h2>
 *     <p data-dialog-description>This action cannot be undone.</p>
 *
 *     <footer>
 *       <alert-dialog-cancel as-child>
 *         <button>Cancel</button>
 *       </alert-dialog-cancel>
 *       <alert-dialog-action as-child>
 *         <button>Delete</button>
 *       </alert-dialog-action>
 *     </footer>
 *   </dialog>
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
  private _triggerElement: HTMLElement | null = null;

  /** Reference to native dialog element */
  @state()
  private _dialogElement: HTMLDialogElement | null = null;

  /** Reference to cancel element (for auto-focus) */
  @state()
  private _cancelElement: HTMLElement | null = null;

  /** Unique ID for title */
  private _titleId = generateId("alert-dialog-title");

  /** Unique ID for description */
  private _descriptionId = generateId("alert-dialog-description");

  /** Provide root context to children */
  @provide({ context: alertDialogRootContext })
  @property({ attribute: false })
  context: AlertDialogRootContextValue = this._createContext();

  /** Bound event handlers */
  private _boundHandleDialogClose = this._handleDialogClose.bind(this);
  private _boundHandleDialogCancel = this._handleDialogCancel.bind(this);

  /** Whether controlled mode is active */
  private get _isControlled(): boolean {
    return this.open !== undefined;
  }

  /** Current open state (controlled or uncontrolled) */
  private get _isOpen(): boolean {
    return this._isControlled ? !!this.open : this._internalOpen;
  }

  connectedCallback() {
    super.connectedCallback();
    this._internalOpen = this.defaultOpen;

    // Find the native dialog element
    this._setupDialog();

    this._updateContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupDialog();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (
      changed.has("open") ||
      changed.has("_internalOpen") ||
      changed.has("_triggerElement") ||
      changed.has("_dialogElement") ||
      changed.has("_cancelElement")
    ) {
      this._updateContext();
    }

    // Handle dialog visibility changes
    if (changed.has("open") || changed.has("_internalOpen")) {
      this._syncDialogState();
    }
  }

  private _setupDialog() {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      this._dialogElement = this.querySelector("dialog");

      if (this._dialogElement) {
        // Set alertdialog role
        this._dialogElement.setAttribute("role", "alertdialog");

        // Setup accessibility attributes
        this._setupAriaAttributes();

        // Add event listeners
        this._dialogElement.addEventListener(
          "close",
          this._boundHandleDialogClose
        );
        this._dialogElement.addEventListener(
          "cancel",
          this._boundHandleDialogCancel
        );
        // Note: No backdrop click handler - alert dialogs cannot be dismissed by clicking backdrop

        // Sync initial state
        this._syncDialogState();
        this._updateContext();
      }
    });
  }

  private _cleanupDialog() {
    if (this._dialogElement) {
      this._dialogElement.removeEventListener(
        "close",
        this._boundHandleDialogClose
      );
      this._dialogElement.removeEventListener(
        "cancel",
        this._boundHandleDialogCancel
      );
    }
  }

  private _setupAriaAttributes() {
    if (!this._dialogElement) return;

    // Find title element and set up aria-labelledby
    const titleEl = this._dialogElement.querySelector("[data-dialog-title]");
    if (titleEl) {
      if (!titleEl.id) {
        titleEl.id = this._titleId;
      }
      this._dialogElement.setAttribute("aria-labelledby", titleEl.id);
    }

    // Find description element and set up aria-describedby
    const descEl = this._dialogElement.querySelector(
      "[data-dialog-description]"
    );
    if (descEl) {
      if (!descEl.id) {
        descEl.id = this._descriptionId;
      }
      this._dialogElement.setAttribute("aria-describedby", descEl.id);
    }
  }

  private _syncDialogState() {
    if (!this._dialogElement) return;

    const shouldBeOpen = this._isOpen;
    const isCurrentlyOpen = this._dialogElement.open;

    if (shouldBeOpen && !isCurrentlyOpen) {
      // Always use showModal for alert dialogs
      this._dialogElement.showModal();
      // Focus cancel button after dialog opens
      requestAnimationFrame(() => {
        this._cancelElement?.focus();
      });
    } else if (!shouldBeOpen && isCurrentlyOpen) {
      this._dialogElement.close();
      // Return focus to trigger
      this._triggerElement?.focus();
    }
  }

  private _handleDialogClose() {
    // Sync our state when native dialog closes
    if (this._isOpen) {
      this._handleOpenChange(false);
    }
  }

  private _handleDialogCancel(event: Event) {
    // Prevent escape key from closing alert dialog
    event.preventDefault();
  }

  private _createContext(): AlertDialogRootContextValue {
    return {
      open: this._isOpen,
      dialogElement: this._dialogElement,
      titleId: this._titleId,
      descriptionId: this._descriptionId,
      triggerElement: this._triggerElement,
      cancelElement: this._cancelElement,
      onOpenChange: this._handleOpenChange.bind(this),
      onTriggerMount: this._handleTriggerMount.bind(this),
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
    this._triggerElement = el;
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
