import { consume } from "@lit/context";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { flip, shift, offset, size, Placement } from "@floating-ui/dom";
import { FloatingController, attachDismiss } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";
import { ComboboxContextValue } from "./combobox-context";
import { comboboxRootContext, ComboboxRoot } from "./combobox-root";

type Side = "top" | "bottom";
type Align = "start" | "center" | "end";

/**
 * Combobox content container with Popover API and floating-ui positioning.
 *
 * @element combobox-content
 * @slot - Combobox items
 *
 * @attr width - Set to "trigger" to match the anchor's width
 * @cssprop --combobox-input-width - Width of input (set automatically)
 * @cssprop --combobox-available-height - Available height (set automatically)
 */
@customElement("combobox-content")
export class ComboboxContent extends LitElement {
  static styles = css`
    /*
     * The UA stylesheet gives every [popover] \`margin: auto\`, \`inset: 0\`,
     * \`border: solid\`, \`padding: .25em\` and \`background-color: Canvas\`, so
     * some reset is unavoidable. But border, padding and background are
     * exactly what a consumer most wants to set, and an unlayered :host rule
     * beats the layered utilities that Tailwind and friends emit - which is
     * why a styled <select-content> rendered with no background, border or
     * padding while its <select-item> children styled fine.
     *
     * Declaring the reset in a layer fixes that: an author layer still beats
     * the UA origin, while a consumer rule in another tree wins on context.
     * Only \`position\` stays unlayered - overriding it breaks positioning
     * outright, and floating-ui writes left/top inline anyway.
     */
    @layer red-popover-reset {
      :host {
        margin: 0;
        inset: auto;
        padding: 0;
        border: 0;
        background: transparent;
        outline: none;
      }
    }

    :host {
      position: fixed;
    }

    :host(:not(:popover-open)) {
      display: none;
    }

    /* Paired with FloatingController's gate: hides the content until the first
       position has been computed, so it never paints against the trigger's
       old coordinates. */
    :host([data-floating-hidden]) {
      visibility: hidden;
    }

    /* Opt-in, so it deliberately sits outside the reset layer. */
    :host([width="trigger"]) {
      width: var(--combobox-input-width);
    }
  `;

  @property({ type: String })
  side: Side = "bottom";

  @property({ type: String })
  align: Align = "start";

  @property({ type: Number, attribute: "side-offset" })
  sideOffset = 4;

  @property({ type: Number, attribute: "align-offset" })
  alignOffset = 0;

  /**
   * Set to `"trigger"` to match the anchor's width exactly.
   *
   * The underlying `--combobox-input-width` custom property is always set and
   * stays available for anything this shorthand does not cover - a minimum
   * rather than an exact width, say:
   *
   * ```css
   * combobox-content { min-width: var(--combobox-input-width); }
   * ```
   */
  @property({ type: String, reflect: true })
  width?: "trigger";

  @property({ type: Number, attribute: "max-height" })
  maxHeight?: number;

  @consume({ context: comboboxRootContext, subscribe: true })
  @property({ attribute: false })
  private _context!: ComboboxContextValue;

  private _root: ComboboxRoot | null = null;
  private _items: HTMLElement[] = [];
  private _disposeDismiss?: BehaviorCleanup;

  protected firstUpdated() {
    // Set ID for ARIA once context is available
    this.setAttribute("id", this._context.contentId);
  }

