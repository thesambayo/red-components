import { provide } from "@lit/context";
import { LitElement, html, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  AccordionContext,
  accordionContext,
  accordionTags,
} from "./accordion-context";

const ACCORDION_ACTIVATION_KEYS = [" ", "Enter"];

@customElement("accordion-root")
export class AccordionRoot extends LitElement {
  @provide({ context: accordionContext })
  @property({ type: Object })
  private _provider: AccordionContext = {
    value: [],
    type: "single",
    direction: "ltr", // does not do anything atm
    orientation: "horizontal", // does not do anything atm
  };

  @property({ attribute: "type" })
  type: "single" | "multiple" = "single";

  // updates to be done on react for this
  @property({
    attribute: "default-value",
    converter: {
      fromAttribute: (value) => {
        if (!value) return [];
        const parsedValue = value?.replace(/'/g, '"');
        return JSON.parse(parsedValue) as string[];
      },
      // toAttribute(value: string[]): any {
      //   return JSON.stringify(value)
      // }
    },
  })
  defaultValue: string[] = [];

  @property({ attribute: "dir" })
  direction: AccordionContext["direction"] = "ltr";

  @property({ attribute: "orientation" })
  orientation: AccordionContext["orientation"] = "horizontal";

  connectedCallback() {
    super.connectedCallback();

    requestAnimationFrame(() => {
      this.configureAccordionChildren();

      this._provider = {
        ...this._provider,
        type: this.type,
        direction: this.direction,
        orientation: this.orientation,
        value: this.defaultValue,
      };
    });

    this.addEventListener("keydown", this.handleKeydownEvent);
    this.addEventListener("click", this.handleClickEvent);
  }

  protected shouldUpdate(_changedProperties: PropertyValues<this>): boolean {
    if (_changedProperties.has("type")) {
      this._provider.type = this.type ?? "single";
    }

    return true;
  }

  protected render() {
    return html` <slot></slot> `;
  }

  private configureAccordionChildren() {
    const prefix = "4";
    const accItems = this.querySelectorAll<HTMLElement>(accordionTags.ITEM);

    for (let index = 0; index < accItems.length; index++) {
      const accordionItem = accItems[index];
      const accordionTrigger = accordionItem.querySelector(
        accordionTags.TRIGGER,
      );
      const accordionContent = accordionItem.querySelector(
        accordionTags.CONTENT,
      );

      if (!accordionTrigger || !accordionContent) {
        console.warn("Accordion Triggers/Contents mismatch");
        continue;
      }

      accordionItem.setAttribute(
        "id",
        accordionItem.id || `${prefix}-item-${index}`,
      );
      const triggerId = accordionTrigger.id || `${prefix}-trigger-${index}`;
      const contentId = accordionContent.id || `${prefix}-content-${index}`;

      accordionTrigger.setAttribute("id", triggerId);
      accordionTrigger.setAttribute("aria-controls", contentId);
      accordionContent.setAttribute("role", "button");
      accordionContent.setAttribute("id", contentId);
      accordionContent.setAttribute("aria-labelledBy", triggerId);
      accordionContent.setAttribute("role", "region");
    }
  }

  handleKeydownEvent(event: KeyboardEvent) {
    if (!ACCORDION_ACTIVATION_KEYS.includes(event.key)) return;
    const eventTarget = event.target as HTMLElement | null;
    if (eventTarget?.localName !== "accordion-trigger") return;
    event.preventDefault();
    this.activateAccordionItem(eventTarget);
  }

  handleClickEvent(event: MouseEvent) {
    console.log(event);
    const eventTarget = event.target as HTMLElement;
    if (eventTarget?.localName !== "accordion-trigger") return;
    event.preventDefault();
    // eventTarget.focus();
    this.activateAccordionItem(eventTarget);
  }

  activateAccordionItem(eventTarget: HTMLElement) {
    if (eventTarget.localName !== "accordion-trigger") return;

    const accItemValue = eventTarget.parentElement?.getAttribute("value");

    if (!accItemValue) {
      console.warn("primitives item has no value");
      return;
    }

    const updatedValues = this._provider.value.includes(accItemValue)
      ? this._provider.value.filter((item) => item !== accItemValue)
      : [
          ...(this._provider.type === "multiple" ? this._provider.value : []),
          accItemValue,
        ];

    this._provider = {
      ...this._provider,
      value: updatedValues,
    };

    const options: CustomEventInit<string[]> = {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: updatedValues,
    };
    this.dispatchEvent(new CustomEvent("change", options));
  }
}
