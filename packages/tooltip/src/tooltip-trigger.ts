import { html, LitElement } from "lit";

// @customElement("tooltip-trigger")
export class TooltipTrigger extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
customElements.define("tooltip-trigger", TooltipTrigger)
