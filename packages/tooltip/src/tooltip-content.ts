import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {
  shift,
  offset,
  flip,
  size,
  computePosition,
  ComputePositionConfig,
} from "@floating-ui/dom";
import {ContextConsumer} from "@lit/context";
import { TooltipContext, tooltipContext } from "./tooltip.context";

@customElement("tooltip-content")
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
    callback: (e) => this.tooltipContextCallback(e)
  })

  /**
   * @defaultvalue top
   * */
  @property({type: String})
  side: "top" | "right" | "bottom" | "left" = "top";

  /**
   * The distance in pixels from the trigger.
   * @defaultvalue 0
   * */
  @property({ type: Number, attribute: "side-offset" })
  sideOffset = 0;

  /**
   * @defaultvalue top
   *
   * */
  @property({type: String})
  align: "start" | "end" | "center" = "center";

  /**
   * An offset in pixels from the "start" or "end" alignment options.
   * @defaultvalue 0
   * */
  @property({ type: Number, attribute: "align-offset" })
  alignOffset = 0;

  connectedCallback() {
    super.connectedCallback();
    this.hide();
  }

  protected render() {
    return html`<slot></slot>`;
  }


  private tooltipContextCallback(context: TooltipContext) {
    if (!context) return;
    const { open } = context;
    open ? this.show() : this.hide();
  }

  private show = () => {
      this.getContentPositioning();
  };

  private getContentPositioning() {
    const trigger = this._consumer.value?.trigger;
    if (!trigger) return;
    this.style.cssText = "";

    let placement: ComputePositionConfig['placement'];
    if (this.align.trim().length) {
      placement = this.align === "center" ? `${this.side}` : `${this.side}-${this.align}`;
    } else {
      placement = this.side;
    }

    // Robust positioning
    computePosition(trigger, this, {
      strategy: "fixed",
      placement: placement,
      middleware: [
        offset({
          mainAxis: this.sideOffset,
          crossAxis: this.alignOffset,
        }),
        shift(),
        flip(),
        size({
          apply: ({availableHeight, availableWidth, rects,elements}) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty('--tooltip-trigger-width', `${anchorWidth}px`);
            contentStyle.setProperty('--tooltip-trigger-height', `${anchorHeight}px`);
            contentStyle.setProperty('--tooltip-content-available-width', `${availableWidth}px`);
            contentStyle.setProperty('--tooltip-content-available-height', `${availableHeight}px`);
          },
        }),
      ],
    }).then(({x, y, placement}) => {
      this.setAttribute("data-state", "open");
      trigger.setAttribute("data-state", "open");
      this.style.top = `${y}px`;
      this.style.left = `${x}px`;
      const [side, align] = placement.split("-");
      this.setAttribute("data-side", side);
      this.setAttribute("data-align", align ?? "center");
    });
  };

  private hide = () => {
    this.style.cssText = "";
    this.style.display = "none";
    this.setAttribute("data-state", "closed");
    this._consumer.value?.trigger?.setAttribute("data-state", "closed");
    this.removeAttribute("data-side");
    this.removeAttribute("data-align");
  };
}