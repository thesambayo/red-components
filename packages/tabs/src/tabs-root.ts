import { provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ControlledState, dispatch, attachBehavior } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";
import {
  TabsContextValue,
  tabsRootContext,
  ActivationMode,
  Orientation,
  Direction,
  TABS_EVENTS,
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

  /**
   * Selected tab value. Tabs exposes no controlled `value` property today; the
   * controller supplies the late-`default-value` initialization that was
   * previously hand-written as a `_hasInitialized` flag.
   */
  private _valueState = new ControlledState<string | undefined>(this, {
    defaultValue: () => this.defaultValue,
    fallback: undefined,
    name: "_value",
  });

  private get _value(): string | undefined {
    return this._valueState.value;
  }

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

  /** Elements wired through the `data-tab-trigger` escape hatch. */
  private _escapeHatchTriggers = new Set<HTMLElement>();
  private _disposeTriggerBehavior?: BehaviorCleanup;

  /**
   * Escape hatch: bring your own element instead of `<tab-trigger>`.
   * The tab's value goes in the attribute:
   *
   *   <button data-tab-trigger="tab1">Tab 1</button>
   */
  private _setupBehaviorAttributes() {
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = attachBehavior(
      this,
      "[data-tab-trigger]",
      (element) => {
        const valueOf = () => element.getAttribute("data-tab-trigger") ?? "";

        const onClick = (event: Event) => {
          event.preventDefault();
          const value = valueOf();
          if (value) this._changeValue(value);
        };
        const onKeydown = (event: KeyboardEvent) => {
          if (event.key !== " " && event.key !== "Enter") return;
          event.preventDefault();
          const value = valueOf();
          if (value) this._changeValue(value);
        };
        const onFocus = () => {
          if (this.activationMode !== "automatic") return;
          const value = valueOf();
          if (value) this._changeValue(value);
        };

        element.addEventListener("click", onClick);
        element.addEventListener("keydown", onKeydown);
        element.addEventListener("focus", onFocus);
        if (!element.hasAttribute("role")) element.setAttribute("role", "tab");

        this._escapeHatchTriggers.add(element);
        this._updateEscapeHatchTriggers();

        return () => {
          element.removeEventListener("click", onClick);
          element.removeEventListener("keydown", onKeydown);
          element.removeEventListener("focus", onFocus);
          this._escapeHatchTriggers.delete(element);
        };
      }
    );
  }

  /** <tab-trigger> reflects state itself; plain elements need the root to. */
  private _updateEscapeHatchTriggers() {
    for (const element of this._escapeHatchTriggers) {
      const value = element.getAttribute("data-tab-trigger") ?? "";
      const isActive = value === this._value;
      element.setAttribute("id", `tab-trigger-${value}`);
      element.setAttribute("aria-selected", String(isActive));
      element.setAttribute("aria-controls", `tab-content-${value}`);
      element.setAttribute("data-state", isActive ? "active" : "inactive");
      element.setAttribute("data-orientation", this.orientation);
      element.setAttribute("tabindex", isActive ? "0" : "-1");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupBehaviorAttributes();
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
      this._updateEscapeHatchTriggers();
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

    this._valueState.set(value);
    this._shouldFocus = true;

    dispatch(this, TABS_EVENTS.VALUE_CHANGE, value, { cancelable: true });

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
      this._valueState.set(value);
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
