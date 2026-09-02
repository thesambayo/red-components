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
  Middleware,
  Placement,
} from "@floating-ui/dom";
import { FloatingController } from "@red-elements/core";
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
    /*
     * The UA stylesheet gives every [popover] \`margin: auto\`, \`inset: 0\`,
     * \`border: solid\`, \`padding: .25em\` and \`background-color: Canvas\`, so
     * some reset is unavoidable. But border, padding and background are
     * exactly what a consumer most wants to set, and an unlayered :host rule
     * beats the layered utilities that Tailwind and friends emit - which is
     * why a styled <select-content> rendered with no background, border or
     * padding while its <select-item> children styled fine.
     *
     * Declaring the reset in a layer fixes that: an author layer still beats
     * the UA origin, while a consumer rule in another tree wins on context.
     * Only \`position\` stays unlayered - overriding it breaks positioning
     * outright, and floating-ui writes left/top inline anyway.
     */
    @layer red-popover-reset {
      :host {
        margin: 0;
        inset: auto;
        padding: 0;
        border: 0;
        background: transparent;
        outline: none;
      }
    }

    :host {
      position: fixed;
    }

    :host(:not(:popover-open)) {
      display: none;
    }

    /* Paired with FloatingController's gate: hides the content until the first
       position has been computed, so it never paints against the trigger's
       old coordinates. */
    :host([data-floating-hidden]) {
      visibility: hidden;
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

  /**
   * Keeps the tooltip anchored to its trigger. Previously a single
   * `computePosition` on open, so the tooltip detached on scroll or resize -
   * particularly visible for a tooltip left open while the page moves.
   */
  private _floating = new FloatingController(this, {
    placement: () => this._getPlacement(),
    middleware: () => this._buildMiddleware(),
    onPositioned: ({ placement, middlewareData }) => {
      const [side] = placement.split("-");

      if (middlewareData.transformOrigin) {
        this.style.setProperty(
          "--tooltip-content-transform-origin",
          `${middlewareData.transformOrigin.x} ${middlewareData.transformOrigin.y}`
        );
      }

      this.setAttribute(
        "data-state",
        this._rootContext?.stateAttribute ?? "instant-open"
      );

      if (this._arrowElement && middlewareData.arrow) {
        const { x: arrowX, y: arrowY } = middlewareData.arrow;
        Object.assign(this._arrowElement.style, {
          left: arrowX != null ? `${arrowX}px` : "",
          top: arrowY != null ? `${arrowY}px` : "",
        });
        this._arrowElement.setAttribute("data-side", side);
      }

      // Hide when the trigger has been scrolled out of view.
      this.style.visibility = middlewareData.hide?.referenceHidden
        ? "hidden"
        : "";
    },
  });

  private _buildMiddleware(): Middleware[] {
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

    return middleware;
  }

  private _show() {
    const trigger = this._rootContext?.trigger;
    if (!trigger) return;

    // Set ID for aria-describedby
    if (this._rootContext?.contentId) {
      this.setAttribute("id", this._rootContext.contentId);
    }

    // Gate before showing: `showPopover()` reveals the element synchronously,
    // so the hide has to be in place first or one unpositioned frame paints.
    if (!this._isPopoverOpen) {
      this._floating.gate();
      this.showPopover();
      this._isPopoverOpen = true;
    }

    // Arrow must be resolved before the middleware stack is built.
    this._arrowElement = this.querySelector("tooltip-arrow");

    this._floating.start(trigger);
  }

  private _hide() {
    this._floating.stop();
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
