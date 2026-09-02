import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { generateDropdownId, DROPDOWN_EVENTS } from "./dropdown.context";
import { attachBehavior, attachPopoverToggle } from "@red-elements/core";
import type { BehaviorCleanup } from "@red-elements/core";
import type { DropdownTrigger } from "./dropdown-trigger";

/**
 * Root container for dropdown menu.
 * Coordinates trigger and content elements.
 *
 * @element dropdown-root
 * @slot - Contains dropdown-trigger and dropdown-content
 *
 * @fires dropdown:open - When dropdown opens
 * @fires dropdown:close - When dropdown closes
 */
@customElement("dropdown-root")
export class DropdownRoot extends LitElement {
  /** Unique ID for this dropdown instance */
  @state()
  private _dropdownId = generateDropdownId();

  /** Current open state */
  @state()
  accessor isOpen = false;

  /**
   * Controlled open state
   */
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  private _trigger: DropdownTrigger | null = null;
  private _content: HTMLElement | null = null;

  /**
   * The element that actually acts as the trigger - either <dropdown-trigger>
   * or an escape-hatch element marked `data-dropdown-trigger`. Exposed so
   * dropdown-content can anchor to it without a global document query.
   */
  private _triggerElement: HTMLElement | null = null;
  private _disposeTriggerBehavior?: BehaviorCleanup;

  get dropdownId() {
    return this._dropdownId;
  }

  get trigger() {
    return this._trigger;
  }

  get content() {
    return this._content;
  }

  get triggerElement(): HTMLElement | null {
    return this._triggerElement;
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupChildren();
    this._setupBehaviorAttributes();
  }

  /**
   * Escape hatch: bring your own element instead of `<dropdown-trigger>`.
   *
   *   <button data-dropdown-trigger>Open menu</button>
   */
  private _setupBehaviorAttributes() {
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = attachBehavior(
      this,
      "[data-dropdown-trigger]",
      (element) => {
        const content = () => this._content as HTMLElement | null;

        // Same light-dismiss race as <dropdown-trigger>: a pointer gesture on
        // the trigger closes the popover before the click handler sees it.
        // `data-open-source` tells the content whether to focus its first item
        // (keyboard) or just itself (mouse). See dropdown-trigger._open.
        const open = (source: "pointer" | "keyboard") => {
          const contentElement = content();
          if (!contentElement) return;
          contentElement.setAttribute("data-open-source", source);
          contentElement.showPopover();
        };

        const disposeToggle = attachPopoverToggle(element, {
          isOpen: () => content()?.matches(":popover-open") ?? false,
          open,
          close: () => content()?.hidePopover(),
        });

        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            if (content()?.matches(":popover-open")) content()?.hidePopover();
            else open("keyboard");
          }
        };

        element.addEventListener("keydown", onKeyDown);
        element.setAttribute("aria-haspopup", "menu");
        element.setAttribute("aria-expanded", String(this.isOpen));
        element.setAttribute("data-state", this.isOpen ? "open" : "closed");
        element.setAttribute("data-dropdown-id", this._dropdownId);
        if (!element.hasAttribute("tabindex") && !(element instanceof HTMLButtonElement)) {
          element.setAttribute("tabindex", "0");
        }

        this._triggerElement = element;

        return () => {
          disposeToggle();
          element.removeEventListener("keydown", onKeyDown);
          if (this._triggerElement === element) this._triggerElement = null;
        };
      }
    );
  }

  private _setupChildren() {
    // Find and configure trigger
    this._trigger = this.querySelector("dropdown-trigger") as DropdownTrigger;
    if (this._trigger) {
      this._trigger.setAttribute("data-dropdown-id", this._dropdownId);
      this._triggerElement = this._trigger;
    }

    // Find and configure content
    this._content = this.querySelector("dropdown-content");
    if (this._content) {
      this._content.setAttribute("data-dropdown-id", this._dropdownId);
      this._content.setAttribute("id", `${this._dropdownId}-content`);

      // Listen for toggle events from popover
      this._content.addEventListener("toggle", this._handleContentToggle as EventListener);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._disposeTriggerBehavior?.();
    this._disposeTriggerBehavior = undefined;
    if (this._content) {
      this._content.removeEventListener("toggle", this._handleContentToggle as EventListener);
    }
  }

  private _handleContentToggle = (event: ToggleEvent) => {
    const wasOpen = this.isOpen;
    this.isOpen = event.newState === "open";

    // Update trigger state (custom element or escape-hatch element)
    if (this._trigger) {
      this._trigger.updateState(this.isOpen);
    } else if (this._triggerElement) {
      this._triggerElement.setAttribute("aria-expanded", String(this.isOpen));
      this._triggerElement.setAttribute(
        "data-state",
        this.isOpen ? "open" : "closed"
      );
    }

    if (this.isOpen && !wasOpen) {
      this._dispatchOpen();
    } else if (!this.isOpen && wasOpen) {
      this._dispatchClose();
      // Return focus to the actual trigger element
      (this._trigger?.getTriggerElement() ?? this._triggerElement)?.focus();
    }
  };

  private _dispatchOpen() {
    this.dispatchEvent(
      new CustomEvent(DROPDOWN_EVENTS.OPEN, {
        bubbles: true,
        composed: true,
        detail: { dropdownId: this._dropdownId },
      })
    );
  }

  private _dispatchClose() {
    this.dispatchEvent(
      new CustomEvent(DROPDOWN_EVENTS.CLOSE, {
        bubbles: true,
        composed: true,
        detail: { dropdownId: this._dropdownId },
      })
    );
  }

  /** Programmatically close the dropdown */
  close() {
    if (this._content && "hidePopover" in this._content) {
      (this._content as HTMLElement).hidePopover();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-root": DropdownRoot;
  }
}
