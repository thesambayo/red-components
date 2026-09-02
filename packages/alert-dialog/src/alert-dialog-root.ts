import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import {
  alertDialogRootContext,
  generateId,
  ALERT_DIALOG_EVENTS,
} from "./context";
import type { AlertDialogRootContextValue } from "./types";
import { ControlledState, attachBehavior, dispatch } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";

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
 *   <alert-dialog-trigger>
 *     <button>Delete Item</button>
 *   </alert-dialog-trigger>
 *
 *   <dialog>
 *     <h2 data-dialog-title>Confirm Deletion</h2>
 *     <p data-dialog-description>This action cannot be undone.</p>
 *
 *     <footer>
 *       <alert-dialog-cancel>
 *         <button>Cancel</button>
 *       </alert-dialog-cancel>
 *       <alert-dialog-action>
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

  /**
   * Controlled/uncontrolled open state. `name` keeps it in
   * `changedProperties` so the existing `willUpdate` checks still fire.
   */
  private _openState = new ControlledState<boolean>(this, {
    prop: () => this.open,
    defaultValue: () => this.defaultOpen,
    fallback: false,
    name: "_internalOpen",
  });

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

  private _disposeBehaviors: BehaviorCleanup[] = [];
  private _disposeDialogBehavior?: BehaviorCleanup;

  /** Bound event handlers */
  private _boundHandleDialogClose = this._handleDialogClose.bind(this);
  private _boundHandleDialogCancel = this._handleDialogCancel.bind(this);

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
    // `data-alert-dialog-trigger` lives outside it.
    this._setupBehaviorAttributes();

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

  /**
   * Discovers and wires the native `<dialog>`.
   *
   * Observed rather than read once inside a `requestAnimationFrame`, so a
   * conditionally rendered dialog is still found and a replaced one does not
   * leave stale listeners behind.
   */
  private _setupDialog() {
    this._disposeDialogBehavior?.();
    this._disposeDialogBehavior = attachBehavior(this, "dialog", (element) => {
      // Ignore dialogs belonging to a nested alert-dialog-root.
      if (element.closest("alert-dialog-root") !== this) return;

      const dialog = element as HTMLDialogElement;
      this._dialogElement = dialog;

      dialog.setAttribute("role", "alertdialog");
      this._setupAriaAttributes();

      dialog.addEventListener("close", this._boundHandleDialogClose);
      dialog.addEventListener("cancel", this._boundHandleDialogCancel);
      // No backdrop click handler: an alert dialog must not be dismissed by
      // clicking outside it.

      this._syncDialogState();
      this._updateContext();

      return () => {
        dialog.removeEventListener("close", this._boundHandleDialogClose);
        dialog.removeEventListener("cancel", this._boundHandleDialogCancel);
        if (this._dialogElement === dialog) {
          this._dialogElement = null;
          this._updateContext();
        }
      };
    });
  }

  /**
   * Escape hatch: bring your own elements instead of the custom elements.
   *
   *   <button data-alert-dialog-trigger>Delete</button>
   *   <button data-alert-dialog-cancel>Cancel</button>
   *   <button data-alert-dialog-action>Confirm</button>
   */
  private _setupBehaviorAttributes() {
    this._teardownBehaviors();

    const wire = (selector: string, onActivate: () => void) =>
      attachBehavior(this, selector, (element) => {
        const onClick = () => onActivate();
        element.addEventListener("click", onClick);
        return () => element.removeEventListener("click", onClick);
      });

    this._disposeBehaviors = [
      wire("[data-alert-dialog-trigger]", () => this._handleOpenChange(true)),
      wire("[data-alert-dialog-action]", () => this._handleOpenChange(false)),
      // Cancel additionally registers itself as the element that receives
      // initial focus when the dialog opens, matching <alert-dialog-cancel>.
      attachBehavior(this, "[data-alert-dialog-cancel]", (element) => {
        const onClick = () => this._handleOpenChange(false);
        element.addEventListener("click", onClick);
        this._handleCancelMount(element);
        return () => element.removeEventListener("click", onClick);
      }),
    ];
  }

  private _teardownBehaviors() {
    for (const dispose of this._disposeBehaviors) dispose();
    this._disposeBehaviors = [];
  }

  private _cleanupDialog() {
    this._teardownBehaviors();
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
      if (this._openState.set(value)) {
        this._emitOpenChange(value);
      }
    }
  }

  private _emitOpenChange(open: boolean) {
    dispatch(this, ALERT_DIALOG_EVENTS.OPEN_CHANGE, { open });
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
