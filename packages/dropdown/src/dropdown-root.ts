import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, property, state } from "lit/decorators.js";
import {
  DropdownContext,
  dropdownContext,
  dropdownTags,
} from "./dropdown.context";
import { nextId } from "./randomId";

@customElement("dropdown-root")
export class DropdownRoot extends LitElement {
  @provide({ context: dropdownContext })
  @state()
  private _provider: DropdownContext = {
    isOpen: false,
    trigger: null,
    controlledState: false,
    onOpen: (eventName: string) => this.handleOpenAction(eventName),
    onClose: (eventName: string) => this.handleCloseAction(eventName),
  };

  /**
   * The controlled display of tooltip content
   * @default false
   */
  @property({
    attribute: "open",
    type: Boolean,
    converter: {
      fromAttribute: (attrValue: string | null) => {
        if (attrValue === null) return false;
        if (attrValue === "") return true;
        return attrValue === "true";
      },
      toAttribute: (value: boolean | null) => {
        return value ? "true" : "false";
      },
    },
  })
  accessor open = false;

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("role", "dropdown");
    const dropdownPrefix = nextId();
    const trigger = this.querySelector<HTMLElement>(dropdownTags.TRIGGER);
    const content = this.querySelector<HTMLElement>(dropdownTags.CONTENT);
    const triggerId = trigger?.id || `${dropdownPrefix}-dropdown-trigger`;
    const contentId = content?.id || `${dropdownPrefix}-dropdown-content`;
    trigger?.setAttribute("id", triggerId);
    trigger?.setAttribute("aria-controls", contentId);
    content?.setAttribute("id", contentId);
    content?.setAttribute("aria-labelledby", triggerId);

    this._provider = {
      ...this._provider,
      trigger: trigger,
      isOpen: this.open,
      controlledState: this.hasAttribute("open"),
    };
  }

  protected willUpdate(_changedProperties: Map<string, any>): void {
    for (const [key] of _changedProperties.entries()) {
      if (key === "_provider") {
        this.open = this._provider.isOpen;
      } else {
        this._provider = {
          ...this._provider,
          [key]: this[key as keyof this],
        };
      }
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  emitOpenEvent(isOpen: boolean) {
    this.dispatchEvent(
      new CustomEvent("openChange", {
        detail: { open: isOpen },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleOpenAction(_eventName: string) {
    this._provider = {
      ...this._provider,
      isOpen: true,
    };
    document.body.style.pointerEvents = "none";
    this.emitOpenEvent(true);
  }

  handleCloseAction = (_eventName: string) => {
    this._provider = {
      ...this._provider,
      isOpen: false,
    };
    this._provider.trigger?.focus();
    document.body.removeAttribute("style");
    this.emitOpenEvent(false);
  };
}
