import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { tooltipRootContext } from "./context";
import type { TooltipRootContextValue } from "./types";
import {
  attachTooltipTriggerBehavior,
  updateTooltipTriggerAttributes,
} from "./trigger-behavior";

/**
 * Trigger element that shows/hides the tooltip on interaction.
 * Wrap your interactive element (button, link, etc.) inside this.
 *
 * @element tooltip-trigger
 *
 * @example
 * ```html
 * <tooltip-trigger>
 *   <button>Hover me</button>
 * </tooltip-trigger>
 * ```
 */
@customElement("tooltip-trigger")
export class TooltipTrigger extends LitElement {
  @consume({ context: tooltipRootContext, subscribe: true })
  private _rootContext?: TooltipRootContextValue;

  /** Removes the shared behavior listeners. */
  private _disposeBehavior?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._rootContext?.onTriggerMount(this);
    this._disposeBehavior = attachTooltipTriggerBehavior(
      this,
      () => this._rootContext
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._rootContext?.onTriggerUnmount();
    this._disposeBehavior?.();
    this._disposeBehavior = undefined;
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  private _updateAttributes() {
    updateTooltipTriggerAttributes(this, this._rootContext);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tooltip-trigger": TooltipTrigger;
  }
}
