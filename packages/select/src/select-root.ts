import { provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  SelectContextValue,
  SelectItemData,
  SELECT_EVENTS,
  generateId,
  selectRootContext,
} from "./select-context";

/**
 * Root container for select component.
 * Manages state, provides context to children, and integrates with forms.
 *
 * @element select-root
 * @slot - Contains select-trigger and select-content
 *
 * @fires select:value-change - When selected value changes
 * @fires select:open-change - When open state changes
 * @fires select:open - When select opens
 * @fires select:close - When select closes
 */
@customElement("select-root")
export class SelectRoot extends LitElement {
  static formAssociated = true;

  private _internals: ElementInternals;

  // Form integration
  @property({ type: String })
  name?: string;

  // Controlled mode
  @property({ type: String, attribute: false })
  value?: string | string[];

  @property({ type: Boolean, attribute: false })
  open?: boolean;

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

  @property({ type: Boolean, attribute: "default-open" })
  defaultOpen = false;

  // Configuration
  @property({ type: Boolean })
  multiple = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  // Internal state
  @state()
  private _value?: string | string[];

  @state()
  private _isOpen = false;

  @state()
  private _highlightedValue?: string;

  @state()
  private _items = new Map<string, SelectItemData>();

  // IDs for accessibility
  private _triggerId = generateId("select-trigger");
  private _contentId = generateId("select-content");
  private _valueId = generateId("select-value");

  // References
  private _triggerElement: HTMLElement | null = null;
  private _contentElement: HTMLElement | null = null;
  private _valueElement: HTMLElement | null = null;

  // Initialization tracking
  private _hasInitialized = false;
  private _hasInitializedOpen = false;

  // Context provided to children
  @provide({ context: selectRootContext })
  @property({ attribute: false })
  context: SelectContextValue = this._createContext();

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
    // Handle late initialization of defaultValue
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
      this.defaultOpen !== undefined
    ) {
      this._isOpen = this.defaultOpen;
      this._hasInitializedOpen = true;
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

    // Update context when state changes
    if (
      changed.has("_value") ||
      changed.has("_isOpen") ||
      changed.has("_highlightedValue") ||
      changed.has("_items") ||
      changed.has("multiple") ||
      changed.has("disabled")
    ) {
      this._updateContext();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _createContext(): SelectContextValue {
    return {
      // State
      selectedValue: this._value,
      isOpen: this._isOpen,
      multiple: this.multiple,
      disabled: this.disabled,
      highlightedValue: this._highlightedValue,

      // IDs for accessibility
      triggerId: this._triggerId,
      contentId: this._contentId,
      valueId: this._valueId,

      // References
      triggerElement: this._triggerElement,
      contentElement: this._contentElement,
      valueElement: this._valueElement,

      // Item management
      items: this._items,

      // Methods
      onSelect: this._handleSelect.bind(this),
      onDeselect: this._handleDeselect.bind(this),
      onToggle: this._handleToggle.bind(this),
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
  }

  private _handleDeselect(value: string) {
    if (this.disabled) return;

    if (this.multiple && Array.isArray(this._value)) {
      this._value = this._value.filter((v) => v !== value);
      this._updateFormValue();
      this._dispatchValueChange();
    }
  }

  private _handleToggle() {
    if (this._isOpen) {
      this._handleClose();
    } else {
      this._handleOpen();
    }
  }

  private _handleOpen() {
    if (this.disabled) return;
    this._isOpen = true;
    this._dispatchOpen();
    this._dispatchOpenChange();
  }

  private _handleClose() {
    this._isOpen = false;
    this._highlightedValue = undefined;
    this._dispatchClose();
    this._dispatchOpenChange();

    // Return focus to trigger when closing
    if (this._triggerElement) {
      requestAnimationFrame(() => {
        this._triggerElement?.focus();
      });
    }
  }

  private _setHighlightedValue(value: string | undefined) {
    this._highlightedValue = value;
  }

  private _registerItem(value: string, data: SelectItemData) {
    this._items = new Map(this._items).set(value, data);
  }

  private _unregisterItem(value: string) {
    const newItems = new Map(this._items);
    newItems.delete(value);
    this._items = newItems;
  }

  // Public API for setting references
  // Note: We don't call _updateContext() here because these are just
  // references used internally for positioning/focus management.
  // Updating context would trigger re-renders in all consumers unnecessarily.
  setTriggerElement(element: HTMLElement | null) {
    this._triggerElement = element;
  }

  setContentElement(element: HTMLElement | null) {
    this._contentElement = element;
  }

  setValueElement(element: HTMLElement | null) {
    this._valueElement = element;
  }

  // Form integration
  private _updateFormValue() {
    if (!this.name) {
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
      const formData = new FormData();
      this._value.forEach((v) => formData.append(this.name!, v));
      this._internals.setFormValue(formData);
    } else {
      this._internals.setFormValue(this._value);
    }
  }

  formResetCallback() {
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

  formStateRestoreCallback(
    state: string | File | FormData | null,
    _mode: "restore" | "autocomplete"
  ) {
    if (state instanceof FormData) {
      const values = state.getAll(this.name!);
      this._value = values.map(String);
    } else if (typeof state === "string") {
      this._value = state;
    } else {
      this._value = undefined;
    }
    this._updateFormValue();
  }

  // Event dispatchers
  private _dispatchValueChange() {
    this.dispatchEvent(
      new CustomEvent(SELECT_EVENTS.VALUE_CHANGE, {
        bubbles: true,
        composed: true,
        detail: { value: this._value },
      })
    );
  }

  private _dispatchOpenChange() {
    this.dispatchEvent(
      new CustomEvent(SELECT_EVENTS.OPEN_CHANGE, {
        bubbles: true,
        composed: true,
        detail: { open: this._isOpen },
      })
    );
  }

  private _dispatchOpen() {
    this.dispatchEvent(
      new CustomEvent(SELECT_EVENTS.OPEN, {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _dispatchClose() {
    this.dispatchEvent(
      new CustomEvent(SELECT_EVENTS.CLOSE, {
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "select-root": SelectRoot;
  }
}
