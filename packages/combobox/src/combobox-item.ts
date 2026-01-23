import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext } from "./combobox-root";

/**
 * Selectable option within combobox.
 *
 * @element combobox-item
 * @slot - Item content
 */
@customElement("combobox-item")
export class ComboboxItem extends LitElement {
  @property({ type: String })
  value!: string; // required

  @property({ type: Boolean })
  disabled = false;

  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  protected firstUpdated() {
    // Set unique ID for aria-activedescendant
    this.setAttribute("id", `${this._context.contentId}-${this.value}`);

    // Register with root
    this._context.registerItem(this.value, {
      value: this.value,
      textContent: this.textContent?.trim() || "",
      disabled: this.disabled,
      element: this,
    });
  }

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("role", "option");
    this.setAttribute("tabindex", "-1");

    this._updateDisabledState();

    this.addEventListener("click", this._handleClick);
    this.addEventListener("pointerenter", this._handlePointerEnter);
    this.addEventListener("pointermove", this._handlePointerMove);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unregister from root
    this._context.unregisterItem(this.value);

    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("pointerenter", this._handlePointerEnter);
    this.removeEventListener("pointermove", this._handlePointerMove);
  }

  protected willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("disabled")) {
      this._updateDisabledState();

      // Update registration when disabled state changes
      if (this._context) {
        this._context.registerItem(this.value, {
          value: this.value,
          textContent: this.textContent?.trim() || "",
          disabled: this.disabled,
          element: this,
        });
      }
    }

    if (changedProperties.has("_context")) {
      this._updateSelectionState();
      this._updateVisibility();
      this._updateHighlightState();
    }
  }

  protected updated() {
    // Always update selection, visibility, and highlight state after render
    // This ensures we catch any changes to context properties
    this._updateSelectionState();
    this._updateVisibility();
    this._updateHighlightState();
  }

  private _updateDisabledState() {
    if (this.disabled) {
      this.setAttribute("data-disabled", "");
      this.setAttribute("aria-disabled", "true");
      this.style.pointerEvents = "none";
    } else {
      this.removeAttribute("data-disabled");
      this.removeAttribute("aria-disabled");
      this.style.pointerEvents = "";
    }
  }

  private _updateSelectionState() {
    if (!this._context) return;

    const { selectedValue, multiple } = this._context;

    let isSelected = false;
    if (Array.isArray(selectedValue)) {
      isSelected = selectedValue.includes(this.value);
    } else {
      isSelected = selectedValue === this.value;
    }

    if (isSelected) {
      this.setAttribute("data-selected", "");
      this.setAttribute("aria-selected", "true");
    } else {
      this.removeAttribute("data-selected");
      this.setAttribute("aria-selected", "false");
    }
  }

  private _updateVisibility() {
    if (!this._context) return;

    const { filteredItems } = this._context;

    if (filteredItems.has(this.value)) {
      this.style.display = "";
    } else {
      this.style.display = "none";
    }
  }

  private _updateHighlightState() {
    if (!this._context) return;

    const { highlightedValue } = this._context;

    const wasHighlighted = this.hasAttribute("data-highlighted");
    const isHighlighted = highlightedValue === this.value;

    if (isHighlighted) {
      this.setAttribute("data-highlighted", "");
      // Scroll into view when newly highlighted (for keyboard navigation)
      if (!wasHighlighted) {
        this.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    } else {
      this.removeAttribute("data-highlighted");
    }
  }

  private _handleClick = () => {
    if (this.disabled) return;
    this._select();
  };

  private _handlePointerEnter = () => {
    if (!this.disabled) {
      this._context.setHighlightedValue(this.value);
    }
  };

  private _handlePointerMove = () => {
    // Update highlight on pointer move (in case user moves mouse while typing)
    if (!this.disabled && this._context.highlightedValue !== this.value) {
      this._context.setHighlightedValue(this.value);
    }
  };

  private _select() {
    const { selectedValue, multiple, onSelect, onDeselect } = this._context;

    if (multiple && Array.isArray(selectedValue)) {
      // Toggle selection in multiple mode
      if (selectedValue.includes(this.value)) {
        onDeselect(this.value);
      } else {
        onSelect(this.value);
      }
    } else {
      // Single select mode
      onSelect(this.value);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-item": ComboboxItem;
  }
}
