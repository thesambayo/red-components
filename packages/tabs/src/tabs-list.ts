import { html, LitElement } from "lit";
import { consume } from "@lit/context";
import { TabsContextValue, tabsRootContext } from "./tabs-context";
import { customElement } from "lit/decorators.js";

const Keys = Object.freeze({
  arrowUp: "ArrowUp",
  arrowDown: "ArrowDown",
  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  home: "Home",
  end: "End",
});

const Orientation = Object.freeze({
  horizontal: "horizontal",
  vertical: "vertical",
});

/**
 * Container for tab trigger buttons.
 *
 * @element tabs-list
 *
 * @example
 * ```html
 * <tabs-list>
 *   <tab-trigger value="tab1">Tab 1</tab-trigger>
 *   <tab-trigger value="tab2">Tab 2</tab-trigger>
 * </tabs-list>
 * ```
 */
@customElement("tabs-list")
export class TabsList extends LitElement {
  @consume({ context: tabsRootContext, subscribe: true })
  private _context?: TabsContextValue;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "tablist");
    this.addEventListener("keydown", this._handleKeyNavigations);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._handleKeyNavigations);
  }

  protected willUpdate() {
    this._updateAttributes();
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _updateAttributes() {
    if (!this._context) return;

    // Set ARIA attributes
    this.setAttribute("aria-orientation", this._context.orientation);
  }

  private _handleKeyNavigations = (event: KeyboardEvent) => {
    if (!this._context) return;

    const { orientation, direction, loop, activationMode } = this._context;

    const prev =
      orientation === Orientation.vertical
        ? Keys.arrowUp
        : direction === "rtl"
        ? Keys.arrowRight
        : Keys.arrowLeft;
    const next =
      orientation === Orientation.vertical
        ? Keys.arrowDown
        : direction === "rtl"
        ? Keys.arrowLeft
        : Keys.arrowRight;

    // Get all tab triggers
    const tabTriggers = Array.from(this.children).filter(
      (child) => child.localName === "tab-trigger"
    ) as HTMLElement[];

    if (tabTriggers.length === 0) return;

    const currentIndex = this._getCurrentTabTriggerIndex(tabTriggers);
    let targetIndex: number | null = null;

    switch (event.key) {
      case prev:
        event.preventDefault();
        targetIndex = this._getPreviousIndex(currentIndex, tabTriggers.length);
        break;
      case next:
        event.preventDefault();
        targetIndex = this._getNextIndex(currentIndex, tabTriggers.length);
        break;
      case Keys.home:
        event.preventDefault();
        targetIndex = 0;
        break;
      case Keys.end:
        event.preventDefault();
        targetIndex = tabTriggers.length - 1;
        break;
      default:
        // Let other keys (Enter, Space) be handled by tab-trigger
        return;
    }

    if (targetIndex === null) return;

    const targetElement = tabTriggers[targetIndex];
    const value = targetElement?.getAttribute("value");

    if (!value) return;

    // Focus the target element
    targetElement.focus();

    // In automatic mode, also change the value
    if (activationMode === "automatic") {
      this._context.changeValue(value);
    }
  };

  private _getCurrentTabTriggerIndex(triggerElements: HTMLElement[]): number {
    if (!this._context) return 0;

    // In manual mode, use the focused element since focus != selection
    // In automatic mode, focus and selection are the same, so either works
    const activeElement = this.ownerDocument.activeElement;

    // First try to find the focused trigger
    const focusedIndex = triggerElements.findIndex(
      (trigger) => trigger === activeElement
    );

    if (focusedIndex >= 0) {
      return focusedIndex;
    }

    // Fallback to selected value if no trigger is focused
    const currentValue = this._context.value;
    const index = triggerElements.findIndex(
      (trigger) => trigger.getAttribute("value") === currentValue
    );

    return index >= 0 ? index : 0;
  }

  private _getNextIndex(currentIndex: number, length: number): number {
    if (!this._context) return currentIndex;

    const nextIndex = currentIndex + 1;

    if (nextIndex >= length) {
      // If loop is enabled, wrap to first
      return this._context.loop ? 0 : length - 1;
    }

    return nextIndex;
  }

  private _getPreviousIndex(currentIndex: number, length: number): number {
    if (!this._context) return currentIndex;

    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      // If loop is enabled, wrap to last
      return this._context.loop ? length - 1 : 0;
    }

    return prevIndex;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tabs-list": TabsList;
  }
}