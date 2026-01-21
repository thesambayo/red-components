import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { dialogRootContext, generateId } from "./context";
import type { DialogRootContextValue } from "./types";

/**
 * Root component for a dialog. Uses native `<dialog>` element under the hood.
 * Manages open/close state and provides context.
 *
 * Features handled by native dialog:
 * - Top-layer positioning (no portal needed)
 * - Focus trapping (automatic in modal mode)
 * - Backdrop via `::backdrop` pseudo-element
 * - Escape key closes dialog
 *
 * @element dialog-root
 *
 * @fires openChange - Emitted when open state changes. Detail: { open: boolean }
 *
 * @example
 * ```html
 * <dialog-root modal>
 *   <dialog-trigger as-child>
 *     <button>Open Dialog</button>
 *   </dialog-trigger>
 *
 *   <dialog>
 *     <h2 data-dialog-title>Dialog Title</h2>
 *     <p data-dialog-description>Description here</p>
 *     <p>Content</p>
 *     <button data-dialog-close>Close</button>
 *   </dialog>
 * </dialog-root>
 * ```
 */
@customElement("dialog-root")
export class DialogRoot extends LitElement {
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

  /**
   * Whether dialog is modal (traps focus, has backdrop).
   * Default: true
   */
  @property({ type: Boolean })
  modal = true;

  /** Internal open state for uncontrolled mode */
  @state()
  private _internalOpen = false;

  /** Reference to trigger element */
  @state()
  private _triggerElement: HTMLElement | null = null;

  /** Reference to native dialog element */
  @state()
  private _dialogElement: HTMLDialogElement | null = null;

  /** Unique ID for title */
  private _titleId = generateId("dialog-title");

  /** Unique ID for description */
  private _descriptionId = generateId("dialog-description");

  /** Provide root context to children */
  @provide({ context: dialogRootContext })
  @property({ attribute: false })
  context: DialogRootContextValue = this._createContext();

  /** Bound event handlers */
  private _boundHandleDialogClose = this._handleDialogClose.bind(this);
  private _boundHandleDialogCancel = this._handleDialogCancel.bind(this);
  private _boundHandleBackdropClick = this._handleBackdropClick.bind(this);

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
      changed.has("modal")
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
        // Setup accessibility attributes
        this._setupAriaAttributes();

        // Setup close button handlers
        this._setupCloseButtons();

        // Add event listeners
        this._dialogElement.addEventListener(
          "close",
          this._boundHandleDialogClose
        );
        this._dialogElement.addEventListener(
          "cancel",
          this._boundHandleDialogCancel
        );
        this._dialogElement.addEventListener(
          "click",
          this._boundHandleBackdropClick
        );

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
      this._dialogElement.removeEventListener(
        "click",
        this._boundHandleBackdropClick
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

  private _setupCloseButtons() {
    if (!this._dialogElement) return;

    // Find all elements with data-dialog-close attribute
    const closeButtons = this._dialogElement.querySelectorAll(
      "[data-dialog-close]"
    );
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this._handleOpenChange(false);
      });
    });
  }

  private _syncDialogState() {
    if (!this._dialogElement) return;

    const shouldBeOpen = this._isOpen;
    const isCurrentlyOpen = this._dialogElement.open;

    if (shouldBeOpen && !isCurrentlyOpen) {
      if (this.modal) {
        this._dialogElement.showModal();
      } else {
        this._dialogElement.show();
      }
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
    // Allow escape to close dialog (default behavior)
    // The close event will handle state sync
    event.preventDefault();
    this._handleOpenChange(false);
  }

  private _handleBackdropClick(event: MouseEvent) {
    // Close on backdrop click (only for modal dialogs)
    if (this.modal && event.target === this._dialogElement) {
      this._handleOpenChange(false);
    }
  }

  private _createContext(): DialogRootContextValue {
    return {
      open: this._isOpen,
      modal: this.modal,
      dialogElement: this._dialogElement,
      titleId: this._titleId,
      descriptionId: this._descriptionId,
      triggerElement: this._triggerElement,
      onOpenChange: this._handleOpenChange.bind(this),
      onTriggerMount: this._handleTriggerMount.bind(this),
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

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-root": DialogRoot;
  }
}
