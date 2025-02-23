import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import {
  DEFAULT_DURATION,
  Toast,
  ToastContext,
  toastContext,
} from "./toast-context";
import { nextId } from "./randomId";

@customElement("toast-provider")
export class ToastProvider extends LitElement {
  @provide({ context: toastContext })
  @state()
  private _provider: ToastContext = {
    toasts: [],
    duration: DEFAULT_DURATION,
    addToast: (toast) => this.addToast(toast),
    removeToast: (id) => this.removeToast(id),
    updateToast: (id, updates) => this.updateToast(id, updates),
  };

  @property({ type: Number })
  accessor duration = DEFAULT_DURATION;

  private addToast(toast: Omit<Toast, "id">) {
    const newToast = { ...toast, id: nextId() };
    console.log(newToast);
    this._provider = {
      ...this._provider,
      toasts: [...this._provider.toasts, newToast],
    };
    console.log(this._provider.toasts);

    if (toast.duration !== 0) {
      setTimeout(() => {
        this.removeToast(newToast.id);
      }, toast.duration || this.duration);
    }
  }

  private removeToast(id: string) {
    this._provider = {
      ...this._provider,
      toasts: this._provider.toasts.filter((t) => t.id !== id),
    };
  }

  private updateToast(id: string, updates: Partial<Toast>) {
    this._provider = {
      ...this._provider,
      toasts: this._provider.toasts.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    };
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
