import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import {
  flip,
  shift,
  offset,
  computePosition,
  ComputePositionConfig
} from "@floating-ui/dom";
// import {nextId} from "../../utils/useId";
import {ContextConsumer} from "@lit/context";
import {DEFAULT_DELAY_DURATION, tooltipContext, tooltipTags} from "./tooltip.context";

// Events to turn on/off the tooltip
const enterEvents = ["pointerenter", "focus"];
const leaveEvents = ["pointerleave", "blur", "keydown", "click"];

// @customElement("tooltip-content")
export class TooltipContent extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      pointer-events: none;
    }
  `;

  _consumer = new ContextConsumer(this, {
    context: tooltipContext,
    subscribe: true,
    callback: (e) => {
      console.log(e)
      // if (e && e.open) {
      //   this.show();
      // }
    }
  })

  /**
   * @defaultvalue top
   * */
  @property({type: String}) side: "top" | "right" | "bottom" | "left" = "top";

  /**
   * The distance in pixels from the trigger.
   * @defaultvalue 0
   * */
  @property({ type: Number, attribute: "side-offset" }) sideOffset = 0;

  /**
   * @defaultvalue top
   * */
  @property({type: String}) align: "start" | "end" | "center" = "center";

  /**
   * An offset in pixels from the "start" or "end" alignment options.
   * @defaultvalue 0
   * */
  @property({ type: Number, attribute: "align-offset" }) alignOffset = 0;

  _target: HTMLElement | null = null;

  get target() {
    return this._target;
  }

  set target(target: HTMLElement | null) {
    // Remove events from existing target
    if (this.target) {
      enterEvents.forEach((name) =>
          this.target!.removeEventListener(name, this.show),
      );
      leaveEvents.forEach((name) =>
          this.target!.removeEventListener(name, this.hide),
      );
    }
    // Add events to new target
    if (target) {
      enterEvents.forEach((name) => target.addEventListener(name, () => this.show()));
      leaveEvents.forEach((name) => target.addEventListener(name, this.hide));
    }
    this._target = target;
  }

  connectedCallback() {
    super.connectedCallback();
    this.hide();
    const prefix = "1";
    this.target ??= this.parentElement?.querySelector(tooltipTags.TRIGGER) ?? null;

    const contentId = this.id || `${prefix}-tooltip-content`;
    const triggerId = this.target?.id || `${prefix}-tooltip-trigger`

    this.target?.setAttribute("id", triggerId);
    this.target?.setAttribute("aria-description", contentId);

    this.id = contentId;
    this.setAttribute("aria-describedby", triggerId);
  }

  protected render() {
    return html`<slot></slot>`;
  }

  show = () => {
    window.setTimeout(() => {
      this.showContent();
    }, this._consumer.value?.delayDuration ?? DEFAULT_DELAY_DURATION)
  };

  private showContent() {
    if (!this.target) return;
    this.style.cssText = "";
    this.setAttribute("data-state", "open");
    this.target.setAttribute("data-state", "open");

    let placement: ComputePositionConfig['placement'];
    if (this.align.trim().length) {
      placement = this.align === "center" ? `${this.side}` : `${this.side}-${this.align}`;
    } else {
      placement = this.side;
    }

    // Robust positioning
    computePosition(this.target, this, {
      strategy: "fixed",
      placement: placement,
      middleware: [
        offset({
          mainAxis: this.sideOffset,
          crossAxis: this.alignOffset,
        }),
        shift(),
        flip()
      ],
    }).then(({x, y, placement}) => {
      this.style.top = `${y}px`;
      this.style.left = `${x}px`;

      const [side, align] = placement.split("-");
      this.setAttribute("data-side", side);
      this.setAttribute("data-align", align ?? "center");
    });
  }

  private hide = () => {
    this.style.cssText = "";
    this.style.display = "none";
    this.setAttribute("data-state", "closed");
    this.target?.setAttribute("data-state", "closed");
    this.removeAttribute("data-side");
    this.removeAttribute("data-align");
  };
}
customElements.define("tooltip-content", TooltipContent);