import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide, consume } from "@lit/context";
import {
  tooltipProviderContext,
  tooltipRootContext,
  defaultProviderContext,
  generateId,
  TOOLTIP_EVENTS,
} from "./context";
import type {
  TooltipProviderContextValue,
  TooltipRootContextValue,
  TooltipState,
} from "./types";
import { ControlledState, dispatch, attachBehavior } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";
import {
  attachTooltipTriggerBehavior,
  updateTooltipTriggerAttributes,
} from "./trigger-behavior";

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
   * @default false
   */
  @property({ type: Boolean, attribute: "disable-hoverable-content" })
  disableHoverableContent = false;

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

  /** Tracks if current open was instant (no delay) */
  @state()
  private _wasInstantOpen = false;

  /** Reference to trigger element */
  @state()
  private _trigger: HTMLElement | null = null;

  /** Unique ID for content */
  private _contentId = generateId("tooltip-content");

  /** Delay timer for opening */
  private _openTimer: ReturnType<typeof setTimeout> | null = null;

  /** Delay timer for closing (when hoverable content is enabled) */
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;

  /** Consume provider context (optional) */
  @consume({ context: tooltipProviderContext, subscribe: true })
  private _providerContext?: TooltipProviderContextValue;

  /** Provide root context to children */
  @provide({ context: tooltipRootContext })
  @property({ attribute: false })
  context: TooltipRootContextValue = this._createContext();

  /** Whether controlled mode is active */
  private get _isControlled(): boolean {
    return this._openState.isControlled;
  }

  /** Current open state (controlled or uncontrolled) */
  private get _isOpen(): boolean {
    return this._openState.value;
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

  /** Elements wired through the `data-tooltip-trigger` escape hatch. */
  private _escapeHatchTriggers = new Set<HTMLElement>();
  private _disposeTriggerBehavior?: BehaviorCleanup;

  connectedCallback() {
    super.connectedCallback();
    this._setupBehaviorAttributes();
    this._updateContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearOpenTimer();
    this._clearCloseTimer();
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = undefined;
    this._escapeHatchTriggers.clear();
  }

  /**
   * Escape hatch: bring your own element instead of `<tooltip-trigger>`.
   *
   *   <button data-tooltip-trigger>Hover me</button>
   *
   * Uses the same behavior module as the custom element, so hover delay,
   * focus-visible handling and hoverable content all match exactly.
   */
  private _setupBehaviorAttributes() {
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = attachBehavior(
      this,
      "[data-tooltip-trigger]",
      (element) => {
        const dispose = attachTooltipTriggerBehavior(
          element,
          () => this.context
        );
        this._escapeHatchTriggers.add(element);
        this._handleTriggerMount(element);
        updateTooltipTriggerAttributes(element, this.context);
        return () => {
          dispose();
          this._escapeHatchTriggers.delete(element);
        };
      }
    );
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

      // <tooltip-trigger> reflects state via its own willUpdate; escape-hatch
      // elements are plain DOM, so the root updates them.
      for (const element of this._escapeHatchTriggers) {
        updateTooltipTriggerAttributes(element, this.context);
      }
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

  private _clearOpenTimer() {
    if (this._openTimer) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
  }

  private _clearCloseTimer() {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  private _handleOpen(instant = false) {
    // Clear any pending timers
    this._clearOpenTimer();
    this._clearCloseTimer();

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

  private _handleClose(instant = false) {
    // Clear any pending open timer
    this._clearOpenTimer();

    // If hoverable content is enabled and not instant, delay the close
    if (!instant && !this.disableHoverableContent) {
      // Clear any existing close timer
      this._clearCloseTimer();

      // Delay close to give user time to move pointer to content
      this._closeTimer = setTimeout(() => {
        this._setOpen(false);
        this._closeTimer = null;
      }, 300); // 300ms grace period
    } else {
      // Close immediately
      this._clearCloseTimer();
      this._setOpen(false);
    }
  }

  private _setOpen(value: boolean) {
    if (this._isControlled) {
      // In controlled mode, just emit event
      this._emitOpenChange(value);
    } else {
      // In uncontrolled mode, update internal state
      if (this._openState.set(value)) {
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
    dispatch(this, TOOLTIP_EVENTS.OPEN_CHANGE, { open });
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
