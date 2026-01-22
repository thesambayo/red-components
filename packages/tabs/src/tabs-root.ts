import { provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  TabsContextValue,
  tabsRootContext,
  ActivationMode,
  Orientation,
  Direction,
} from "./tabs-context";

/**
 * Root container for the tabs component.
 *
 * @element tabs-root
 *
 * @fires change - Emitted when the selected tab changes. Detail contains the tab value.
 *
 * @example
 * ```html
 * <tabs-root default-value="tab1">
 *   <tabs-list>
 *     <tab-trigger value="tab1">Tab 1</tab-trigger>
 *     <tab-trigger value="tab2">Tab 2</tab-trigger>
 *   </tabs-list>
 *   <tab-content value="tab1">Content 1</tab-content>
 *   <tab-content value="tab2">Content 2</tab-content>
 * </tabs-root>
 * ```
 */
@customElement("tabs-root")
export class TabsRoot extends LitElement {
  /**
   * Default selected tab value
   */
  @property({ attribute: "default-value" })
  defaultValue?: string;

  /**
   * Reading direction for RTL support
   * @defaultValue ltr
   */
  @property({ type: String })
  dir: Direction = "ltr";

  /**
   * Orientation affects keyboard navigation
   * @defaultValue horizontal
   */
  @property({ type: String })
  orientation: Orientation = "horizontal";

  /**
   * Whether tabs are activated automatically on focus or manually on click
   * @defaultValue automatic
   */
  @property({ type: String, attribute: "activation-mode" })
  activationMode: ActivationMode = "automatic";

  /**
   * Whether keyboard navigation should loop from last to first item
   * @defaultValue false
   */
  @property({ type: Boolean })
  loop = false;

  /**
   * Whether to unmount tab content when hidden (for performance)
   * @defaultValue false
   */
  @property({ type: Boolean, attribute: "unmount-on-hide" })
  unmountOnHide = false;

  /** Internal state for selected tab value */
  @state()
  private _value?: string;

  /** Internal state for tracking focus behavior */
  @state()
  private _shouldFocus = false;

  /** Internal state for registered content values */
  @state()
  private _registeredContents = new Set<string>();

  /** Context value provided to children - used by @provide decorator */
  @provide({ context: tabsRootContext })
  @property({ attribute: false })
  context: TabsContextValue = this._createContext();

  /** Track if we've initialized from defaultValue */
  private _hasInitialized = false;

  connectedCallback() {
    super.connectedCallback();
    // Initialize with default value if available
    if (this.defaultValue !== undefined) {
      this._value = this.defaultValue;
      this._hasInitialized = true;
    }
    // Update context with initial values
    this._updateContext();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Handle late initialization of defaultValue (for React compatibility)
    // React often sets properties after the element is connected
    if (
      changed.has("defaultValue") &&
      !this._hasInitialized &&
      this.defaultValue !== undefined &&
      this._value === undefined
    ) {
      this._value = this.defaultValue;
      this._hasInitialized = true;
    }

    // Update context when any relevant property changes
    if (
      changed.has("dir") ||
      changed.has("orientation") ||
      changed.has("activationMode") ||
      changed.has("loop") ||
      changed.has("unmountOnHide") ||
      changed.has("_value") ||
      changed.has("_shouldFocus") ||
      changed.has("_registeredContents")
    ) {
      this._updateContext();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _createContext(): TabsContextValue {
    return {
      value: this._value,
      shouldFocus: this._shouldFocus,
      direction: this.dir,
      orientation: this.orientation,
      activationMode: this.activationMode,
      loop: this.loop,
      unmountOnHide: this.unmountOnHide,
      changeValue: this._changeValue.bind(this),
      registerContent: this._registerContent.bind(this),
      unregisterContent: this._unregisterContent.bind(this),
      isContentRegistered: this._isContentRegistered.bind(this),
    };
  }

  private _updateContext() {
    this.context = this._createContext();
  }

  private _changeValue(value: string) {
    if (value === this._value) return;

    this._value = value;
    this._shouldFocus = true;

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: value,
      })
    );

    // Reset shouldFocus after a frame
    requestAnimationFrame(() => {
      this._shouldFocus = false;
    });
  }

  private _registerContent(value: string) {
    this._registeredContents = new Set(this._registeredContents).add(value);

    // Auto-select first tab if no value is set
    // This ensures a tab is always selected even without defaultValue
    if (this._value === undefined && this._registeredContents.size === 1) {
      this._value = value;
      this._hasInitialized = true;
    }
  }

  private _unregisterContent(value: string) {
    const newSet = new Set(this._registeredContents);
    newSet.delete(value);
    this._registeredContents = newSet;
  }

  private _isContentRegistered(value: string): boolean {
    return this._registeredContents.has(value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tabs-root": TabsRoot;
  }
}
