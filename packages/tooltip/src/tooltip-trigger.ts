import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { tooltipContext } from "./tooltip.context";

// Events to turn on the tooltip
const enterEvents = ["pointerenter", "focus"];
// Events to turn off the tooltip
const leaveEvents = ["pointerleave", "blur", "keydown", "click"];

@customElement("tooltip-trigger")
export class TooltipTrigger extends LitElement {
  @state()
  _consumer = new ContextConsumer(this, {
    context: tooltipContext,
    subscribe: true,
  });

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");

    enterEvents.forEach((name) => {
      this.addEventListener(name, () => this._consumer.value?.onOpen(name));
    });
    leaveEvents.forEach((name) => {
      this.addEventListener(name, () => this._consumer.value?.onclose(name));
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    enterEvents.forEach((name) => {
      this.removeEventListener(name, () => this._consumer.value?.onOpen(name));
    });
    leaveEvents.forEach((name) => {
      this.removeEventListener(name, () => this._consumer.value?.onclose(name));
    });
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
