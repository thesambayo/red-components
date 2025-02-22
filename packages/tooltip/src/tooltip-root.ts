import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import {
  DEFAULT_DELAY_DURATION,
  DEFAULT_SKIP_DELAY_DURATION,
  TooltipContext,
  tooltipContext,
  tooltipTags,
} from "./tooltip.context";
import { nextId } from "./randomId";

@customElement("tooltip-root")
export class TooltipRoot extends LitElement {
  @provide({ context: tooltipContext })
  @state()
  private _provider: TooltipContext = {
    open: false,
    trigger: null,
    controlledState: false,
    delayDuration: DEFAULT_DELAY_DURATION,
    skipDelayDuration: DEFAULT_SKIP_DELAY_DURATION,
    onOpen: (eventName: string) => this.handleOpenAction(eventName),
    onclose: (eventName: string) => this.handleCloseAction(eventName),
  };

  /**
   * The controlled display of tooltip content
   * @default false
   */
  @property({
    attribute: "open",
    type: Boolean,
    reflect: true,
    converter: {
      fromAttribute: (attrValue: string | null) => {
        if (attrValue === null) return false;
        if (attrValue === "") return true;
        return attrValue === "true";
      },
      toAttribute: (value: boolean | null) => {
        return value ? "true" : "false";
      },
    },
  })
  accessor open = false;

  /**
   * The initial open state of the tooltip. Use when you do not want to control the open state.
   * @default false
   */
  @property({
    attribute: "default-open",
    type: Boolean,
    converter: {
      fromAttribute: (attrValue: string | null) => {
        // When attribute is not present at all
        if (attrValue === null) return false;
        // When attribute is present without value (open="")
        if (attrValue === "") return true;
        // When attribute has explicit value
        return attrValue === "true";
      },
    },
  })
  accessor defaultOpen = false;

  /**
   * @description The duration from when the mouse enters a tooltip trigger until the tooltip content opens. Value is in milliseconds
   * @default 500 (which equals 0.5 seconds)
   * */
  @property({ attribute: "delay-duration", type: Number })
  accessor delayDuration = DEFAULT_DELAY_DURATION;

  /**
   * @description How much time a user has to enter another trigger without incurring a delay again.
   * @default 10000 (which equals 10 seconds)
   * */
  @property({ attribute: "skip-delay-duration", type: Number })
  accessor skipDelayDuration = DEFAULT_SKIP_DELAY_DURATION;

  private delayTimer?: number;
  private lastShownTime: number = 0;

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("role", "tooltip");
    const tooltipPrefix = nextId();
    const trigger = this.querySelector<HTMLElement>(tooltipTags.TRIGGER);
    const content = this.querySelector<HTMLElement>(tooltipTags.CONTENT);
    const triggerId = trigger?.id || `${tooltipPrefix}-tooltip-trigger`;
    const contentId = content?.id || `${tooltipPrefix}-tooltip-content`;
    trigger?.setAttribute("id", triggerId);
    trigger?.setAttribute("aria-description", contentId);
    content?.setAttribute("id", contentId);
    content?.setAttribute("aria-describedby", triggerId);

    this._provider = {
      ...this._provider,
      trigger: trigger,
      delayDuration: this.delayDuration,
      skipDelayDuration: this.skipDelayDuration,
      open: this.defaultOpen || this.open,
      controlledState: this.hasAttribute("open"),
    };
  }

  protected willUpdate(_changedProperties: Map<string, any>): void {
    for (const [key] of _changedProperties.entries()) {
      if (key === "_provider") {
        this.open = this._provider.open;
      } else {
        this._provider = {
          ...this._provider,
          [key]: this[key as keyof this],
        };
      }
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  openContent() {
    this._provider = {
      ...this._provider,
      open: true,
    };
    this.lastShownTime = Date.now();
    this.emitOpenEvent(true);
  }

  emitOpenEvent(isOpen: boolean) {
    this.dispatchEvent(
      new CustomEvent("openChange", {
        detail: { open: isOpen },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleOpenAction(_eventName: string) {
    const currentTime = Date.now();
    const timeSinceLastShown = currentTime - this.lastShownTime;

    if (timeSinceLastShown < this._provider.skipDelayDuration) {
      this.openContent();
    } else {
      this.delayTimer = window.setTimeout(() => {
        this.openContent();
      }, this._provider.delayDuration);
    }
  }

  handleCloseAction = (_eventName: string) => {
    window.clearTimeout(this.delayTimer);
    this._provider = {
      ...this._provider,
      open: false,
    };
    this.emitOpenEvent(false);
  };
}
