import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  shift,
  offset,
  flip,
  size,
  computePosition,
  ComputePositionConfig,
  Placement,
  Middleware,
} from "@floating-ui/dom";
import { ContextConsumer } from "@lit/context";
import { DropdownContext, dropdownContext } from "./dropdown.context";

const SIDE_OPTIONS = ["top", "right", "bottom", "left"] as const;
const ALIGN_OPTIONS = ["start", "center", "end"] as const;
type Side = (typeof SIDE_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];

@customElement("dropdown-content")
export class DropdownContent extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      pointer-events: auto;
    }

    :host([data-state="closed"]) {
      display: none !important;
    }
  `;

  @state()
  private _consumer = new ContextConsumer(this, {
    context: dropdownContext,
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

  private focusableItems: HTMLElement[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
    this.setAttribute("role", "menu");
    this.setAttribute("data-state", "closed");

    this.addEventListener("click", (e) => e.stopPropagation());
    this.addEventListener("keydown", this.handleKeyDown);
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    const open = this._consumer.value?.isOpen;
    if (open) {
      this.showContent();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", (e) => e.stopPropagation());
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  protected render() {
    return html` <slot></slot> `;
  }

  private tooltipContextCallback(context: DropdownContext) {
    if (!context) return;
    context.isOpen ? this.showContent() : this.hideContent();
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
        flip({
          fallbackAxisSideDirection: "start",
          crossAxis: false,
        }),
        size({
          apply: ({ availableHeight, availableWidth, rects, elements }) => {
            const { width: anchorWidth, height: anchorHeight } =
              rects.reference;
            elements.floating.style.setProperty(
              "--dropdown-trigger-width",
              `${anchorWidth}px`
            );
            elements.floating.style.setProperty(
              "--dropdown-trigger-height",
              `${anchorHeight}px`
            );
            elements.floating.style.setProperty(
              "--dropdown-content-available-width",
              `${availableWidth}px`
            );
            elements.floating.style.setProperty(
              "--dropdown-content-available-height",
              `${availableHeight}px`
            );
          },
        }),
        this.transformOrigin({ arrowHeight: 0, arrowWidth: 0 }),
      ],
    });

    const { x, y, placement, middlewareData } = computedPosition;
    this.style.setProperty(
      "--dropdown-content-transform-origin",
      [
        middlewareData.transformOrigin?.x,
        middlewareData.transformOrigin?.y,
      ].join(" ")
    );
    this.style.top = `${y}px`;
    this.style.left = `${x}px`;
    this.setAttribute("data-state", "open");
    trigger.setAttribute("data-state", "open");
    const [side, align] = placement.split("-");
    this.setAttribute("data-side", side);
    this.setAttribute("data-align", align ?? "center");
    setTimeout(() => {
      this.focus();
    }, 0);
  }

  private hideContent() {
    this.style.cssText = "";
    this.setAttribute("data-state", "closed");
    this._consumer.value?.trigger?.setAttribute("data-state", "closed");
    this.removeAttribute("data-side");
    this.removeAttribute("data-align");
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this._consumer.value?.isOpen) {
      return;
    }

    // Update focusable items
    this.focusableItems = Array.from(
      this.querySelectorAll("dropdown-item")
    ) as HTMLElement[];

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusNextItem();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusPreviousItem();
        break;
      case "Escape":
        event.preventDefault();
        this._consumer.value.onClose("keyboard");
        break;
    }
  }

  private focusNextItem() {
    const currentIndex = this.focusableItems.findIndex(
      (item) => item === document.activeElement
    );

    let nextIndex;
    if (currentIndex === -1) {
      // No item focused, focus first item
      nextIndex = 0;
    } else {
      // Focus next item, or wrap to first
      nextIndex =
        currentIndex === this.focusableItems.length - 1 ? 0 : currentIndex + 1;
    }

    this.setFocusableItemTabIndex(this.focusableItems, nextIndex);
    // this.focusableItems[nextIndex]?.focus();
  }

  private focusPreviousItem() {
    const currentIndex = this.focusableItems.findIndex(
      (item) => item === document.activeElement
    );

    let previousIndex;
    if (currentIndex === -1) {
      // No item focused, focus last item
      previousIndex = this.focusableItems.length - 1;
    } else {
      // Focus previous item, or wrap to last
      previousIndex =
        currentIndex === 0 ? this.focusableItems.length - 1 : currentIndex - 1;
    }

    this.setFocusableItemTabIndex(this.focusableItems, previousIndex);
    // this.focusableItems[previousIndex]?.focus();
  }

  private setFocusableItemTabIndex(items: HTMLElement[], activeIndex: number) {
    items[activeIndex]?.focus();
    // items.forEach((item, index) => {
    //   const isActive = index === activeIndex;
    //   item.setAttribute("tabindex", isActive ? "0" : "-1");
    //   isActive
    //     ? item.setAttribute("data-highlighted", "")
    //     : item.removeAttribute("data-highlighted");
    // });
  }
}
