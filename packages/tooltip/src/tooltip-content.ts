import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  shift,
  offset,
  flip,
  size,
  computePosition,
  ComputePositionConfig,
  Middleware,
  Placement,
} from "@floating-ui/dom";
import { ContextConsumer } from "@lit/context";
import { TooltipContext, tooltipContext } from "./tooltip.context";

const SIDE_OPTIONS = ["top", "right", "bottom", "left"] as const;
const ALIGN_OPTIONS = ["start", "center", "end"] as const;
type Side = (typeof SIDE_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];

@customElement("tooltip-content")
export class TooltipContent extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      pointer-events: none;
    }

    :host([data-state="closed"]) {
      display: none !important;
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
  side: Side = "top";

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
  align: Align = "center";

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

  transformOrigin = (options: {
    arrowWidth: number;
    arrowHeight: number;
  }): Middleware => {
    function getSideAndAlignFromPlacement(placement: Placement) {
      const [side, align = "center"] = placement.split("-");
      return [side as Side, align as Align] as const;
    }
    return {
      name: "transformOrigin",
      options,
      fn(data) {
        const { placement, rects, middlewareData } = data;

        const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
        const isArrowHidden = cannotCenterArrow;
        const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
        const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
        const [placedSide, placedAlign] =
          getSideAndAlignFromPlacement(placement);
        const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[
          placedAlign
        ];

        const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
        const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;

        let x = "";
        let y = "";

        if (placedSide === "bottom") {
          x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
          y = `${-arrowHeight}px`;
        } else if (placedSide === "top") {
          x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
          y = `${rects.floating.height + arrowHeight}px`;
        } else if (placedSide === "right") {
          x = `${-arrowHeight}px`;
          y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
        } else if (placedSide === "left") {
          x = `${rects.floating.width + arrowHeight}px`;
          y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
        }
        return { data: { x, y } };
      },
    };
  };

  private async showContent() {
    const trigger = this._consumer.value?.trigger;
    if (!trigger) return;
    this.style.cssText = "";
    this.setAttribute("data-state", "open");

    let initialPlacement: ComputePositionConfig["placement"];
    if (this.align.trim().length) {
      initialPlacement =
        this.align === "center" ? `${this.side}` : `${this.side}-${this.align}`;
    } else {
      initialPlacement = this.side;
    }

    // Robust positioning
    const computedPosition = await computePosition(trigger, this, {
      strategy: "fixed",
      placement: initialPlacement,
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
              `${anchorWidth}px`
            );
            contentStyle.setProperty(
              "--tooltip-trigger-height",
              `${anchorHeight}px`
            );
            contentStyle.setProperty(
              "--tooltip-content-available-width",
              `${availableWidth}px`
            );
            contentStyle.setProperty(
              "--tooltip-content-available-height",
              `${availableHeight}px`
            );
          },
        }),
        this.transformOrigin({ arrowHeight: 0, arrowWidth: 0 }),
      ],
    });

    const { x, y, placement, middlewareData } = computedPosition;
    this.style.top = `${y}px`;
    this.style.left = `${x}px`;
    this.style.setProperty(
      "--tooltip-content-transform-origin",
      [
        middlewareData.transformOrigin?.x,
        middlewareData.transformOrigin?.y,
      ].join(" ")
    );
    this.setAttribute("data-state", "open");
    trigger.setAttribute("data-state", "open");
    const [side, align] = placement.split("-");
    this.setAttribute("data-side", side);
    this.setAttribute("data-align", align ?? "center");
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
