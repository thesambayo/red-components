import { css, html, LitElement, nothing, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { ToastContext, toastContext } from "./toast-context";
import { when } from "lit/directives/when.js";

@customElement("toast-viewport")
export class ToastViewport extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      padding: 25px;
      gap: 10px;
      width: 390px;
      max-width: 100vw;
      margin: 0;
      list-style: none;
      z-index: 2147483647;
      outline: none;
    }
  `;

  @state()
  private _consumer = new ContextConsumer(this, {
    context: toastContext,
    subscribe: true,
    callback: (e) => this.toastContextCallBack(e),
  });

  toastContextCallBack(e: ToastContext): void {
    console.log(e);
  }

  protected render() {
    const toastTemplates: TemplateResult<1>[] = [];

    for (const toast of this._consumer.value?.toasts ?? []) {
      toastTemplates.push(html` <toast-root .id=${toast.id} .open=${toast.open}>
        ${toast.content}
      </toast-root>`);
    }
    return html`
      <!-- <p>viewport</p> -->
      ${when(
        toastTemplates.length > 0,
        () => html`${toastTemplates}`,
        () => html`${nothing}`
      )}
    `;
  }
}
