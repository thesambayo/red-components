import { consume, provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { SelectContextValue } from "./select-context";
import { selectRootContext } from "./select-context";
import { createContext } from "@lit/context";

/**
 * Context value provided by select-item to its children
 */
export interface SelectItemContextValue {
  value: string;
  isSelected: boolean;
  disabled: boolean;
  textId: string;
}

export const selectItemContext = createContext<SelectItemContextValue>("select-item");

/**
 * Individual option in select dropdown.
 *
 * @element select-item
 * @slot - Item content (typically contains select-item-indicator and select-item-text)
 * @attr {string} value - Required unique value for this item
 * @attr {boolean} disabled - Whether this item is disabled
 */
@customElement("select-item")
export class SelectItem extends LitElement {
  @property({ type: String })
  value!: string;

  @property({ type: Boolean })
  disabled = false;

  @consume({ context: selectRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: SelectContextValue;

  @provide({ context: selectItemContext })
  @property({ attribute: false })
  private _itemContext!: SelectItemContextValue;

  private _textId = `select-item-text-${Math.random().toString(36).substr(2, 9)}`;

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("role", "option");
    this.setAttribute("tabindex", "-1");

    this._updateDisabledState();
    this._updateItemContext();

    this.addEventListener("click", this._handleClick);
    this.addEventListener("pointerenter", this._handlePointerEnter);
    this.addEventListener("pointermove", this._handlePointerMove);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unregister from root
    if (this._context) {
      this._context.unregisterItem(this.value);
    }

    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("pointerenter", this._handlePointerEnter);
    this.removeEventListener("pointermove", this._handlePointerMove);
  }

  protected firstUpdated() {
    // Register with root once when element is first rendered
    if (this._context) {
      this._context.registerItem(this.value, {
        value: this.value,
        textContent: this.textContent?.trim() || "",
        disabled: this.disabled,
        element: this,
      });
    }
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

    // Update item context when our own properties change OR when context changes
    if (changedProperties.has("disabled") || changedProperties.has("_context")) {
      // Only update if context is available
      if (this._context) {
        this._updateItemContext();
      }
    }
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    // Only update selection and highlight state when context changes
    // This prevents unnecessary updates on every render
    if (changedProperties.has("_context")) {
      this._updateSelectionState();
      this._updateHighlightState();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _updateItemContext() {
    const isSelected = this._isSelected();

    // Only update if something actually changed
    if (
      !this._itemContext ||
      this._itemContext.isSelected !== isSelected ||
      this._itemContext.disabled !== this.disabled
    ) {
      this._itemContext = {
        value: this.value,
        isSelected,
        disabled: this.disabled,
        textId: this._textId,
      };
    }
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

  private _isSelected(): boolean {
    if (!this._context) return false;

    const { selectedValue } = this._context;

    if (Array.isArray(selectedValue)) {
      return selectedValue.includes(this.value);
    } else {
      return selectedValue === this.value;
    }
  }

  private _updateSelectionState() {
    if (!this._context) return;

    const isSelected = this._isSelected();

    if (isSelected) {
      this.setAttribute("data-selected", "");
      this.setAttribute("aria-selected", "true");
      this.setAttribute("data-state", "checked");
    } else {
      this.removeAttribute("data-selected");
      this.setAttribute("aria-selected", "false");
      this.setAttribute("data-state", "unchecked");
    }

    // Update labelledby
    this.setAttribute("aria-labelledby", this._textId);
  }

  private _updateHighlightState() {
    if (!this._context) return;

    const { highlightedValue } = this._context;
    const isHighlighted = highlightedValue === this.value;

    if (isHighlighted) {
      this.setAttribute("data-highlighted", "");
    } else {
      this.removeAttribute("data-highlighted");
    }
  }

  private _handleClick = () => {
    if (this.disabled) return;
    this._select();
  };

  private _handlePointerEnter = () => {
    if (!this.disabled && this._context) {
      this._context.setHighlightedValue(this.value);
    }
  };

  private _handlePointerMove = () => {
    // Update highlight on pointer move
    if (!this.disabled && this._context && this._context.highlightedValue !== this.value) {
      this._context.setHighlightedValue(this.value);
    }
  };

  private _select() {
    if (!this._context) return;

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
}

declare global {
  interface HTMLElementTagNameMap {
    "select-item": SelectItem;
  }
}
