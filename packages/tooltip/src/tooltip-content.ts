import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  shift,
  offset,
  flip,
  size,
  computePosition,
  ComputePositionConfig,
} from "@floating-ui/dom";
import { ContextConsumer } from "@lit/context";
import { TooltipContext, tooltipContext } from "./tooltip.context";

@customElement("tooltip-content")
export class TooltipContent extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      display: none;
      pointer-events: none;
    }
  `;

  @state()
  private _consumer = new ContextConsumer(this, {
    context: tooltipContext,
    subscribe: true,
    callback: (e) => this.tooltipContextCallback(e),
  });

  /**
   * The side of the trigger to display the content
   * @defaultvalue top
   * */
  @property({ type: String })
  side: "top" | "right" | "bottom" | "left" = "top";

  /**
   * The distance in pixels from the trigger.
   * @defaultvalue 0
   * */
  @property({ type: Number, attribute: "side-offset" })
  sideOffset = 0;

  /**
   * The alignment of the content relative to the trigger
   * @defaultvalue center
   * */
  @property({ type: String })
  align: "start" | "end" | "center" = "center";

  /**
   * An offset in pixels from the "start" or "end" alignment options.
   * @defaultvalue 0
   * */
  @property({ type: Number, attribute: "align-offset" })
  alignOffset = 0;

  connectedCallback() {
    super.connectedCallback();
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    const open = this._consumer.value?.open;
    if (open) {
      this.showContent();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private tooltipContextCallback(context: TooltipContext) {
    if (!context) return;
    const { open } = context;
    open ? this.showContent() : this.hideContent();
  }

  private showContent() {
    const trigger = this._consumer.value?.trigger;
    if (!trigger) return;
    this.style.cssText = "";
    this.style.display = "block";

    let placement: ComputePositionConfig["placement"];
    if (this.align.trim().length) {
      placement =
        this.align === "center" ? `${this.side}` : `${this.side}-${this.align}`;
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
          apply: ({ availableHeight, availableWidth, rects, elements }) => {
            const { width: anchorWidth, height: anchorHeight } =
              rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty(
              "--tooltip-trigger-width",
              `${anchorWidth}px`,
            );
            contentStyle.setProperty(
              "--tooltip-trigger-height",
              `${anchorHeight}px`,
            );
            contentStyle.setProperty(
              "--tooltip-content-available-width",
              `${availableWidth}px`,
            );
            contentStyle.setProperty(
              "--tooltip-content-available-height",
              `${availableHeight}px`,
            );
          },
        }),
      ],
    }).then(({ x, y, placement }) => {
      this.setAttribute("data-state", "open");
      trigger.setAttribute("data-state", "open");
      // this.style.display = "block";
      this.style.top = `${y}px`;
      this.style.left = `${x}px`;
      const [side, align] = placement.split("-");
      this.setAttribute("data-side", side);
      this.setAttribute("data-align", align ?? "center");
    });
  }

  private hideContent() {
    this.style.cssText = "";
    this.style.display = "none";
    this.setAttribute("data-state", "closed");
    this._consumer.value?.trigger?.setAttribute("data-state", "closed");
    this.removeAttribute("data-side");
    this.removeAttribute("data-align");
  }
}
