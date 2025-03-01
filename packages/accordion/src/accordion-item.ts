import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { AccordionContext, accordionContext } from "./accordion-context";

@customElement("accordion-item")
export class AccordionItem extends LitElement {
  _consumer = new ContextConsumer(this, {
    context: accordionContext,
    subscribe: true,
    callback: (e) =>
      requestAnimationFrame(() => this.listenToAccContextUpdates(e)),
  });

  @property({ type: String, attribute: "value", reflect: true })
  value?: string;

  // @property()
  // disabled?: boolean;

  render() {
    return html`<slot></slot>`;
  }

  private listenToAccContextUpdates(context: AccordionContext) {
    if (!this.value) {
      console.warn("primitives item has no value");
      return;
    }
    const { value } = context;
    if (this.value && value.includes(this.value)) {
      this.setAttribute("data-state", "open");
    } else {
      this.setAttribute("data-state", "closed");
    }
  }
}
