import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext } from "./combobox-root";

/**
 * Selectable option within combobox.
 *
 * @element combobox-item
 * @slot - Item content
 */
@customElement("combobox-item")
export class ComboboxItem extends LitElement {
  @property({ type: String })
  value!: string; // required

  @property({ type: Boolean })
  disabled = false;

  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  /**
   * Last values written to the DOM.
   *
   * The root rebuilds its context object on every state change, so every item
   * re-renders on every keystroke and every highlight move. Writing attributes
   * and `style.display` unconditionally meant three DOM mutations per item per
   * change - 600 of them per arrow keypress in a 200-item list. These caches
   * make each write conditional on something having actually changed.
   */
  private _renderedSelected?: boolean;
  private _renderedVisible?: boolean;
  private _renderedHighlighted?: boolean;
  /** Set when this item's own `pointerenter` moved the highlight. */
  private _highlightedByOwnHover = false;

  protected firstUpdated() {
    // Set unique ID for aria-activedescendant
    this.setAttribute("id", `${this._context.contentId}-${this.value}`);

    // Register with root
    this._context.registerItem(this.value, {
      value: this.value,
      textContent: this.textContent?.trim() || "",
      disabled: this.disabled,
      element: this,
    });
  }

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("role", "option");
    this.setAttribute("tabindex", "-1");

    this._updateDisabledState();

    this.addEventListener("click", this._handleClick);
    this.addEventListener("pointerenter", this._handlePointerEnter);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unregister from root
    this._context.unregisterItem(this.value);

    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("pointerenter", this._handlePointerEnter);
  }

  protected willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("disabled")) {
      this._updateDisabledState();

      // Update registration when disabled state changes
      if (this._context) {
        this._context.registerItem(this.value, {
          value: this.value,
          textContent: this.textContent?.trim() || "",
          disabled: this.disabled,
          element: this,
        });
      }
    }

    if (changedProperties.has("_context")) {
      this._updateSelectionState();
      this._updateVisibility();
      this._updateHighlightState();
    }
  }

  protected updated() {
    // Always update selection, visibility, and highlight state after render
    // This ensures we catch any changes to context properties
    this._updateSelectionState();
    this._updateVisibility();
    this._updateHighlightState();
  }

  private _updateDisabledState() {
    if (this.disabled) {
      this.setAttribute("data-disabled", "");
      this.setAttribute("aria-disabled", "true");
      this.style.pointerEvents = "none";
    } else {
      this.removeAttribute("data-disabled");
      this.removeAttribute("aria-disabled");
      this.style.pointerEvents = "";
    }
  }

  private _updateSelectionState() {
    if (!this._context) return;

    const { selectedValue, multiple } = this._context;

    let isSelected = false;
    if (Array.isArray(selectedValue)) {
      isSelected = selectedValue.includes(this.value);
    } else {
      isSelected = selectedValue === this.value;
    }

    if (isSelected === this._renderedSelected) return;
    this._renderedSelected = isSelected;

    if (isSelected) {
      this.setAttribute("data-selected", "");
      this.setAttribute("aria-selected", "true");
    } else {
      this.removeAttribute("data-selected");
      this.setAttribute("aria-selected", "false");
    }
  }

  private _updateVisibility() {
    if (!this._context) return;

    const { filteredItems } = this._context;
    const isVisible = filteredItems.has(this.value);

    if (isVisible === this._renderedVisible) return;
    this._renderedVisible = isVisible;

    this.style.display = isVisible ? "" : "none";
  }

  private _updateHighlightState() {
    if (!this._context) return;

    const { highlightedValue } = this._context;
    const isHighlighted = highlightedValue === this.value;

    const byOwnHover = this._highlightedByOwnHover;
    this._highlightedByOwnHover = false;

    if (isHighlighted === this._renderedHighlighted) return;
    const wasHighlighted = this._renderedHighlighted;
    this._renderedHighlighted = isHighlighted;

    if (!isHighlighted) {
      this.removeAttribute("data-highlighted");
      return;
    }

    this.setAttribute("data-highlighted", "");

    // Scroll into view when newly highlighted, but not when the highlight came
    // from hovering this very item - it is already under the cursor. The
    // `:hover` check keeps a stale flag (a hover the root suppressed during
    // keyboard nav) from cancelling a later, legitimate scroll.
    if (!wasHighlighted && !(byOwnHover && this.matches(":hover"))) {
      this.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  private _handleClick = () => {
    if (this.disabled) return;
    this._select();
  };

  private _handlePointerEnter = () => {
    if (this.disabled) return;
    // Flagged so the highlight this causes does not also scroll the list: the
    // item is already under the cursor, and scrolling a partially visible one
    // into view drags the list out from under the pointer.
    this._highlightedByOwnHover = true;
    this._context.setHighlightedValue(this.value, "pointer");
  };

  private _select() {
    const { selectedValue, multiple, onSelect, onDeselect } = this._context;

    if (multiple && Array.isArray(selectedValue)) {
      // Toggle selection in multiple mode
      if (selectedValue.includes(this.value)) {
        onDeselect(this.value);
      } else {
        onSelect(this.value);
      }
    } else {
      // Single select mode
      onSelect(this.value);
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-item": ComboboxItem;
  }
}
