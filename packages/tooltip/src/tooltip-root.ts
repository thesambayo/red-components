import { html, LitElement } from "lit";
import {customElement, property, state } from "lit/decorators.js";
import {provide} from "@lit/context";
import {DEFAULT_DELAY_DURATION, TooltipContext, tooltipContext, tooltipTags} from "./tooltip.context";
import {nextId} from "./randomId";

@customElement("tooltip-root")
export class TooltipRoot extends LitElement {


  @provide({ context: tooltipContext })
  @state()
  _provider: TooltipContext = {
    open: false,
    trigger: null,
    controlledState: false,
    delayDuration: DEFAULT_DELAY_DURATION,
    onOpen: (eventName: string) => this.handleOpenAction(eventName),
    onclose: (eventName: string) => this.handleCloseAction(eventName),
  };

  @property({ attribute: "open", type: Boolean })
  open = false;

  @property({ attribute: "default-open", type: Boolean })
  defaultOpen = false;

  @property({ attribute: "delay-duration", type: Number })
  delayDuration = DEFAULT_DELAY_DURATION;

  connectedCallback() {
    super.connectedCallback();

    requestAnimationFrame(() => {
      const trigger = this.configureTooltipChildren()
      this._provider = {
        ...this._provider,
        trigger: trigger,
        delayDuration: this.delayDuration,
        open: this.defaultOpen || this.open,
        controlledState: this.hasAttribute("open"),
      }
    });

  }

  protected render() {
    return html`<slot></slot>`;
  }

  private configureTooltipChildren() {
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
    return trigger;
  }

  private delayTimer?: number;
  // private skipDelayDuration?: NodeJS.Timeout;

  handleOpenAction = (_eventName: string) => {
    // console.log("opened", eventName);
    this.delayTimer = window.setTimeout(() => {
      this._provider = {
        ...this._provider,
        open: true,
      }
    }, this._provider.delayDuration);
  };

  handleCloseAction = (_eventName: string) => {
    // console.log("closed", eventName);
    window.clearTimeout(this.delayTimer);
    this._provider = {
      ...this._provider,
      open: false,
    }
  };

}
