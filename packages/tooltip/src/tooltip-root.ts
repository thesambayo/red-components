import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide, consume } from "@lit/context";
import {
  tooltipProviderContext,
  tooltipRootContext,
  defaultProviderContext,
  generateId,
} from "./context";
import type {
  TooltipProviderContextValue,
  TooltipRootContextValue,
  TooltipState,
} from "./types";

/**
 * Root component for a tooltip. Manages open/close state and timing.
 *
 * @element tooltip-root
 *
 * @fires openChange - Emitted when open state changes. Detail: { open: boolean }
 *
 * @example
 * ```html
 * <tooltip-root>
 *   <tooltip-trigger>
 *     <button>Hover me</button>
 *   </tooltip-trigger>
 *   <tooltip-content>Tooltip text</tooltip-content>
 * </tooltip-root>
 * ```
 */
@customElement("tooltip-root")
export class TooltipRoot extends LitElement {
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
   * Delay before showing tooltip (ms). Overrides provider value.
   */
  @property({ type: Number, attribute: "delay-duration" })
  delayDuration?: number;

  /**
   * When true, tooltip closes immediately when leaving trigger.
   * When false (default), user can hover the content.
   */
  @property({ type: Boolean, attribute: "disable-hoverable-content" })
  disableHoverableContent = false;

  /** Internal open state for uncontrolled mode */
  @state()
  private _internalOpen = false;

  /** Tracks if current open was instant (no delay) */
  @state()
  private _wasInstantOpen = false;

  /** Reference to trigger element */
  @state()
  private _trigger: HTMLElement | null = null;

  /** Unique ID for content */
  private _contentId = generateId("tooltip-content");

  /** Delay timer */
  private _openTimer: ReturnType<typeof setTimeout> | null = null;

  /** Consume provider context (optional) */
  @consume({ context: tooltipProviderContext, subscribe: true })
  private _providerContext?: TooltipProviderContextValue;

  /** Provide root context to children */
  @provide({ context: tooltipRootContext })
  @property({ attribute: false })
  context: TooltipRootContextValue = this._createContext();

  /** Whether controlled mode is active */
  private get _isControlled(): boolean {
    return this.open !== undefined;
  }

  /** Current open state (controlled or uncontrolled) */
  private get _isOpen(): boolean {
    return this._isControlled ? !!this.open : this._internalOpen;
  }

  /** Effective delay duration */
  private get _effectiveDelay(): number {
    return (
      this.delayDuration ??
      this._providerContext?.delayDuration ??
      defaultProviderContext.delayDuration
    );
  }

  /** State attribute for styling */
  private get _stateAttribute(): TooltipState {
    if (!this._isOpen) return "closed";
    return this._wasInstantOpen ? "instant-open" : "delayed-open";
  }

  connectedCallback() {
    super.connectedCallback();
    this._internalOpen = this.defaultOpen;
    this._updateContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (
      changed.has("open") ||
      changed.has("_internalOpen") ||
      changed.has("_wasInstantOpen") ||
      changed.has("_trigger") ||
      changed.has("delayDuration") ||
      changed.has("disableHoverableContent")
    ) {
      this._updateContext();
    }
  }

  private _createContext(): TooltipRootContextValue {
    return {
      open: this._isOpen,
      stateAttribute: this._stateAttribute,
      contentId: this._contentId,
      trigger: this._trigger,
      delayDuration: this._effectiveDelay,
      disableHoverableContent: this.disableHoverableContent,
      onOpen: this._handleOpen.bind(this),
      onClose: this._handleClose.bind(this),
      onTriggerMount: this._handleTriggerMount.bind(this),
      onTriggerUnmount: this._handleTriggerUnmount.bind(this),
    };
  }

  private _updateContext() {
    this.context = this._createContext();
  }

  private _clearTimer() {
    if (this._openTimer) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
  }

  private _handleOpen(instant = false) {
    this._clearTimer();

    // Check if we should skip delay
    const provider = this._providerContext ?? defaultProviderContext;
    const shouldSkipDelay = instant || !provider.isOpenDelayed;

    if (shouldSkipDelay) {
      this._wasInstantOpen = true;
      this._setOpen(true);
    } else {
      // Open after delay
      this._openTimer = setTimeout(() => {
        this._wasInstantOpen = false;
        this._setOpen(true);
        this._openTimer = null;
      }, this._effectiveDelay);
    }
  }

  private _handleClose() {
    this._clearTimer();
    this._setOpen(false);
  }

  private _setOpen(value: boolean) {
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

    // Notify provider
    const provider = this._providerContext;
    if (provider) {
      if (value) {
        provider.onOpen();
      } else {
        provider.onClose();
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

  private _handleTriggerUnmount() {
    this._trigger = null;
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tooltip-root": TooltipRoot;
  }
}
