import {provide} from "@lit/context";
import { html, LitElement } from "lit";
// import {nextId} from "../../utils/useId";
import {customElement, property} from "lit/decorators.js";
import {TabContext, tabsContext, tabsTags} from "./tabs-context";

@customElement("tabs-root")
export class TabsRoot extends LitElement {

  @provide({ context: tabsContext })
  @property({ type: Object })
  _provider: TabContext = {
    value: undefined,
    shouldFocus: false,
    direction: "ltr",
    orientation: "horizontal",
  };


  // attributes
  @property({attribute: "default-value"})
  defaultValue?: string;

  @property({attribute: "dir"})
  direction?: TabContext['direction'];

  @property({attribute: "orientation"})
  orientation?: TabContext['orientation'];

  connectedCallback() {
    super.connectedCallback();

    const defaultSelected = this.configureChildrenAttributes();
    this._provider = {
      ...this._provider,
      direction: this.direction ?? "ltr",
      orientation: this.orientation ?? "horizontal",
      value: this.defaultValue?.trim().length ? this.defaultValue : defaultSelected!
    }
    this.addEventListener("pointerdown", this.handlePointerDownEvent);
    this.addEventListener("keynavigation", this.handleKeyNavigationEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("pointerdown", this.handlePointerDownEvent);
    this.removeEventListener("keynavigation", this.handleKeyNavigationEvent);
  }

  render() {
    return html`
      <slot></slot>
      <p>${this.defaultValue}</p>
    `;
  }

  private configureChildrenAttributes() {
    // this._provider.addCallback((value) => console.log("calling back", value), this, true)

    const prefix = "3";
    const tabsTriggers = this.querySelectorAll(tabsTags.TRIGGER);
    const tabsContents = this.querySelectorAll(tabsTags.CONTENT);
    let defaultSelected = tabsTriggers[0].getAttribute("value");

    if (tabsTriggers.length !== tabsContents.length) {
      console.warn("Tab/TabPanel count mismatch");
    }

    for (let index = 0; index < tabsTriggers.length; index++) {
      const tabTrigger = tabsTriggers[index];
      const tabContent = tabsContents[index];

      const tabTriggerId = tabTrigger.id || `${prefix}-tab-${index}`;
      const tabContentId = tabContent.id || `${prefix}-tabpanel-${index}`;

      tabTrigger.setAttribute("id", tabTriggerId);
      tabTrigger.setAttribute("aria-controls", tabContentId);
      tabContent.setAttribute("id", tabContentId);
      tabContent.setAttribute("aria-labelledBy", tabTriggerId);
    }

    return defaultSelected;
  }

  private handlePointerDownEvent(event: PointerEvent) {
    const eventTarget = event.target as HTMLElement;
    if (eventTarget?.localName !== 'tab-trigger') return;

    eventTarget.focus();
    const tabValue = eventTarget.getAttribute("value");
    if (!tabValue) {
      console.warn("tab trigger has no value");
      return;
    }

  this.handleTriggerUpdateFromEvents(tabValue);
  }

  private handleKeyNavigationEvent(event: Event) {
    const customEvent = event as CustomEvent<string>
    this.handleTriggerUpdateFromEvents(customEvent.detail);
  }


  private handleTriggerUpdateFromEvents(tabValue: string) {
    if (tabValue === this._provider.value) return;
    this._provider = {
      ...this._provider,
      value: tabValue,
      shouldFocus: true,
    }
    const options: CustomEventInit<string> = {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: tabValue,
    };
    this.dispatchEvent(new CustomEvent('change', options));
  }

}