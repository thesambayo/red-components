import { provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  ComboboxContextValue,
  ComboboxItemData,
  COMBOBOX_EVENTS,
  generateId,
} from "./combobox-context";
import { createContext } from "@lit/context";

export const comboboxRootContext = createContext<ComboboxContextValue>("combobox-root");

/**
 * Root container for combobox component.
 * Manages state, filtering, and provides context to children.
 *
 * @element combobox-root
 * @slot - Contains combobox-input and combobox-content
 *
 * @fires combobox:value-change - When selected value changes
 * @fires combobox:search-change - When search term changes
 * @fires combobox:open - When combobox opens
 * @fires combobox:close - When combobox closes
 */
@customElement("combobox-root")
export class ComboboxRoot extends LitElement {
  static formAssociated = true;

  private _internals: ElementInternals;

  // Form integration
  @property({ type: String })
  name?: string;

  // Controlled mode
  @property({ type: String, attribute: false })
  value?: string | string[];

  // Uncontrolled mode
  @property({
    attribute: "default-value",
    converter: {
      fromAttribute: (value: string | null) => {
        if (!value) return undefined;
        // Try to parse as JSON array
        if (value.startsWith("[")) {
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
        return value;
      },
    },
  })
  defaultValue?: string | string[];

  @property({ type: Boolean })
  open?: boolean;

  @property({ type: Boolean, attribute: "default-open" })
  defaultOpen = false;

  // Configuration
  @property({ type: Boolean })
  multiple = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ attribute: "filter-mode" })
  filterMode: "client" | "manual" = "client";

  // Behavior
  @property({ type: Boolean, attribute: "reset-search-on-blur" })
  resetSearchTermOnBlur = true;

  @property({ type: Boolean, attribute: "reset-search-on-select" })
  resetSearchTermOnSelect = true;

  @property({ type: Boolean, attribute: "open-on-focus" })
  openOnFocus = false;

  @property({ type: Boolean, attribute: "open-on-click" })
  openOnClick = true;

  // Internal state
  @state()
  private _value?: string | string[];

  @state()
  private _searchTerm = "";

  @state()
  private _isOpen = false;

  @state()
  private _filteredItems = new Set<string>();

  @state()
  private _highlightedValue?: string;

  @state()
  private _items = new Map<string, ComboboxItemData>();

  // IDs for accessibility
  private _inputId = generateId("combobox-input");
  private _contentId = generateId("combobox-content");

  // References
  private _inputElement: HTMLInputElement | null = null;
  private _contentElement: HTMLElement | null = null;
  private _anchorElement: HTMLElement | null = null;
  private _triggerElement: HTMLElement | null = null;

  // Initialization tracking
  private _hasInitialized = false;
  private _hasInitializedOpen = false;

  // Context provided to children
  @provide({ context: comboboxRootContext })
  @property({ attribute: false })
  context: ComboboxContextValue = this._createContext();

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();

    // Initialize with default value if available
    if (this.defaultValue !== undefined) {
      this._value = Array.isArray(this.defaultValue)
        ? [...this.defaultValue]
        : this.defaultValue;
      this._hasInitialized = true;
      this._updateFormValue();
    }

    // Initialize with default open state
    if (this.defaultOpen !== undefined) {
      this._isOpen = this.defaultOpen;
      this._hasInitializedOpen = true;
    }

    // Update context with initial values
    this._updateContext();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Handle late initialization of defaultValue (React)
    if (
      changed.has("defaultValue") &&
      !this._hasInitialized &&
      this.defaultValue !== undefined &&
      this._value === undefined
    ) {
      this._value = Array.isArray(this.defaultValue)
        ? [...this.defaultValue]
        : this.defaultValue;
      this._hasInitialized = true;
      this._updateFormValue();
    }

    // Handle late initialization of defaultOpen
    if (
      changed.has("defaultOpen") &&
      !this._hasInitializedOpen &&
      this.defaultOpen !== undefined &&
      this._isOpen === undefined
    ) {
      this._isOpen = this.defaultOpen;
      this._hasInitializedOpen = true;
    }

    // Auto-select first item if no value set (optional behavior)
    if (
      this._value === undefined &&
      !this._hasInitialized &&
      this._items.size === 1 &&
      !this.multiple
    ) {
      const [firstValue] = this._items.keys();
      const firstItem = this._items.get(firstValue);
      // Only auto-select if not disabled
      if (firstItem && !firstItem.disabled) {
        this._value = firstValue;
        this._hasInitialized = true;
        this._updateFormValue();
      }
    }

    // Handle controlled value
    if (changed.has("value") && this.value !== undefined) {
      this._value = Array.isArray(this.value) ? [...this.value] : this.value;
      this._updateFormValue();
    }

    // Handle controlled open
    if (changed.has("open") && this.open !== undefined) {
      this._isOpen = this.open;
    }

    // Update filtered items when items or search term changes
    if (
      changed.has("_items") ||
      changed.has("_searchTerm") ||
      changed.has("filterMode")
    ) {
      this._filterItems();
    }

    // Update context when state changes
    if (
      changed.has("_value") ||
      changed.has("_searchTerm") ||
      changed.has("_isOpen") ||
      changed.has("_filteredItems") ||
      changed.has("_highlightedValue") ||
      changed.has("_items") ||
      changed.has("multiple") ||
      changed.has("disabled") ||
      changed.has("filterMode")
    ) {
      this._updateContext();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _createContext(): ComboboxContextValue {
    return {
      // State
      selectedValue: this._value,
      searchTerm: this._searchTerm,
      isOpen: this._isOpen,
      filteredItems: this._filteredItems,
      highlightedValue: this._highlightedValue,

      // Configuration
      multiple: this.multiple,
      disabled: this.disabled,
      filterMode: this.filterMode,

      // IDs for accessibility
      inputId: this._inputId,
      contentId: this._contentId,

      // References
      inputElement: this._inputElement,
      contentElement: this._contentElement,
      anchorElement: this._anchorElement,
      triggerElement: this._triggerElement,

      // Item management
      items: this._items,

      // Methods
      onInputChange: this._handleInputChange.bind(this),
      onSelect: this._handleSelect.bind(this),
      onDeselect: this._handleDeselect.bind(this),
      onOpen: this._handleOpen.bind(this),
      onClose: this._handleClose.bind(this),
      registerItem: this._registerItem.bind(this),
      unregisterItem: this._unregisterItem.bind(this),
      setHighlightedValue: this._setHighlightedValue.bind(this),
    };
  }

  private _updateContext() {
    this.context = this._createContext();
  }

  private _filterItems() {
    if (this.filterMode === "manual") {
      this._filteredItems = new Set(this._items.keys());
      return;
    }

    if (!this._searchTerm) {
      this._filteredItems = new Set(this._items.keys());
      return;
    }

    // Locale-aware, case-insensitive search
    const searchLower = this._searchTerm.toLowerCase();
    const filtered = new Set<string>();

    for (const [value, data] of this._items.entries()) {
      const text = data.textContent.toLowerCase();
      if (text.includes(searchLower)) {
        filtered.add(value);
      }
    }

    this._filteredItems = filtered;

    // If highlighted item is no longer in filtered results, highlight first non-disabled item
    if (this._highlightedValue && !filtered.has(this._highlightedValue)) {
      const firstValue = this._getFirstEnabledItem(Array.from(filtered));
      this._highlightedValue = firstValue;
    }
  }

  private _getFirstEnabledItem(values: string[]): string | undefined {
    return values.find((value) => !this._items.get(value)?.disabled);
  }

  private _handleInputChange(value: string) {
    this._searchTerm = value;
    this._dispatchSearchChange();
  }

  private _handleSelect(value: string) {
    if (this.disabled) return;

    if (this.multiple) {
      const currentValue = Array.isArray(this._value) ? this._value : [];
      if (!currentValue.includes(value)) {
        this._value = [...currentValue, value];
        this._updateFormValue();
        this._dispatchValueChange();
      }
    } else {
      this._value = value;
      this._updateFormValue();
      this._dispatchValueChange();

      // Close after single selection
      this._handleClose();
    }

    // Reset search term if configured
    if (this.resetSearchTermOnSelect) {
      this._searchTerm = "";
      this._filterItems();
    }
  }

  private _handleDeselect(value: string) {
    if (this.disabled) return;

    if (this.multiple && Array.isArray(this._value)) {
      this._value = this._value.filter((v) => v !== value);
      this._updateFormValue();
      this._dispatchValueChange();
    }
  }

  private _handleOpen() {
    if (this.disabled) return;
    this._isOpen = true;
    this._dispatchOpen();
  }

  private _handleClose() {
    this._isOpen = false;

    // Reset search term if configured
    if (this.resetSearchTermOnBlur) {
      this._searchTerm = "";
      this._filterItems();
    }

    // Clear highlighted value when closing
    this._highlightedValue = undefined;

    this._dispatchClose();

    // Return focus to input when closing
    if (this._inputElement) {
      requestAnimationFrame(() => {
        this._inputElement?.focus();
      });
    }
  }

  private _setHighlightedValue(value: string | undefined) {
    this._highlightedValue = value;
  }

  private _registerItem(value: string, data: ComboboxItemData) {
    this._items = new Map(this._items).set(value, data);
    this._filterItems(); // Re-filter when items change
  }

  private _unregisterItem(value: string) {
    const newItems = new Map(this._items);
    newItems.delete(value);
    this._items = newItems;
    this._filterItems();
  }

  // Public API for setting references
  // Note: We don't call _updateContext() here because these are just
  // references used internally for positioning/focus management.
  // Updating context would trigger re-renders in all consumers unnecessarily.
  setInputElement(element: HTMLInputElement | null) {
    this._inputElement = element;
  }

  setContentElement(element: HTMLElement | null) {
    this._contentElement = element;
  }

  setAnchorElement(element: HTMLElement | null) {
    this._anchorElement = element;
  }

  setTriggerElement(element: HTMLElement | null) {
    this._triggerElement = element;
  }

  // Event dispatchers
  private _dispatchValueChange() {
    this.dispatchEvent(
      new CustomEvent(COMBOBOX_EVENTS.VALUE_CHANGE, {
        bubbles: true,
        composed: true,
        detail: { value: this._value },
      })
    );
  }

  private _dispatchSearchChange() {
    this.dispatchEvent(
      new CustomEvent(COMBOBOX_EVENTS.SEARCH_CHANGE, {
        bubbles: true,
        composed: true,
        detail: { searchTerm: this._searchTerm },
      })
    );
  }

  private _dispatchOpen() {
    this.dispatchEvent(
      new CustomEvent(COMBOBOX_EVENTS.OPEN, {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _dispatchClose() {
    this.dispatchEvent(
      new CustomEvent(COMBOBOX_EVENTS.CLOSE, {
        bubbles: true,
        composed: true,
      })
    );
  }

  // Form integration
  private _updateFormValue() {
    if (!this.name) {
      // No name means not participating in form
      return;
    }

    if (this._value === undefined || this._value === null) {
      this._internals.setFormValue(null);
      return;
    }

    if (Array.isArray(this._value)) {
      if (this._value.length === 0) {
        this._internals.setFormValue(null);
        return;
      }
      // Multiple values: create FormData with multiple entries
      const formData = new FormData();
      this._value.forEach((v) => formData.append(this.name!, v));
      this._internals.setFormValue(formData);
    } else {
      // Single value: just pass the string
      this._internals.setFormValue(this._value);
    }
  }

  // Form lifecycle callbacks
  formResetCallback() {
    // Reset to defaultValue or undefined
    if (this.defaultValue !== undefined) {
      this._value = Array.isArray(this.defaultValue)
        ? [...this.defaultValue]
        : this.defaultValue;
    } else {
      this._value = undefined;
    }
    this._updateFormValue();
    this._dispatchValueChange();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formStateRestoreCallback(state: string | File | FormData | null, _mode: "restore" | "autocomplete") {
    if (state instanceof FormData) {
      // Multiple values from FormData
      const values = state.getAll(this.name!);
      this._value = values.map(String);
    } else if (typeof state === "string") {
      // Single value
      this._value = state;
    } else {
      this._value = undefined;
    }
    this._updateFormValue();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-root": ComboboxRoot;
  }
}
