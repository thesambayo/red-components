import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { toastStore } from "./toast-store";

@customElement("toast-close")
export class ToastClose extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.handleClickEvent);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClickEvent);
  }

  protected render() {
    return html` <slot></slot>`;
  }

  /**
   * finds the first parent element with role="alert" and data-red-toast attributes
   * @param element
   * @returns element
   */
  private findToastParent(element: Element | null): Element | null {
    // Base cases
    if (!element) return null;

    // Check if current element matches the criteria
    if (element.matches('[role="alert"][data-red-toast]')) {
      return element;
    }

    // Recursively check parent
    return this.findToastParent(element.parentElement);
  }

  handleClickEvent(event: Event) {
    const toastElement = this.findToastParent(event.target as Element);
    if (!toastElement) return;
    toastStore.removeToast(toastElement.id, { manuallyDismiised: true });
  }
}
