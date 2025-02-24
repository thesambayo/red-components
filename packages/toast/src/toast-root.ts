import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ToastEvent } from "./toast-api";
import { Toast, toastStore } from "./toast-store";

@customElement("toast-root")
export class ToastRoot extends LitElement {
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
  private toasts: Toast[] = [];

  private unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = toastStore.subscribe((toasts) => {
      this.toasts = toasts;
    });
    window.addEventListener(ToastEvent.eventName, toastStore.handleEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
    window.removeEventListener(ToastEvent.eventName, toastStore.handleEvent);
  }

  protected render() {
    return html`
      ${this.toasts.map(
        (toast) =>
          html`
            <li role="alert" id="${toast.id}" data-red-toast>
              ${unsafeHTML(toast.content)}
            </li>
          `
      )}
    `;
  }
}
