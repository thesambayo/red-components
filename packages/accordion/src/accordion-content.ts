import { LitElement, html } from "lit";
import { ContextConsumer } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { AccordionContext, accordionContext } from "./accordion-context";

@customElement("accordion-content")
export class AccordionContent extends LitElement {

  _consumer = new ContextConsumer(this, {
    context: accordionContext,
    subscribe: true,
    callback: (e) => window.requestAnimationFrame(() => this.listenToAccContextUpdates(e)),
  });

  render() {
    return html` <slot></slot> `;
  }

  private listenToAccContextUpdates(context: AccordionContext) {
    const { value } = context;
    const accValue = this.parentElement?.getAttribute("value");
    if (accValue && value.includes(accValue)) {
      this.setAttribute("data-state", "open");
      this.removeAttribute("hidden");
    } else {
      this.setAttribute("data-state", "closed");
      this.toggleAttribute("hidden", true);
    }
  }
}
