import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { tooltipProviderContext } from "./context";
import type { TooltipProviderContextValue } from "./types";

/**
 * Optional provider for coordinating multiple tooltips.
 * When used, tooltips that open shortly after another closes will skip the delay.
 *
 * @element tooltip-provider
 *
 * @example
 * ```html
 * <tooltip-provider delay-duration="400" skip-delay-duration="200">
 *   <tooltip-root>...</tooltip-root>
 *   <tooltip-root>...</tooltip-root>
 * </tooltip-provider>
 * ```
 */
@customElement("tooltip-provider")
export class TooltipProvider extends LitElement {
  /**
   * Default delay duration for all child tooltips (ms)
   */
  @property({ type: Number, attribute: "delay-duration" })
  delayDuration = 500;

  /**
   * How long to keep instant-open active after a tooltip closes (ms)
   */
  @property({ type: Number, attribute: "skip-delay-duration" })
  skipDelayDuration = 300;

  /** Whether delay should be applied (resets after skipDelayDuration) */
  @state()
  private _isOpenDelayed = true;

  /** Timer for resetting delay state */
  private _skipDelayTimer: ReturnType<typeof setTimeout> | null = null;

  @provide({ context: tooltipProviderContext })
  @property({ attribute: false })
  context: TooltipProviderContextValue = this._createContext();

  connectedCallback() {
    super.connectedCallback();
    this._updateContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._skipDelayTimer) {
      clearTimeout(this._skipDelayTimer);
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (
      changed.has("delayDuration") ||
      changed.has("skipDelayDuration") ||
      changed.has("_isOpenDelayed")
    ) {
      this._updateContext();
    }
  }

  private _createContext(): TooltipProviderContextValue {
    return {
      isOpenDelayed: this._isOpenDelayed,
      delayDuration: this.delayDuration,
      skipDelayDuration: this.skipDelayDuration,
      onOpen: this._handleOpen.bind(this),
      onClose: this._handleClose.bind(this),
    };
  }

  private _updateContext() {
    this.context = this._createContext();
  }

  private _handleOpen() {
    // Clear any pending reset timer
    if (this._skipDelayTimer) {
      clearTimeout(this._skipDelayTimer);
      this._skipDelayTimer = null;
    }
    // Disable delay for next tooltip
    this._isOpenDelayed = false;
  }

  private _handleClose() {
    // Start timer to re-enable delay
    this._skipDelayTimer = setTimeout(() => {
      this._isOpenDelayed = true;
      this._skipDelayTimer = null;
    }, this.skipDelayDuration);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tooltip-provider": TooltipProvider;
  }
}
