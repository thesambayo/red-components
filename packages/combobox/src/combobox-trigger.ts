import { consume } from "@lit/context";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext, ComboboxRoot } from "./combobox-root";

/**
 * Trigger button for opening the combobox.
 * Shows the selected value and opens the combobox content on click.
 *
 * @element combobox-trigger
 * @slot - Button content
 *
 * @example
 * ```html
 * <combobox-trigger>Select framework...</combobox-trigger>
 * ```
 */
@customElement("combobox-trigger")
export class ComboboxTrigger extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
  `;

  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  private _root: ComboboxRoot | null = null;
  private _childElement: HTMLElement | null = null;

  /** Stored handler references for proper cleanup */
  private _handleClick = this._onClick.bind(this);
  private _handleKeyDown = this._onKeyDown.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Find root element
    this._root = this.closest("combobox-root") as ComboboxRoot;

    this._setupTrigger();
  }

  protected firstUpdated() {
    // Register trigger element with root
    if (this._root) {
      this._root.setTriggerElement(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._cleanupTrigger();

    // Unregister trigger
    if (this._root) {
      this._root.setTriggerElement(null);
    }
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("_context")) {
      this._updateState();
    }
  }

  private _setupTrigger() {
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);

    // Make focusable if not already
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    // Set accessibility attributes
    this.setAttribute("role", "button");
    this.setAttribute("aria-haspopup", "listbox");
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("data-state", "closed");
  }

  private _cleanupTrigger() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _onClick() {
    if (this._context.disabled) return;

    if (this._context.isOpen) {
      this._context.onClose();
    } else {
      this._context.onOpen();
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (this._context.disabled) return;

    if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      if (!this._context.isOpen) {
        this._context.onOpen();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!this._context.isOpen) {
        this._context.onOpen();
      }
    }
  }

  private _updateState() {
    const { isOpen } = this._context;
    const target = this;

    if (target) {
      target.setAttribute("aria-expanded", String(isOpen));
      target.setAttribute("data-state", isOpen ? "open" : "closed");
      target.setAttribute("aria-controls", this._context.contentId);
    }
  }

  /** The trigger element. The host is the trigger. */
  getTriggerElement(): HTMLElement {
    return this;
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-trigger": ComboboxTrigger;
  }
}
