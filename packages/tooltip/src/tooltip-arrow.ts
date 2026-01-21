import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Optional arrow element that points to the trigger.
 * Must be placed inside tooltip-content.
 *
 * @element tooltip-arrow
 *
 * @cssprop --tooltip-arrow-fill - Fill color of the arrow (default: currentColor)
 *
 * @example
 * ```html
 * <tooltip-content>
 *   <tooltip-arrow></tooltip-arrow>
 *   Tooltip text
 * </tooltip-content>
 * ```
 */
@customElement("tooltip-arrow")
export class TooltipArrow extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      pointer-events: none;
      width: var(--arrow-width, 10px);
      height: var(--arrow-height, 5px);
    }

    svg {
      display: block;
      fill: var(--tooltip-arrow-fill, currentColor);
    }

    /* Position arrow based on data-side */
    :host([data-side="top"]) {
      bottom: 0;
      transform: translateY(100%);
    }

    :host([data-side="bottom"]) {
      top: 0;
      transform: translateY(-100%) rotate(180deg);
    }

    :host([data-side="left"]) {
      right: 0;
      transform: translateX(100%) rotate(-90deg);
    }

    :host([data-side="right"]) {
      left: 0;
      transform: translateX(-100%) rotate(90deg);
    }
  `;

  /**
   * Width of the arrow in pixels
   */
  @property({ type: Number })
  width = 10;

  /**
   * Height of the arrow in pixels
   */
  @property({ type: Number })
  height = 5;

  connectedCallback() {
    super.connectedCallback();
    this.style.setProperty("--arrow-width", `${this.width}px`);
    this.style.setProperty("--arrow-height", `${this.height}px`);
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("width") || changed.has("height")) {
      this.style.setProperty("--arrow-width", `${this.width}px`);
      this.style.setProperty("--arrow-height", `${this.height}px`);
    }
  }

  protected render() {
    return html`
      <svg
        width="${this.width}"
        height="${this.height}"
        viewBox="0 0 ${this.width} ${this.height}"
        preserveAspectRatio="none"
      >
        <polygon points="0,${this.height} ${this.width / 2},0 ${this.width},${this.height}" />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tooltip-arrow": TooltipArrow;
  }
}
