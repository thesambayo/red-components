import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { flip, shift, offset, size, Placement } from "@floating-ui/dom";
import { FloatingController } from "@red-elements/core";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

/**
 * Dropdown menu content container.
 * Uses Popover API for top-layer rendering and floating-ui for positioning.
 *
 * @element dropdown-content
 * @slot - Menu items (dropdown-item, dropdown-label, dropdown-separator)
 *
 * @attr width - Set to "trigger" to match the anchor's width
 * @cssprop --dropdown-trigger-width - Width of trigger (set automatically)
 * @cssprop --dropdown-trigger-height - Height of trigger (set automatically)
 * @cssprop --dropdown-available-width - Available width (set automatically)
 * @cssprop --dropdown-available-height - Available height (set automatically)
 */
@customElement("dropdown-content")
export class DropdownContent extends LitElement {
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
      width: var(--dropdown-trigger-width);
    }
  `;

  /**
   * Side of trigger to display content
   */
  @property({ type: String })
  side: Side = "bottom";

  /**
   * Distance from trigger in pixels
   */
  @property({ type: Number, attribute: "side-offset" })
  sideOffset = 4;

  /**
   * Alignment relative to trigger
   */
  @property({ type: String })
  align: Align = "start";

  /**
   * Offset along alignment axis
   */
  @property({ type: Number, attribute: "align-offset" })
  alignOffset = 0;

  /**
   * Set to `"trigger"` to match the anchor's width exactly.
   *
   * The underlying `--dropdown-trigger-width` custom property is always set and
   * stays available for anything this shorthand does not cover - a minimum
   * rather than an exact width, say:
   *
   * ```css
   * dropdown-content { min-width: var(--dropdown-trigger-width); }
   * ```
   */
  @property({ type: String, reflect: true })
  width?: "trigger";

  private _items: HTMLElement[] = [];

  connectedCallback() {
    super.connectedCallback();

    // Set popover attribute for light dismiss
    this.setAttribute("popover", "auto");
    this.setAttribute("role", "menu");
    this.setAttribute("data-state", "closed");
    // Focusable so a mouse open can park focus here instead of on an item.
    this.setAttribute("tabindex", "-1");

    // `beforetoggle` fires synchronously, before the browser paints the
    // popover; `toggle` is queued as a task and would let one unpositioned
    // frame through.
    this.addEventListener("beforetoggle", this._handleBeforeToggle as EventListener);
    this.addEventListener("toggle", this._handleToggle as EventListener);
    this.addEventListener("keydown", this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("beforetoggle", this._handleBeforeToggle as EventListener);
    this.removeEventListener("toggle", this._handleToggle as EventListener);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private _handleBeforeToggle = (event: ToggleEvent) => {
    if (event.newState === "open") this._floating.gate();
  };

  private _handleToggle = (event: ToggleEvent) => {
    if (event.newState === "open") {
      this.setAttribute("data-state", "open");
      const trigger = this._findTrigger();
      if (trigger) {
        this._floating.start(trigger);
      } else {
        // If there is no anchor the gate would never lift and the menu would
        // open invisible. An unpositioned menu is recoverable; an invisible
        // one is not.
        this.removeAttribute("data-floating-hidden");
      }
      this._updateItems();

      // The trigger records how it was activated; a bare `showPopover()` from
      // consumer code leaves it unset, which is treated as a pointer open.
      const openedByKeyboard =
        this.getAttribute("data-open-source") === "keyboard";
      this.removeAttribute("data-open-source");

      requestAnimationFrame(() => {
        if (openedByKeyboard) {
          this._items[0]?.focus();
          return;
        }
        // Mouse open: focus the menu itself rather than an item. Focus still
        // has to leave the trigger or the arrow keys would never reach this
        // element's keydown handler, but landing on the container means no
        // item paints a focus ring the user did not ask for. `_focusNext`
        // treats "no item focused" as index -1 and moves to the first item,
        // so ArrowDown behaves exactly as before.
        this.focus();
      });
    } else {
      this.setAttribute("data-state", "closed");
      this._floating.stop();
      this.removeAttribute("data-side");
      this.removeAttribute("data-align");
    }
  };

  /**
   * Keeps the menu anchored to its trigger. Previously a one-shot
   * `computePosition` on open, so the menu detached on scroll or resize.
   */
  private _floating = new FloatingController(this, {
    placement: () => this._getPlacement(),
    middleware: () => [
      offset({ mainAxis: this.sideOffset, crossAxis: this.alignOffset }),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply: ({ availableWidth, availableHeight, rects }) => {
          this.style.setProperty(
            "--dropdown-trigger-width",
            `${rects.reference.width}px`
          );
          this.style.setProperty(
            "--dropdown-trigger-height",
            `${rects.reference.height}px`
          );
          this.style.setProperty(
            "--dropdown-available-width",
            `${availableWidth}px`
          );
          this.style.setProperty(
            "--dropdown-available-height",
            `${availableHeight}px`
          );
        },
      }),
    ],
  });

  /**
   * Ask the root which element is the trigger.
   *
   * Previously this ran a global `document.querySelector` for a
   * `dropdown-trigger` tag, which both reached outside the component and could
   * never match an escape-hatch element such as `<button data-dropdown-trigger>`.
   */
  private _findTrigger(): Element | null {
    const root = this.closest("dropdown-root") as
      | (HTMLElement & { triggerElement?: HTMLElement | null })
      | null;
    return root?.triggerElement ?? null;
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side;
    }
    return `${this.side}-${this.align}`;
  }

  private _updateItems() {
    this._items = Array.from(
      this.querySelectorAll("dropdown-item:not([data-disabled])")
    ) as HTMLElement[];
  }

  private _handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this._focusNext();
        break;
      case "ArrowUp":
        event.preventDefault();
        this._focusPrevious();
        break;
      case "Home":
        event.preventDefault();
        this._items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        this._items[this._items.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        this.hidePopover();
        break;
    }
  };

  private _focusNext() {
    const currentIndex = this._items.findIndex(
      (item) => item === document.activeElement
    );
    const nextIndex =
      currentIndex === -1 || currentIndex === this._items.length - 1
        ? 0
        : currentIndex + 1;
    this._items[nextIndex]?.focus();
  }

  private _focusPrevious() {
    const currentIndex = this._items.findIndex(
      (item) => item === document.activeElement
    );
    const prevIndex =
      currentIndex <= 0 ? this._items.length - 1 : currentIndex - 1;
    this._items[prevIndex]?.focus();
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-content": DropdownContent;
  }
}