  connectedCallback() {
    super.connectedCallback();

    // Find root element
    this._root = this.closest("combobox-root") as ComboboxRoot;

    // "manual", not "auto". A `popover="auto"` light-dismisses on any pointer
    // gesture outside itself, and its only exemption is a registered invoker -
    // which the combobox's text input, sitting outside the listbox, cannot be.
    // Every click into the input to move the caret therefore dismissed the
    // list, and the input's own click handler immediately reopened it. The
    // boundary is declared explicitly in `_startDismiss` instead.
    this.setAttribute("popover", "manual");
    this.setAttribute("role", "listbox");
    this.setAttribute("data-state", "closed");

    // Register with root
    if (this._root) {
      this._root.setContentElement(this);
    }

    // `beforetoggle` fires synchronously, before the browser paints the
    // popover; `toggle` is queued as a task and would let one unpositioned
    // frame through. This replaces the old `data-state="opening"` rule.
    this.addEventListener("beforetoggle", this._handleBeforeToggle as EventListener);
    this.addEventListener("toggle", this._handleToggle as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPositioning();
    this._stopDismiss();
    this.removeEventListener("beforetoggle", this._handleBeforeToggle as EventListener);
    this.removeEventListener("toggle", this._handleToggle as EventListener);
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    // Open/close popover based on context state
    if (changedProperties.has("_context")) {
      const { isOpen } = this._context;
      const isPopoverOpen = this.matches(":popover-open");

      if (isOpen && !isPopoverOpen) {
        this.setAttribute("data-state", "open");
        this.showPopover();
      } else if (!isOpen && isPopoverOpen) {
        this.hidePopover();
      }
    }
  }

  private _handleBeforeToggle = (event: ToggleEvent) => {
    if (event.newState === "open") this._floating.gate();
  };

  private _handleToggle = (event: ToggleEvent) => {
    if (event.newState === "open") {
      this.setAttribute("data-state", "open");
      this._startPositioning();
      this._startDismiss();
      this._updateItems();
      // Highlight initial item (selected or first) after positioning
      requestAnimationFrame(() => {
        this._highlightInitialItem();
        // Auto-focus input
        this._focusInputIfInside();
      });
    } else {
      this.setAttribute("data-state", "closed");
      this.removeAttribute("data-side");
      this.removeAttribute("data-align");

      // Stop auto-updating position
      this._stopPositioning();
      this._stopDismiss();

      // Returning focus is the root's job - it owns the close. This used to
      // focus the trigger here while the root focused the input a frame later,
      // so focus visibly hopped, and with `open-on-focus` the second focus
      // reopened the combobox that had just been closed.

      // Notify root that popover closed (e.g., via Escape or outside click)
      if (this._context.isOpen) {
        this._context.onClose();
      }
    }
  };

  private _highlightInitialItem() {
    const { selectedValue, setHighlightedValue, filteredItems, items } = this._context;

    // Try to highlight selected item first (if not disabled)
    if (
      selectedValue &&
      !Array.isArray(selectedValue) &&
      filteredItems.has(selectedValue) &&
      !items.get(selectedValue)?.disabled
    ) {
      setHighlightedValue(selectedValue);
      return;
    }

    // Otherwise highlight first enabled item
    const values = Array.from(filteredItems);
    const firstEnabledValue = values.find((value) => !items.get(value)?.disabled);
    if (firstEnabledValue) {
      setHighlightedValue(firstEnabledValue);
    }
  }

  private _focusInputIfInside() {
    // Query from root to find combobox-input anywhere in the tree
    if (!this._root) return;

    const inputComponent = this._root.querySelector("combobox-input");
    if (!inputComponent) return;

    // combobox-input renders into the light DOM, so no shadow piercing needed
    // (works whether it sits inside the content or outside in the anchor).
    const inputElement = inputComponent.querySelector("input");
    if (inputElement) {
      inputElement.focus();
    }
  }

  /** Anchor tracking, shared with select/dropdown/tooltip via core. */
  private _floating = new FloatingController(this, {
    placement: () => this._getPlacement(),
    middleware: () => [
      offset({ mainAxis: this.sideOffset, crossAxis: this.alignOffset }),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply: ({ availableHeight, rects }) => {
          const maxHeight = this.maxHeight || availableHeight;
          this.style.setProperty(
            "--combobox-available-height",
            `${maxHeight}px`
          );
          this.style.setProperty(
            "--combobox-input-width",
            `${rects.reference.width}px`
          );
        },
      }),
    ],
  });

  /** Everything that counts as "inside" for dismissal purposes. */
  private _boundaryElements(): (Element | null | undefined)[] {
    return [
      this._context?.anchorElement,
      this._context?.inputElement,
      this._context?.triggerElement,
    ];
  }

  private _anchorElement(): Element | null {
    // `triggerElement` was missing from this chain, so a combobox built from a
    // <combobox-trigger> with the input *inside* the content - the command
    // palette shape - had nothing to anchor to. Positioning bailed out, the
    // reveal that positioning gates never ran, and the popover opened
    // completely invisible.
    return (
      this._context?.anchorElement ??
      this._context?.inputElement ??
      this._context?.triggerElement ??
      null
    );
  }

  private _startPositioning() {
    const anchor = this._anchorElement();
    if (!anchor) {
      // Nothing to anchor to. Show it where it is rather than leaving it
      // hidden by the gate - an unpositioned menu is recoverable, an
      // invisible one is not.
      this.removeAttribute("data-floating-hidden");
      return;
    }
    this._floating.start(anchor);
  }

  private _stopPositioning() {
    this._floating.stop();
  }

  private _startDismiss() {
    this._stopDismiss();
    this._disposeDismiss = attachDismiss(this, {
      boundary: () => this._boundaryElements(),
      onDismiss: () => this._context?.onClose(),
    });
  }

  private _stopDismiss() {
    this._disposeDismiss?.();
    this._disposeDismiss = undefined;
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side;
    }
    return `${this.side}-${this.align}`;
  }

  private _updateItems() {
    // Get all visible items (not disabled and in filtered set)
    this._items = Array.from(
      this.querySelectorAll(
        'combobox-item:not([data-disabled]):not([style*="display: none"])'
      )
    ) as HTMLElement[];
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "combobox-content": ComboboxContent;
  }
}
