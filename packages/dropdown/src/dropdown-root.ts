import { LitElement, PropertyValues, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  CustomDropdownEvent,
  DROPDOWN_ATTRIBUTES,
  DROPDOWN_EVENTS_NAME,
  DROPDOWN_EVENTS_RECORD,
  dropdownTags,
} from "./dropdown.context";
import { nextId } from "./randomId";

@customElement("dropdown-root")
export class DropdownRoot extends LitElement {
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

  /**
    This monitors is dropdown is opened or not.
    Unlike open (which tracks open attribute from the user/outside environment)
  */
  @state()
  accessor currentDropdownOpenState = false;

  /**
    This monitors if the user is controlling the dropdown open state.
    If true, then the dropdown can only the opened and closed from open attribute changes
  */
  @state()
  accessor isOpenStateControlled = false;

  connectedCallback() {
    super.connectedCallback();
    this.isOpenStateControlled = this.hasAttribute("open");

    const dropdownID = nextId();
    this.setAttribute("role", "dropdown");
    this.setAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY, dropdownID);
    // expected children => dropdownTags.TRIGGER & dropdownTags.PORTAL
    Array.from(this.children).map((child) => {
      child.setAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY, dropdownID);
    });

    document.addEventListener(DROPDOWN_EVENTS_NAME.OPEN, this.handleOpenAction);
    document.addEventListener(
      DROPDOWN_EVENTS_NAME.CLOSE,
      this.handleCloseAction
    );
  }

  protected willUpdate(_changedProperties: PropertyValues<this>): void {
    // console.log(_changedProperties);
    // console.log(this.open);
    if (
      _changedProperties.has("currentDropdownOpenState") &&
      _changedProperties.get("open") !== this.open
    ) {
      this.emitOpenChangeEvent();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  emitOpenChangeEvent() {
    this.dispatchEvent(
      DROPDOWN_EVENTS_RECORD.STATE_CHANGE({
        dropdownDataId: this.getAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY),
        open: this.currentDropdownOpenState,
      })
    );
  }

  private checkSameDropdownId(event: CustomDropdownEvent): boolean {
    return (
      this.getAttribute(DROPDOWN_ATTRIBUTES.DATA_ID_KEY) ===
      event.detail.dropdownDataId
    );
  }

  handleOpenAction = (event: Event) => {
    const dialogEvent = event as CustomDropdownEvent;
    if (!this.checkSameDropdownId(dialogEvent)) {
      return;
    }
    this.currentDropdownOpenState = true;
    document.body.style.pointerEvents = "none";
  };

  handleCloseAction = (event: Event) => {
    const dialogEvent = event as CustomDropdownEvent;
    if (!this.checkSameDropdownId(dialogEvent)) {
      return;
    }
    this.currentDropdownOpenState = false;
    (this.querySelector(dropdownTags.TRIGGER) as HTMLElement).focus();
    document.body.removeAttribute("style");
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-root": DropdownRoot;
  }
}
