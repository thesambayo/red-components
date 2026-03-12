import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { SelectContextValue } from "./select-context";
import { selectRootContext } from "./select-context";

/**
 * Trigger button for select component.
 * Opens/closes the select dropdown.
 *
 * @element select-trigger
 * @slot - Trigger content (typically contains select-value and icon)
 */
@customElement("select-trigger")
export class SelectTrigger extends LitElement {
  @consume({ context: selectRootContext, subscribe: true })
  @state()
  private _context!: SelectContextValue;

  connectedCallback() {
    super.connectedCallback();

    // Set ARIA attributes
    this.setAttribute("role", "combobox");
    this.setAttribute("aria-haspopup", "listbox");
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("tabindex", "0");

    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);

    // Unregister from root
    const root = this.closest("select-root") as any;
    if (root?.setTriggerElement) {
      root.setTriggerElement(null);
    }
  }

  protected firstUpdated() {
    // Register with root
    const root = this.closest("select-root") as any;
    if (root?.setTriggerElement) {
      root.setTriggerElement(this);
    }
  }

  protected updated() {
    // Update ARIA attributes based on context
    if (this._context) {
      this.setAttribute("aria-expanded", String(this._context.isOpen));
      this.setAttribute("aria-controls", this._context.contentId);

      if (this._context.disabled) {
        this.setAttribute("aria-disabled", "true");
        this.setAttribute("data-disabled", "");
        this.setAttribute("tabindex", "-1");
      } else {
        this.removeAttribute("aria-disabled");
        this.removeAttribute("data-disabled");
        this.setAttribute("tabindex", "0");
      }

      // Update data-state attribute
      this.setAttribute("data-state", this._context.isOpen ? "open" : "closed");

      // Show placeholder state
      if (!this._context.selectedValue ||
          (Array.isArray(this._context.selectedValue) && this._context.selectedValue.length === 0)) {
        this.setAttribute("data-placeholder", "");
      } else {
        this.removeAttribute("data-placeholder");
      }
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _handleClick = (e: Event) => {
    if (this._context?.disabled) {
      e.preventDefault();
      return;
    }

    this._context?.onToggle();
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (this._context?.disabled) return;

    const { key } = e;

    // Space, Enter, ArrowDown, ArrowUp open the select
    if (key === " " || key === "Enter" || key === "ArrowDown" || key === "ArrowUp") {
      e.preventDefault();
      if (!this._context.isOpen) {
        this._context.onOpen();
      }
    }

    // Escape closes
    if (key === "Escape" && this._context.isOpen) {
      e.preventDefault();
      this._context.onClose();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "select-trigger": SelectTrigger;
  }
}
