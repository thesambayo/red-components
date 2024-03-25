import { LitElement, html } from "lit";
import { ContextConsumer } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { AccordionContext, accordionContext } from "./accordion-context";

@customElement("accordion-trigger")
export class AccordionTrigger extends LitElement {

  _consumer = new ContextConsumer(this, {
    context: accordionContext,
    subscribe: true,
    callback: (e) => window.requestAnimationFrame(() => this.listenToAccContextUpdates(e)),
  });

  // @state() isOpened = false;

  connectedCallback() {

    super.connectedCallback();
    this.setAttribute("tabindex", "0");
  }

  render() {
    return html`
      <slot></slot>
      <slot name="accordion-chevron">
      </slot>
    `;
  }

  private listenToAccContextUpdates(context: AccordionContext) {
    const { value } = context;
    const accValue = this.parentElement?.getAttribute("value");
    if (accValue && value.includes(accValue)) {
      // this.isOpened = true;
      this.setAttribute("data-state", "open");
      this.setAttribute("aira-expanded", "true");
    } else {
      // this.isOpened = false;
      this.setAttribute("data-state", "closed");
      this.setAttribute("aira-expanded", "false");
    }
  }
}
