import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { provide } from "@lit/context";
import { accordionRootContext, ACCORDION_EVENTS } from "./context";
import { ControlledState, dispatch, attachBehavior } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";
import type {
  AccordionType,
  Direction,
  Orientation,
  AccordionContextValue,
} from "./types";

/**
 * Root container for the accordion component.
 *
 * @element accordion-root
 *
 * @fires change - Emitted when expanded items change. Detail contains string[] of expanded values.
 *
 * @example
 * ```html
 * <accordion-root type="single">
 *   <accordion-item value="item-1">
 *     <accordion-header>
 *       <accordion-trigger>Section 1</accordion-trigger>
 *     </accordion-header>
 *     <accordion-content>Content 1</accordion-content>
 *   </accordion-item>
 * </accordion-root>
 * ```
 */
@customElement("accordion-root")
export class AccordionRoot extends LitElement {
  /**
   * Single allows one item open at a time, multiple allows many
   */
  @property({ type: String })
  type: AccordionType = "single";

  /**
   * Default expanded item(s). Use JSON array format for multiple: '["item-1", "item-2"]'
   */
  @property({
    attribute: "default-value",
    converter: {
      fromAttribute: (value) => {
        if (!value) return [];
        try {
          const parsed = JSON.parse(value.replace(/'/g, '"'));
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [value];
        }
      },
    },
  })
  defaultValue: string[] = [];

  /**
   * Reading direction for RTL support
   */
  @property({ type: String })
  dir: Direction = "ltr";

  /**
   * Orientation affects keyboard navigation
   */
  @property({ type: String })
  orientation: Orientation = "vertical";

  /**
   * Disable all accordion items
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Allow collapsing all items in single mode
   */
  @property({ type: Boolean })
  collapsible = false;

  /**
   * Expanded values.
   *
   * Accordion exposes no controlled `value` property today, but it still needs
   * late-`default-value` initialization: previously this was only read in
   * `connectedCallback`, so under React - which assigns properties after the
   * element connects - `default-value` was silently ignored.
   */
  private _expandedState = new ControlledState<string[]>(this, {
    defaultValue: () => this.defaultValue,
    fallback: [],
    name: "_expandedValues",
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  });

  private get _expandedValues(): string[] {
    return this._expandedState.value;
  }

  /** Context value provided to children - used by @provide decorator */
  @provide({ context: accordionRootContext })
  @property({ attribute: false })
  context: AccordionContextValue = this.createContext();

  /** Elements wired through the `data-accordion-trigger` escape hatch. */
  private _escapeHatchTriggers = new Set<HTMLElement>();
  private _disposeTriggerBehavior?: BehaviorCleanup;

  /**
   * Escape hatch: bring your own element instead of `<accordion-trigger>`.
   * The item's value goes in the attribute:
   *
   *   <button data-accordion-trigger="item-1">Section 1</button>
   */
  private _setupBehaviorAttributes() {
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = attachBehavior(
      this,
      "[data-accordion-trigger]",
      (element) => {
        const valueOf = () =>
          element.getAttribute("data-accordion-trigger") ?? "";

        const activate = (event: Event) => {
          event.preventDefault();
          if (this.disabled) return;
          const value = valueOf();
          if (value) this._toggle(value);
        };
        const onKeydown = (event: KeyboardEvent) => {
          if (event.key !== " " && event.key !== "Enter") return;
          activate(event);
        };

        element.addEventListener("click", activate);
        element.addEventListener("keydown", onKeydown);
        if (!element.hasAttribute("role")) {
          element.setAttribute("role", "button");
        }
        if (!element.hasAttribute("tabindex") && !(element instanceof HTMLButtonElement)) {
          element.setAttribute("tabindex", "0");
        }

        this._escapeHatchTriggers.add(element);
        this._updateEscapeHatchTriggers();

        return () => {
          element.removeEventListener("click", activate);
          element.removeEventListener("keydown", onKeydown);
          this._escapeHatchTriggers.delete(element);
        };
      }
    );
  }

  /** <accordion-trigger> reflects state itself; plain elements need the root to. */
  private _updateEscapeHatchTriggers() {
    for (const element of this._escapeHatchTriggers) {
      const value = element.getAttribute("data-accordion-trigger") ?? "";
      const isExpanded = this._isExpanded(value);
      element.setAttribute("aria-expanded", String(isExpanded));
      element.setAttribute("data-state", isExpanded ? "open" : "closed");
      element.setAttribute("data-orientation", this.orientation);
      element.toggleAttribute("data-disabled", this.disabled);
      element.setAttribute("aria-disabled", String(this.disabled));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = undefined;
    this._escapeHatchTriggers.clear();
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupBehaviorAttributes();
    // Update context with initial values
    this._updateContext();
  }

  protected willUpdate(changed: Map<string, unknown>) {
    // Update context when any relevant property changes
    if (
      changed.has("type") ||
      changed.has("dir") ||
      changed.has("orientation") ||
      changed.has("disabled") ||
      changed.has("collapsible") ||
      changed.has("_expandedValues")
    ) {
      this._updateContext();
      this._updateEscapeHatchTriggers();
    }
  }

  private createContext(): AccordionContextValue {
    return {
      value: this._expandedValues,
      type: this.type,
      direction: this.dir,
      orientation: this.orientation,
      disabled: this.disabled,
      collapsible: this.collapsible,
      toggle: this._toggle.bind(this),
      isExpanded: this._isExpanded.bind(this),
    };
  }

  private _updateContext() {
    this.context = this.createContext();
  }

  private _toggle(itemValue: string) {
    if (this.disabled) return;

    const isCurrentlyExpanded = this._expandedValues.includes(itemValue);

    let newValue: string[];

    if (this.type === "single") {
      if (isCurrentlyExpanded) {
        // Collapse only if collapsible is true
        newValue = this.collapsible ? [] : this._expandedValues;
      } else {
        newValue = [itemValue];
      }
    } else {
      // Multiple mode - toggle the item
      newValue = isCurrentlyExpanded
        ? this._expandedValues.filter((v) => v !== itemValue)
        : [...this._expandedValues, itemValue];
    }

    this._expandedState.set(newValue);

    dispatch(this, ACCORDION_EVENTS.VALUE_CHANGE, newValue);
  }

  private _isExpanded(itemValue: string): boolean {
    return this._expandedValues.includes(itemValue);
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "accordion-root": AccordionRoot;
  }
}
