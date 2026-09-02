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
import { ControlledState, attachBehavior } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";

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

  /**
   * Controlled selected value. **JS-only** - this has no HTML attribute.
   *
   * An absent boolean/string attribute is indistinguishable from one set to a
   * falsy value, so there would be no way to tell "not controlled" from
   * "controlled and currently empty". Setting the property to `undefined`
   * means uncontrolled; any other value means the consumer owns it.
   *
   * From plain HTML use `default-value` and listen for the change event.
   */
  // Controlled mode
  @property({ type: String, attribute: false })
  value?: string | string[];

  /**
   * Controlled open state. **JS-only** - this has no HTML attribute.
   *
   * An absent boolean/string attribute is indistinguishable from one set to a
   * falsy value, so there would be no way to tell "not controlled" from
   * "controlled and currently false". Setting the property to `undefined`
   * means uncontrolled; any other value means the consumer owns it.
   *
   * From plain HTML use `default-open` and listen for the change event.
   */
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

  /** Controlled/uncontrolled selected value. */
  private _valueState = new ControlledState<string | string[] | undefined>(
    this,
    {
      prop: () => this.value,
      defaultValue: () => this.defaultValue,
      fallback: undefined,
      name: "_value",
      equals: (a, b) =>
        Array.isArray(a) && Array.isArray(b)
          ? a.length === b.length && a.every((v, i) => v === b[i])
          : Object.is(a, b),
    }
  );

  /** Controlled/uncontrolled open state. */
  private _openState = new ControlledState<boolean>(this, {
    prop: () => this.open,
    defaultValue: () => this.defaultOpen,
    fallback: false,
    name: "_isOpen",
  });

  private get _value(): string | string[] | undefined {
    return this._valueState.value;
  }

  private get _isOpen(): boolean {
    return this._openState.value;
  }

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

  // Context provided to children
  @provide({ context: selectRootContext })
  @property({ attribute: false })
  context: SelectContextValue = this._createContext();

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /** Elements wired through the `data-select-trigger` escape hatch. */
  private _escapeHatchTriggers = new Set<HTMLElement>();
  private _disposeTriggerBehavior?: BehaviorCleanup;

  /**
   * Escape hatch: bring your own element instead of `<select-trigger>`.
   *
   *   <button data-select-trigger>Choose...</button>
   *
   * Mirrors <select-trigger>: click toggles, Space/Enter/ArrowDown/ArrowUp
   * open, Escape closes, and the element is registered as the positioning
   * anchor for the listbox.
   */
  private _setupBehaviorAttributes() {
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = attachBehavior(
      this,
      "[data-select-trigger]",
      (element) => {
        const onClick = (event: Event) => {
          if (this.disabled) {
            event.preventDefault();
            return;
          }
          this._handleToggle();
        };
        const onKeyDown = (event: KeyboardEvent) => {
          if (this.disabled) return;
          const { key } = event;
          if (key === " " || key === "Enter" || key === "ArrowDown" || key === "ArrowUp") {
            event.preventDefault();
            if (!this._isOpen) this._handleOpen();
          }
          if (key === "Escape" && this._isOpen) {
            event.preventDefault();
            this._handleClose();
          }
        };

        element.addEventListener("click", onClick);
        element.addEventListener("keydown", onKeyDown);
        if (!element.hasAttribute("role")) {
          element.setAttribute("role", "combobox");
        }
        element.setAttribute("aria-haspopup", "listbox");
        if (!element.hasAttribute("tabindex") && !(element instanceof HTMLButtonElement)) {
          element.setAttribute("tabindex", "0");
        }

        this._escapeHatchTriggers.add(element);
        this.setTriggerElement(element);
        this._updateEscapeHatchTriggers();

        return () => {
          element.removeEventListener("click", onClick);
          element.removeEventListener("keydown", onKeyDown);
          this._escapeHatchTriggers.delete(element);
        };
      }
    );
  }

  /** <select-trigger> reflects state itself; plain elements need the root to. */
  private _updateEscapeHatchTriggers() {
    for (const element of this._escapeHatchTriggers) {
      element.setAttribute("aria-expanded", String(this._isOpen));
      element.setAttribute("aria-controls", this._contentId);
      element.setAttribute("data-state", this._isOpen ? "open" : "closed");
      if (this.disabled) {
        element.setAttribute("aria-disabled", "true");
      } else {
        element.removeAttribute("aria-disabled");
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupBehaviorAttributes();

    // Default value/open initialization is handled by the controllers, which
    // also cover the React case where properties arrive after connection.
    this._updateFormValue();

    // Update context with initial values
    this._updateContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = undefined;
    this._escapeHatchTriggers.clear();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // The form value mirrors the effective value, controlled or not.
    if (changed.has("_value") || changed.has("value")) {
      this._updateFormValue();
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
      this._updateEscapeHatchTriggers();
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
        this._valueState.set([...currentValue, value]);
        this._updateFormValue();
        this._dispatchValueChange();
      }
    } else {
      this._valueState.set(value);
      this._updateFormValue();
      this._dispatchValueChange();

      // Close after single selection
      this._handleClose();
    }
  }

  private _handleDeselect(value: string) {
    if (this.disabled) return;

    if (this.multiple && Array.isArray(this._value)) {
      this._valueState.set(this._value.filter((v) => v !== value));
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
    this._openState.set(true);
    this._dispatchOpen();
    this._dispatchOpenChange();
  }

  private _handleClose() {
    this._openState.set(false);
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

  /**
   * Pending item mutations, flushed once per microtask.
   *
   * Items register from their own `firstUpdated`, one at a time. Writing
   * `_items` per registration meant N root updates for N items, and each of
   * those rebuilt the context object that every item subscribes to - so
   * mounting a list cost O(N^2) update cycles and a long option list visibly
   * hitched on first open. Coalescing makes it one. Mirrors
   * `combobox-root._queueItemMutation`.
   */
  private _pendingItems: Map<string, SelectItemData> | null = null;
  private _itemFlushScheduled = false;

  private _registerItem(value: string, data: SelectItemData) {
    this._queueItemMutation((items) => items.set(value, data));
  }

  private _unregisterItem(value: string) {
    this._queueItemMutation((items) => items.delete(value));
  }

  private _queueItemMutation(
    mutate: (items: Map<string, SelectItemData>) => void
  ) {
    // Insertion order is the navigation order, and it follows DOM order
    // because items register in DOM order. Mutating a single pending copy
    // preserves that.
    this._pendingItems ??= new Map(this._items);
    mutate(this._pendingItems);

    if (this._itemFlushScheduled) return;
    this._itemFlushScheduled = true;

    queueMicrotask(() => {
      this._itemFlushScheduled = false;
      const next = this._pendingItems;
      this._pendingItems = null;
      if (next) this._items = next;
    });
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
    this._valueState.reset();
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
      this._valueState.restore(values.map(String));
    } else if (typeof state === "string") {
      this._valueState.restore(state);
    } else {
      this._valueState.restore(undefined);
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
