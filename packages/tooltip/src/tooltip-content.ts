import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import {
  shift,
  offset,
  flip,
  size,
  arrow,
  hide,
  computePosition,
  Middleware,
  Placement,
} from "@floating-ui/dom";
import { tooltipRootContext } from "./context";
import type {
  TooltipRootContextValue,
  TooltipSide,
  TooltipAlign,
} from "./types";

/**
 * The content that appears when the tooltip is open.
 * Positioned using floating-ui relative to the trigger.
 *
 * @element tooltip-content
 *
 * @csspart content - The content container
 *
 * @cssprop --tooltip-trigger-width - Width of the trigger element
 * @cssprop --tooltip-trigger-height - Height of the trigger element
 * @cssprop --tooltip-content-available-width - Available width before collision
 * @cssprop --tooltip-content-available-height - Available height before collision
 * @cssprop --tooltip-content-transform-origin - Transform origin for animations
 *
 * @example
 * ```html
 * <tooltip-content side="top" side-offset="8">
 *   Tooltip text here
 * </tooltip-content>
 * ```
 */
@customElement("tooltip-content")
export class TooltipContent extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
    }

    :host(:not(:popover-open)) {
      display: none;
    }
  `;

  @consume({ context: tooltipRootContext, subscribe: true })
  private _rootContext?: TooltipRootContextValue;

  /**
   * Which side of the trigger to display on
   */
  @property({ type: String })
  side: TooltipSide = "top";

  /**
   * Distance from trigger in pixels
   */
  @property({ type: Number, attribute: "side-offset" })
  sideOffset = 8;

  /**
   * Alignment along the side
   */
  @property({ type: String })
  align: TooltipAlign = "center";

  /**
   * Offset along alignment axis
   */
  @property({ type: Number, attribute: "align-offset" })
  alignOffset = 0;

  /**
   * Enable collision detection and repositioning
   */
  @property({ type: Boolean, attribute: "avoid-collisions" })
  avoidCollisions = true;

  /**
   * Padding from viewport edges for collision detection
   */
  @property({ type: Number, attribute: "collision-padding" })
  collisionPadding = 8;

  /**
   * Custom aria-label (overrides content text)
   */
  @property({ type: String, attribute: "aria-label" })
  ariaLabel?: string;

  /** Reference to arrow element if present */
  private _arrowElement: HTMLElement | null = null;

  /** Track current popover state */
  private _isPopoverOpen = false;

  /** Stored handler for hoverable content */
  private _handlePointerEnter = this._onPointerEnter.bind(this);
  private _handlePointerLeave = this._onPointerLeave.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Set popover attribute for manual control (no light dismiss)
    this.setAttribute("popover", "manual");

    // Set accessibility attributes
    this.setAttribute("role", "tooltip");

    // Add hover handlers for hoverable content
    this.addEventListener("pointerenter", this._handlePointerEnter);
    this.addEventListener("pointerleave", this._handlePointerLeave);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("pointerenter", this._handlePointerEnter);
    this.removeEventListener("pointerleave", this._handlePointerLeave);
  }

  protected willUpdate() {
    if (!this._rootContext) return;

    if (this._rootContext.open) {
      this._show();
    } else {
      this._hide();
    }
  }

  private _onPointerEnter() {
    // If hoverable content is enabled, keep tooltip open
    if (!this._rootContext?.disableHoverableContent) {
      this._rootContext?.onOpen(true); // instant open
    }
  }

  private _onPointerLeave() {
    // Close immediately when leaving content
    this._rootContext?.onClose(true);
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side;
    }
    return `${this.side}-${this.align}`;
  }

  private _transformOriginMiddleware(
    arrowWidth = 0,
    arrowHeight = 0
  ): Middleware {
    return {
      name: "transformOrigin",
      fn: (data) => {
        const { placement, rects, middlewareData } = data;
        const [placedSide, placedAlign = "center"] = placement.split("-") as [
          TooltipSide,
          TooltipAlign
        ];

        const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
        const isArrowHidden = cannotCenterArrow;
        const effectiveArrowWidth = isArrowHidden ? 0 : arrowWidth;
        const effectiveArrowHeight = isArrowHidden ? 0 : arrowHeight;

        const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[
          placedAlign
        ];
        const arrowXCenter =
          (middlewareData.arrow?.x ?? 0) + effectiveArrowWidth / 2;
        const arrowYCenter =
          (middlewareData.arrow?.y ?? 0) + effectiveArrowHeight / 2;

        let x = "";
        let y = "";

        if (placedSide === "bottom") {
          x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
          y = `${-effectiveArrowHeight}px`;
        } else if (placedSide === "top") {
          x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
          y = `${rects.floating.height + effectiveArrowHeight}px`;
        } else if (placedSide === "right") {
          x = `${-effectiveArrowHeight}px`;
          y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
        } else if (placedSide === "left") {
          x = `${rects.floating.width + effectiveArrowHeight}px`;
          y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
        }

        return { data: { x, y } };
      },
    };
  }

  private async _show() {
    const trigger = this._rootContext?.trigger;
    if (!trigger) return;

    // Set ID for aria-describedby
    if (this._rootContext?.contentId) {
      this.setAttribute("id", this._rootContext.contentId);
    }

    // Show popover first (enters top-layer)
    if (!this._isPopoverOpen) {
      this.showPopover();
      this._isPopoverOpen = true;
    }

    // Find arrow element if present
    this._arrowElement = this.querySelector("tooltip-arrow");

    // Build middleware stack
    const middleware: Middleware[] = [
      offset({
        mainAxis: this.sideOffset,
        crossAxis: this.alignOffset,
      }),
    ];

    if (this.avoidCollisions) {
      middleware.push(
        flip({ padding: this.collisionPadding }),
        shift({ padding: this.collisionPadding })
      );
    }

    middleware.push(
      size({
        padding: this.collisionPadding,
        apply: ({ availableHeight, availableWidth, rects }) => {
          this.style.setProperty(
            "--tooltip-trigger-width",
            `${rects.reference.width}px`
          );
          this.style.setProperty(
            "--tooltip-trigger-height",
            `${rects.reference.height}px`
          );
          this.style.setProperty(
            "--tooltip-content-available-width",
            `${availableWidth}px`
          );
          this.style.setProperty(
            "--tooltip-content-available-height",
            `${availableHeight}px`
          );
        },
      })
    );

    if (this._arrowElement) {
      middleware.push(arrow({ element: this._arrowElement, padding: 8 }));
    }

    middleware.push(
      hide({ strategy: "referenceHidden" }),
      this._transformOriginMiddleware()
    );

    // Compute position
    const result = await computePosition(trigger, this, {
      strategy: "fixed",
      placement: this._getPlacement(),
      middleware,
    });

    const { x, y, placement, middlewareData } = result;

    // Apply position
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;

    // Set transform origin for animations
    if (middlewareData.transformOrigin) {
      this.style.setProperty(
        "--tooltip-content-transform-origin",
        `${middlewareData.transformOrigin.x} ${middlewareData.transformOrigin.y}`
      );
    }

    // Set data attributes for styling
    const [side, align = "center"] = placement.split("-");
    this.setAttribute(
      "data-state",
      this._rootContext?.stateAttribute ?? "instant-open"
    );
    this.setAttribute("data-side", side);
    this.setAttribute("data-align", align);

    // Handle arrow positioning
    if (this._arrowElement && middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;
      Object.assign(this._arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
      });
      this._arrowElement.setAttribute("data-side", side);
    }

    // Hide if reference is hidden (scrolled away)
    if (middlewareData.hide?.referenceHidden) {
      this.style.visibility = "hidden";
    } else {
      this.style.visibility = "";
    }
  }

  private _hide() {
    if (this._isPopoverOpen) {
      this.hidePopover();
      this._isPopoverOpen = false;
    }
    this.setAttribute("data-state", "closed");
    this.removeAttribute("data-side");
    this.removeAttribute("data-align");
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tooltip-content": TooltipContent;
  }
}
