import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { dialogRootContext, generateId, DIALOG_EVENTS } from "./context";
import { ControlledState, attachBehavior, dispatch } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";
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
 *   <dialog-trigger>
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

  /**
   * Controlled/uncontrolled open state.
   *
   * Also supplies the late-`defaultOpen` initialization that tabs, select, and
   * switch had but dialog did not - under React, properties are assigned after
   * the element connects, so `default-open` was previously ignored.
   */
  private _openState = new ControlledState<boolean>(this, {
    prop: () => this.open,
    defaultValue: () => this.defaultOpen,
    fallback: false,
  });

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

  private _disposeCloseBehavior?: BehaviorCleanup;
  private _disposeDialogBehavior?: BehaviorCleanup;
  private _disposeTriggerBehavior?: BehaviorCleanup;

  /** Bound event handlers */
  private _boundHandleDialogClose = this._handleDialogClose.bind(this);
  private _boundHandleDialogCancel = this._handleDialogCancel.bind(this);
  private _boundHandleBackdropClick = this._handleBackdropClick.bind(this);

  /** Whether controlled mode is active */
  private get _isControlled(): boolean {
    return this._openState.isControlled;
  }

  /** Current open state (controlled or uncontrolled) */
  private get _isOpen(): boolean {
    return this._openState.value;
  }

  connectedCallback() {
    super.connectedCallback();

    // Behavior attributes are wired independently of the <dialog> element:
    // `data-dialog-trigger` lives outside it.
    this._setupBehaviorAttributes();

    // Find the native dialog element
    this._setupDialog();

    this._updateContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupDialog();
  }

  /** Last open value pushed to the context and the native dialog. */
  private _lastSyncedOpen?: boolean;

  protected willUpdate(changed: Map<string, unknown>) {
    // Derive from the effective value rather than from a hand-maintained list
    // of changed keys: internal state now lives in a controller, which requests
    // a generic update, and a key list silently misses those.
    const open = this._isOpen;
    const openChanged = open !== this._lastSyncedOpen;

    if (
      openChanged ||
      changed.has("_triggerElement") ||
      changed.has("_dialogElement") ||
      changed.has("modal")
    ) {
      this._updateContext();
    }

    if (openChanged) {
      this._lastSyncedOpen = open;
      this._syncDialogState();
    }
  }

  /**
   * Discovers and wires the native `<dialog>`.
   *
   * Previously this ran `querySelector("dialog")` once inside a single
   * `requestAnimationFrame`: a dialog rendered conditionally (the common React
   * case) was never found, and a dialog that was replaced kept stale
   * listeners. Observing instead means the element can appear, change, or
   * disappear at any time.
   */
  private _setupDialog() {
    this._disposeDialogBehavior?.();
    this._disposeDialogBehavior = attachBehavior(this, "dialog", (element) => {
      // Ignore dialogs belonging to a nested dialog-root.
      if (element.closest("dialog-root") !== this) return;

      const dialog = element as HTMLDialogElement;
      this._dialogElement = dialog;

      this._setupAriaAttributes();

      dialog.addEventListener("close", this._boundHandleDialogClose);
      dialog.addEventListener("cancel", this._boundHandleDialogCancel);
      dialog.addEventListener("click", this._boundHandleBackdropClick);

      this._syncDialogState();
      this._updateContext();

      return () => {
        dialog.removeEventListener("close", this._boundHandleDialogClose);
        dialog.removeEventListener("cancel", this._boundHandleDialogCancel);
        dialog.removeEventListener("click", this._boundHandleBackdropClick);
        if (this._dialogElement === dialog) {
          this._dialogElement = null;
          this._updateContext();
        }
      };
    });
  }

  private _cleanupDialog() {
    this._disposeCloseBehavior?.();
    this._disposeCloseBehavior = undefined;
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = undefined;
    // Also removes the <dialog> listeners via the behavior's cleanup.
    this._disposeDialogBehavior?.();
    this._disposeDialogBehavior = undefined;
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

  /**
   * Escape hatch: bring your own element instead of `<dialog-trigger>` /
   * `<dialog-close>`.
   *
   *   <button data-dialog-trigger>Open</button>
   *   <button data-dialog-close>Close</button>
   *
   * Explicit about which element receives behavior, works with any tag, and
   * adds no wrapper. `attachBehavior` observes the subtree, so elements added
   * later are wired up too and listeners are removed when they go away - the
   * previous one-shot `querySelectorAll` did neither.
   */
  private _setupBehaviorAttributes() {
    this._disposeCloseBehavior?.();
    this._disposeTriggerBehavior?.();

    this._disposeCloseBehavior = attachBehavior(
      this,
      "[data-dialog-close]",
      (element) => {
        const onClick = () => this._handleOpenChange(false);
        element.addEventListener("click", onClick);
        return () => element.removeEventListener("click", onClick);
      }
    );

    this._disposeTriggerBehavior = attachBehavior(
      this,
      "[data-dialog-trigger]",
      (element) => {
        const onClick = () => this._handleOpenChange(true);
        element.addEventListener("click", onClick);
        element.setAttribute("aria-haspopup", "dialog");
        this._handleTriggerMount(element);
        return () => element.removeEventListener("click", onClick);
      }
    );
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
      // In controlled mode the consumer owns the value; just notify.
      this._emitOpenChange(value);
    } else if (this._openState.set(value)) {
      this._emitOpenChange(value);
    }
  }

  private _emitOpenChange(open: boolean) {
    dispatch(this, DIALOG_EVENTS.OPEN_CHANGE, { open });
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
