import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import {provide} from "@lit/context";
import {DEFAULT_DELAY_DURATION, TooltipContext, tooltipContext} from "./tooltip.context";

// @customElement("tooltip-root")
export class TooltipRoot extends LitElement {

  @provide({ context: tooltipContext })
  @property({ type: Object })
  _provider: TooltipContext = {
    open: false,
    delayDuration: DEFAULT_DELAY_DURATION,
  };

  @property({ attribute: "open", type: Boolean })
  open = false;

  @property({ attribute: "default-open", type: Boolean })
  defaultOpen = false;

  @property({ attribute: "delay-duration", type: Number })
  delayDuration = DEFAULT_DELAY_DURATION;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "tooltip");

    this._provider = {
      // open: this.defaultOpen || this.open,
      open: false,
      delayDuration: this.delayDuration,
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

customElements.define("tooltip-root", TooltipRoot)
