import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext, ComboboxRoot } from "./combobox-root";

/**
 * Text input for combobox with keyboard navigation.
 *
 * @element combobox-input
 *
 * @cssprop --combobox-input-border - Input border style
 * @cssprop --combobox-input-border-focus - Input border style when focused
 * @cssprop --combobox-input-padding - Input padding
 */
@customElement("combobox-input")
export class ComboboxInput extends LitElement {
  @property({ type: String })
  placeholder = "";

  @property({ type: Boolean })
  autocomplete = false;

  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  @query("input")
  private _input!: HTMLInputElement;

  private _root: ComboboxRoot | null = null;

  connectedCallback() {
    super.connectedCallback();

    // Find root element
    this._root = this.closest("combobox-root") as ComboboxRoot;
  }

  protected firstUpdated() {
    // Register input element with root
    if (this._root && this._input) {
      this._root.setInputElement(this._input);
    }

    // Set initial value
    this._updateInputValue();
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("_context")) {
      this._updateInputValue();
    }
  }

  private _updateInputValue() {
    if (!this._input || !this._context) return;

    const { selectedValue, isOpen, searchTerm, items, multiple } = this._context;

    if (isOpen) {
      // Show search term while open
      if (this._input.value !== searchTerm) {
        this._input.value = searchTerm;
      }
    } else if (selectedValue && !multiple && !Array.isArray(selectedValue)) {
      // Show selected item label when closed (single select)
      const item = items.get(selectedValue);
      if (item && this._input.value !== item.textContent) {
        this._input.value = item.textContent;
      }
    } else if (!selectedValue && !isOpen) {
      // Clear input when no selection and closed
      this._input.value = "";
    }
  }

  private _handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this._context.onInputChange(input.value);

    // Open dropdown when typing
    if (!this._context.isOpen && input.value) {
      this._context.onOpen();
    }
  };

  private _handleFocus = () => {
    const { openOnFocus, onOpen, isOpen } = this._context;
    if (openOnFocus && !isOpen) {
      onOpen();
    }
  };

  private _handleClick = () => {
    const { openOnClick, onOpen, isOpen } = this._context;
    if (openOnClick && !isOpen) {
      onOpen();
    }
  };

  private _handleKeydown = (event: KeyboardEvent) => {
    const { isOpen, onOpen, onClose, highlightedValue, onSelect } =
      this._context;

    switch (event.key) {
      case "ArrowDown":
        if (isOpen) {
          event.preventDefault();
          this._highlightNext();
        } else {
          event.preventDefault();
          onOpen();
          // Highlight first item when opening
          requestAnimationFrame(() => {
            this._highlightFirst();
          });
        }
        break;

      case "ArrowUp":
        if (isOpen) {
          event.preventDefault();
          this._highlightPrevious();
        } else {
          event.preventDefault();
          onOpen();
          // Highlight last item when opening
          requestAnimationFrame(() => {
            this._highlightLast();
          });
        }
        break;

      case "Escape":
        if (isOpen) {
          event.preventDefault();
          onClose();
        }
        break;

      case "Enter":
        if (isOpen && highlightedValue) {
          event.preventDefault();
          onSelect(highlightedValue);
        }
        break;

      case "Home":
        if (isOpen) {
          event.preventDefault();
          this._highlightFirst();
        }
        break;

      case "End":
        if (isOpen) {
          event.preventDefault();
          this._highlightLast();
        }
        break;

      case "Tab":
        // Close on tab to move to next element
        if (isOpen) {
          onClose();
        }
        break;
    }
  };

  private _highlightFirst() {
    const { filteredItems, items, setHighlightedValue } = this._context;
    const values = Array.from(filteredItems);
    const firstValue = values.find((value) => !items.get(value)?.disabled);
    if (firstValue) {
      setHighlightedValue(firstValue);
    }
  }

  private _highlightLast() {
    const { filteredItems, items, setHighlightedValue } = this._context;
    const values = Array.from(filteredItems);
    for (let i = values.length - 1; i >= 0; i--) {
      if (!items.get(values[i])?.disabled) {
        setHighlightedValue(values[i]);
        return;
      }
    }
  }

  private _highlightNext() {
    const { filteredItems, items, highlightedValue, setHighlightedValue } = this._context;
    const values = Array.from(filteredItems);

    if (!highlightedValue) {
      // No item highlighted, highlight first enabled item
      const firstValue = values.find((value) => !items.get(value)?.disabled);
      if (firstValue) {
        setHighlightedValue(firstValue);
      }
      return;
    }

    const currentIndex = values.indexOf(highlightedValue);

    // Search forward for next enabled item
    for (let i = currentIndex + 1; i < values.length; i++) {
      if (!items.get(values[i])?.disabled) {
        setHighlightedValue(values[i]);
        return;
      }
    }

    // Wrap to first enabled item
    const firstValue = values.find((value) => !items.get(value)?.disabled);
    if (firstValue) {
      setHighlightedValue(firstValue);
    }
  }

  private _highlightPrevious() {
    const { filteredItems, items, highlightedValue, setHighlightedValue } = this._context;
    const values = Array.from(filteredItems);

    if (!highlightedValue) {
      // No item highlighted, highlight last enabled item
      for (let i = values.length - 1; i >= 0; i--) {
        if (!items.get(values[i])?.disabled) {
          setHighlightedValue(values[i]);
          return;
        }
      }
      return;
    }

    const currentIndex = values.indexOf(highlightedValue);

    // Search backward for previous enabled item
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!items.get(values[i])?.disabled) {
        setHighlightedValue(values[i]);
        return;
      }
    }

    // Wrap to last enabled item
    for (let i = values.length - 1; i >= 0; i--) {
      if (!items.get(values[i])?.disabled) {
        setHighlightedValue(values[i]);
        return;
      }
    }
  }

  protected render() {
    const { disabled, inputId, contentId, isOpen, highlightedValue } = this._context;

    return html`
      <input
        id="${inputId}"
        role="combobox"
        type="text"
        placeholder="${this.placeholder}"
        autocomplete="${this.autocomplete ? "on" : "off"}"
        aria-autocomplete="list"
        aria-expanded="${isOpen}"
        aria-controls="${contentId}"
        aria-activedescendant="${highlightedValue ? `${contentId}-${highlightedValue}` : ""}"
        ?disabled="${disabled}"
        @input="${this._handleInput}"
        @focus="${this._handleFocus}"
        @click="${this._handleClick}"
        @keydown="${this._handleKeydown}"
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-input": ComboboxInput;
  }
}
