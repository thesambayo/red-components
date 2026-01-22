import { html, LitElement } from "lit";
import { consume } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import { TabsContextValue, tabsRootContext } from "./tabs-context";

/**
 * Tab trigger button that activates a tab panel.
 *
 * With `as-child`, passes behavior to the slotted child element.
 * Without `as-child`, acts as the trigger itself.
 *
 * @element tab-trigger
 *
 * @example
 * ```html
 * <!-- With as-child: behavior passed to button -->
 * <tab-trigger value="tab1" as-child>
 *   <button>Tab 1</button>
 * </tab-trigger>
 *
 * <!-- Without as-child: component is the trigger -->
 * <tab-trigger value="tab1">Tab 1</tab-trigger>
 * ```
 */
@customElement("tab-trigger")
export class TabTrigger extends LitElement {
  @property({ type: String, reflect: true })
  value?: string;

  /**
   * Pass behavior to slotted child instead of rendering wrapper
   */
  @property({ type: Boolean, attribute: "as-child" })
  asChild = false;

  // todo: implement disabled tab, prevent it from being selectable and focusable
  // @property({type: Boolean, reflect: true})
  // disabled = false;

  @consume({ context: tabsRootContext, subscribe: true })
  private _context?: TabsContextValue;

  /** Reference to the child element when using as-child */
  private _childElement: HTMLElement | null = null;

  /** Stored handler references for proper cleanup */
  private _handleFocus = this._onFocus.bind(this);
  private _handleClick = this._onClick.bind(this);
  private _handleKeydown = this._onKeydown.bind(this);
  private _handleSlotChange = this._onSlotChange.bind(this);

  connectedCallback() {
    super.connectedCallback();

    if (this.asChild) {
      // Will setup child element after slot change
    } else {
      this._setupSelfAsTrigger();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.asChild) {
      this._cleanupChildTrigger();
    } else {
      this._cleanupSelfAsTrigger();
    }
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  protected render() {
    return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
  }

  private _setupSelfAsTrigger() {
    // Set role
    this.setAttribute("role", "tab");

    // Event listeners
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeydown);
  }

  private _cleanupSelfAsTrigger() {
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private _setupChildTrigger(child: HTMLElement) {
    this._childElement = child;

    // Set role
    child.setAttribute("role", "tab");

    // Add event listeners to child
    child.addEventListener("focus", this._handleFocus);
    child.addEventListener("click", this._handleClick);
    child.addEventListener("keydown", this._handleKeydown);

    // Update attributes on child
    this._updateChildAttributes();
  }

  private _cleanupChildTrigger() {
    if (this._childElement) {
      this._childElement.removeEventListener("focus", this._handleFocus);
      this._childElement.removeEventListener("click", this._handleClick);
      this._childElement.removeEventListener("keydown", this._handleKeydown);
      this._childElement = null;
    }
  }

  private _onSlotChange(event: Event) {
    if (!this.asChild) return;

    const slot = event.target as HTMLSlotElement;
    const children = slot.assignedElements();

    // Cleanup previous child
    this._cleanupChildTrigger();

    // Setup new child
    if (children.length > 0) {
      const child = children[0] as HTMLElement;
      this._setupChildTrigger(child);
    }
  }

  private _updateAttributes() {
    if (!this._context || !this.value) return;

    if (this.asChild) {
      this._updateChildAttributes();
    } else {
      this._updateSelfAttributes();
    }
  }

  private _updateSelfAttributes() {
    if (!this._context || !this.value) return;

    const isActive = this.value === this._context.value;
    const shouldFocus = this._context.shouldFocus;

    // Generate predictable IDs based on value
    const triggerId = `tab-trigger-${this.value}`;
    const contentId = `tab-content-${this.value}`;

    // Set ARIA attributes
    this.setAttribute("id", triggerId);
    this.setAttribute("aria-selected", String(isActive));
    this.setAttribute("aria-controls", contentId);

    // Set data attributes for styling
    this.setAttribute("data-state", isActive ? "active" : "inactive");
    this.setAttribute("data-orientation", this._context.orientation);

    // Set tabindex
    this.setAttribute("tabindex", isActive ? "0" : "-1");

    // Focus if needed
    if (isActive && shouldFocus) {
      this.focus();
    }
  }

  private _updateChildAttributes() {
    if (!this._context || !this.value || !this._childElement) return;

    const isActive = this.value === this._context.value;
    const shouldFocus = this._context.shouldFocus;

    // Generate predictable IDs based on value
    const triggerId = `tab-trigger-${this.value}`;
    const contentId = `tab-content-${this.value}`;

    // Set ARIA attributes
    this._childElement.setAttribute("id", triggerId);
    this._childElement.setAttribute("aria-selected", String(isActive));
    this._childElement.setAttribute("aria-controls", contentId);

    // Set data attributes for styling
    this._childElement.setAttribute("data-state", isActive ? "active" : "inactive");
    this._childElement.setAttribute("data-orientation", this._context.orientation);

    // Set tabindex
    this._childElement.setAttribute("tabindex", isActive ? "0" : "-1");

    // Focus if needed
    if (isActive && shouldFocus) {
      this._childElement.focus();
    }
  }

  private _onFocus() {
    if (!this._context || !this.value) return;

    // In automatic mode, focusing a trigger activates it
    if (this._context.activationMode === "automatic") {
      this._context.changeValue(this.value);
    }
  }

  private _onClick() {
    if (!this._context || !this.value) return;

    // In manual mode, clicking activates the tab
    if (this._context.activationMode === "manual") {
      this._context.changeValue(this.value);
    }
  }

  private _onKeydown(event: KeyboardEvent) {
    if (!this._context || !this.value) return;

    // In manual mode, Enter or Space activates the tab
    if (this._context.activationMode === "manual") {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this._context.changeValue(this.value);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tab-trigger": TabTrigger;
  }
}