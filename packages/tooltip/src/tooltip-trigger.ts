import { html, LitElement } from "lit";
import {customElement, state} from "lit/decorators.js";
import {ContextConsumer} from "@lit/context";
import {tooltipContext} from "./tooltip.context";

// Events to turn on the tooltip
const enterEvents = ["pointerenter", "focus"];
// Events to turn off the tooltip
const leaveEvents = ["pointerleave", "blur", "keydown", "click"];
// fixme: click followed by pointerup should negate pointerenter

@customElement("tooltip-trigger")
export class TooltipTrigger extends LitElement {

  @state()
  _consumer = new ContextConsumer(this, {
    context: tooltipContext,
    subscribe: true,
  })

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");

    enterEvents.forEach((name) => {
      this.addEventListener(name, () => this._consumer.value?.onOpen(name));
    });
    leaveEvents.forEach((name) => {
      this.addEventListener(name, () => this._consumer.value?.onclose(name));
    });

    //     document.addEventListener("pointerup", (event) => {
    //       const eventTarget = event.target as HTMLElement | null;
    //       if (!eventTarget) return;
    //       // console.log(event, event.target)
    //       if (this.target?.contains(eventTarget)) {
    //         // console.log("contains")
    //       } else {
    //         // console.log("not contains")
    //       }
    //     });
  }

  disconnectedCallback() {
    enterEvents.forEach((name) => {
      this.removeEventListener(name, () => this._consumer.value?.onOpen(name));
    });
    leaveEvents.forEach((name) => {
      this.removeEventListener(name, () => this._consumer.value?.onclose(name));
    });
    super.disconnectedCallback();
  }

  protected render() {
    return html`<slot></slot>`;
  }

}
