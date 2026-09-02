import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ToastEvent } from "./toast-api";
import { Toast, toastStore } from "./toast-store";
import {
  offsetConverter,
  toastColorStyles,
  toastRootPositionStyles,
} from "./toast-constants";

@customElement("toast-root")
export class ToastRoot extends LitElement {
  static styles = [toastRootPositionStyles, toastColorStyles];

  @state()
  private toasts: Toast[] = [];

  @state()
  private unsubscribe?: () => void;

  /**
   * Position of the toast root element.
   * Available positions:
   * `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, and `bottom-right`
   * @default bottom-right
   */
  @property({
    attribute: "position",
  })
  position = "bottom-right";

  /**
   * Theme of the toast root element.
   * Available themes:
   * `system`, `light`, and `dark`
   * @default system
   */
  @property({
    attribute: "theme",
  })
  theme: "system" | "light" | "dark" = "system";

  @property({
    attribute: "offset",
    type: Object,
    converter: offsetConverter,
  })
  offset: any | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("data-red-toaster", "");

    // prepare toast stylings start
    if (this.theme === "system") {
      this._applyColorScheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } else {
      this._applyColorScheme(this.theme === "dark");
    }

    const [y, x] = this.position.split("-");
    this.setAttribute("data-y-position", y);
    this.setAttribute("data-x-position", x);
    this._applyOffsets();
    // prepare toast stylings end

    this.unsubscribe = toastStore.subscribe((toasts) => {
      this.toasts = toasts;
    });
    window.addEventListener(ToastEvent.eventName, toastStore.handleEvent);

    // One stored MediaQueryList and one stored handler. Previously this added
    // an inline arrow and removed a *different* inline arrow, so the listener
    // survived every disconnect and accumulated.
    this._colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this._colorSchemeQuery.addEventListener(
      "change",
      this._handleColorSchemeChange
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
    window.removeEventListener(ToastEvent.eventName, toastStore.handleEvent);
    this._colorSchemeQuery?.removeEventListener(
      "change",
      this._handleColorSchemeChange
    );
    this._colorSchemeQuery = undefined;
  }

  protected render() {
    return html`
      ${this.toasts.map(
        (toast) =>
          html`
            <li
              role="alert"
              data-red-toast
              id="${toast.id}"
              data-type="${toast.type || nothing}"
            >
              ${toast.unsafeHtml !== undefined
                ? unsafeHTML(toast.unsafeHtml)
                : toast.content}
            </li>
          `
      )}
    `;
  }

  /** Stored so the exact same reference can be removed on disconnect. */
  private _colorSchemeQuery?: MediaQueryList;

  private _handleColorSchemeChange = (event: MediaQueryListEvent) => {
    // Only follow the OS when the consumer asked for "system".
    if (this.theme !== "system") return;
    this._applyColorScheme(event.matches);
  };

  private _applyColorScheme(isDarkMode: boolean) {
    this.setAttribute("data-red-theme", isDarkMode ? "dark" : "light");
  }

  private _applyOffsets() {
    const offset = this.offset;

    if (offset === null || offset === undefined) {
      // defaults already in css
      this.style.setProperty("--offset-top", "20px");
      this.style.setProperty("--offset-right", "20px");
      this.style.setProperty("--offset-bottom", "20px");
      this.style.setProperty("--offset-left", "20px");
      return;
    }

    if (typeof offset === "string" || typeof offset === "number") {
      // Apply string/number-based offset to all sides
      const value = typeof offset === "number" ? `${offset}px` : offset;
      this.style.setProperty("--offset-top", value);
      this.style.setProperty("--offset-right", value);
      this.style.setProperty("--offset-bottom", value);
      this.style.setProperty("--offset-left", value);
    }

    if (typeof offset === "object") {
      // Apply object-based offset to CSS variables
      this.style.setProperty("--offset-top", offset.top || "20px");
      this.style.setProperty("--offset-right", offset.right || "20px");
      this.style.setProperty("--offset-bottom", offset.bottom || "20px");
      this.style.setProperty("--offset-left", offset.left || "20px");
    }
  }
}
