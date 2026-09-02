import { provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  ComboboxContextValue,
  ComboboxItemData,
  COMBOBOX_EVENTS,
  generateId,
  type HighlightSource,
  type OpenSource,
} from "./combobox-context";
import { ControlledState, attachBehavior } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";
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

  private get _value(): string | string[] | undefined {
    return this._valueState.value;
  }

  @state()
  private _searchTerm = "";

  /** Controlled/uncontrolled open state. */
  private _openState = new ControlledState<boolean>(this, {
    prop: () => this.open,
    defaultValue: () => this.defaultOpen,
    fallback: false,
    name: "_isOpen",
  });

  private get _isOpen(): boolean {
    return this._openState.value;
  }

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

  // Context provided to children
  @provide({ context: comboboxRootContext })
  @property({ attribute: false })
  context: ComboboxContextValue = this._createContext();

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /** Elements wired through the `data-combobox-trigger` escape hatch. */
  private _escapeHatchTriggers = new Set<HTMLElement>();
  private _disposeTriggerBehavior?: BehaviorCleanup;

  /**
   * Escape hatch: bring your own element instead of `<combobox-trigger>`.
   *
   *   <button data-combobox-trigger>Toggle</button>
   */
  private _setupBehaviorAttributes() {
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = attachBehavior(
      this,
      "[data-combobox-trigger]",
      (element) => {
        const onClick = (event: Event) => {
          if (this.disabled) {
            event.preventDefault();
            return;
          }
          if (this._isOpen) {
            this._handleClose();
          } else {
            this._handleOpen();
          }
        };

        element.addEventListener("click", onClick);
        element.setAttribute("aria-haspopup", "listbox");
        if (!element.hasAttribute("tabindex") && !(element instanceof HTMLButtonElement)) {
          element.setAttribute("tabindex", "0");
        }

        this._escapeHatchTriggers.add(element);
        this.setTriggerElement(element);
        this._updateEscapeHatchTriggers();

        return () => {
          element.removeEventListener("click", onClick);
          this._escapeHatchTriggers.delete(element);
        };
      }
    );
  }

  /** <combobox-trigger> reflects state itself; plain elements need the root to. */
  private _updateEscapeHatchTriggers() {
    for (const element of this._escapeHatchTriggers) {
      element.setAttribute("aria-expanded", String(this._isOpen));
      element.setAttribute("aria-controls", this._contentId);
      element.setAttribute("data-state", this._isOpen ? "open" : "closed");
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = undefined;
    this._escapeHatchTriggers.clear();
    document.removeEventListener("pointermove", this._releasePointerHighlight, true);
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

  protected willUpdate(changed: Map<string, unknown>) {
    // Auto-select first item if no value set (optional behavior)
    if (
      this._value === undefined &&
      !this._valueState.isInitialized &&
      this._items.size === 1 &&
      !this.multiple
    ) {
      const [firstValue] = this._items.keys();
      const firstItem = this._items.get(firstValue);
      // Only auto-select if not disabled
      if (firstItem && !firstItem.disabled) {
        this._valueState.set(firstValue);
        this._updateFormValue();
      }
    }

    // The form value mirrors the effective value, controlled or not.
    if (changed.has("_value") || changed.has("value")) {
      this._updateFormValue();
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
      changed.has("filterMode") ||
      changed.has("openOnFocus") ||
      changed.has("openOnClick")
    ) {
      this._updateContext();
      this._updateEscapeHatchTriggers();
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
      openOnFocus: this.openOnFocus,
      openOnClick: this.openOnClick,

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

    // Reset search term if configured
    if (this.resetSearchTermOnSelect) {
      this._searchTerm = "";
      this._filterItems();
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

  private _handleOpen(source?: OpenSource) {
    if (this.disabled) return;
    // The close path returns focus to the input; with `open-on-focus` that
    // focus would reopen the combobox that was just closed.
    if (source === "focus" && this._restoringFocus) return;
    this._openState.set(true);
    this._dispatchOpen();
  }

  private _handleClose() {
    this._openState.set(false);

    // Reset search term if configured
    if (this.resetSearchTermOnBlur) {
      this._searchTerm = "";
      this._filterItems();
    }

    // Clear highlighted value when closing
    this._highlightedValue = undefined;

    this._dispatchClose();

    this._restoreFocus();
  }

  /** True only for the instant the root is moving focus itself. */
  private _restoringFocus = false;

  /**
   * Returns focus after a close. The root is the single owner of this -
   * `combobox-content` used to focus the trigger from its own toggle handler
   * while this focused the input a frame later, so focus visibly hopped
   * between the two, and with `open-on-focus` the second focus reopened the
   * combobox that had just been closed.
   */
  private _restoreFocus() {
    const target = this._triggerElement ?? this._inputElement;
    if (!target) return;

    requestAnimationFrame(() => {
      // Closing because the user clicked something else must not yank focus
      // back out of whatever they clicked. Only restore when focus would
      // otherwise be stranded - still inside the combobox, or lost entirely.
      const active = document.activeElement;
      const stranded =
        !active || active === document.body || active === this || this.contains(active);
      if (!stranded) return;

      // `focus()` dispatches synchronously, so bracketing the call is enough
      // for `_handleOpen` to recognise the focus as self-inflicted.
      this._restoringFocus = true;
      target.focus();
      this._restoringFocus = false;
    });
  }

  /**
   * True while hover-driven highlights are ignored, because the last highlight
   * came from the keyboard and the resulting scroll may have slid an item
   * under a stationary cursor. Released by the next genuine pointer movement.
   */
  private _ignorePointerHighlight = false;

  private _releasePointerHighlight = () => {
    this._ignorePointerHighlight = false;
  };

  private _setHighlightedValue(
    value: string | undefined,
    source: HighlightSource = "keyboard"
  ) {
    if (source === "pointer") {
      if (this._ignorePointerHighlight) return;
    } else {
      this._ignorePointerHighlight = true;
      document.removeEventListener("pointermove", this._releasePointerHighlight, true);
      document.addEventListener("pointermove", this._releasePointerHighlight, {
        once: true,
        capture: true,
      });
    }

    this._highlightedValue = value;
  }

  /**
   * Pending item mutations, flushed once per microtask.
   *
   * Items register from their own `firstUpdated`, one at a time. Writing
   * `_items` per registration meant N root updates for N items, and each of
   * those rebuilt the context object that every item subscribes to - so
   * mounting a list cost O(N^2) update cycles and a 200-option combobox
   * visibly hitched on first open. Coalescing makes it one.
   */
  private _pendingItems: Map<string, ComboboxItemData> | null = null;
  private _itemFlushScheduled = false;

  private _registerItem(value: string, data: ComboboxItemData) {
    this._queueItemMutation((items) => items.set(value, data));
  }

  private _unregisterItem(value: string) {
    this._queueItemMutation((items) => items.delete(value));
  }

  private _queueItemMutation(
    mutate: (items: Map<string, ComboboxItemData>) => void
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
      // `willUpdate` re-filters on `_items` change; no need to do it here too.
      if (next) this._items = next;
    });
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
    this._valueState.reset();
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
      this._valueState.restore(values.map(String));
    } else if (typeof state === "string") {
      // Single value
      this._valueState.restore(state);
    } else {
      this._valueState.restore(undefined);
    }
    this._updateFormValue();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-root": ComboboxRoot;
  }
}
