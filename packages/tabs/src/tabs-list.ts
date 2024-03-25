import {html, LitElement} from "lit";
import {ContextConsumer} from "@lit/context";
import {tabsContext} from "./tabs-context";
import { customElement } from "lit/decorators.js";

const Keys = Object.freeze({
    arrowUp: "ArrowUp",
    arrowDown: "ArrowDown",
    arrowLeft: "ArrowLeft",
    arrowRight: "ArrowRight",
    home: "Home",
    end: "End",
    enter: "Enter",
    space: " "
});

const Orientation = Object.freeze({
    horizontal: "horizontal",
    vertical: "vertical"
});

@customElement("tabs-list")
export class TabsList extends LitElement {

    _consumer = new ContextConsumer(
        this,
        {
            context: tabsContext,
            subscribe: true,
            callback: (e) => window.requestAnimationFrame(() => this.setAttribute("aria-orientation", e.orientation))
        }
    );

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute("role", "tablist");

        this.addEventListener("keydown", this.handleKeyNavigations);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("keydown", this.handleKeyNavigations);
    }

    protected render() {
        return html`
            <slot></slot>
        `;
    }

    handleKeyNavigations(event: KeyboardEvent) {
        const orientation = this._consumer.value?.orientation
        const dir = getComputedStyle(this).direction; // this is also in context value

        const prev = orientation === Orientation.vertical
            ? Keys.arrowUp
            : dir === "rtl" ? Keys.arrowRight : Keys.arrowLeft;
        const next = orientation === Orientation.vertical
            ? Keys.arrowDown
            : dir === "rtl" ? Keys.arrowLeft : Keys.arrowRight;

        // element selection
        const tabTriggers = Array.from(this.children) as HTMLElement[];
        const {curTriggerIdx} = this.getCurrentTabTriggerValue(tabTriggers)

        let element: HTMLElement;
        switch (event.key) {
            case prev:
                event.preventDefault();
                element = this.previous(curTriggerIdx, tabTriggers);
                break;
            case next:
                event.preventDefault();
                element = this.next(curTriggerIdx, tabTriggers);
                break;
            case Keys.home:
                element = tabTriggers[0];
                break;
            case Keys.end:
                element = tabTriggers[tabTriggers.length - 1];
                break;
            default:
                element = tabTriggers[curTriggerIdx]
        }

        const value = element.getAttribute("value") ?? undefined
        const options: CustomEventInit<string> = {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: value,
        };
        this.dispatchEvent(new CustomEvent("keynavigation", options));
    }

    getCurrentTabTriggerValue(triggerElements: HTMLElement[]) {
        const currTriggerVal = this._consumer.value?.value!;
        const curTriggerIdx = triggerElements.findIndex((trigger) => {
            return trigger.getAttribute("value") === currTriggerVal;
        })
        return {curTriggerIdx, currTriggerVal}
    }

    next(selectedTabIndex: number, elements: HTMLElement[]) {
        const items = elements;
        const index = this.#clamp(selectedTabIndex + 1, items.length);
        return items[index];
    }

    previous(selectedTabIndex: number, elements: HTMLElement[]) {
        const items = elements;
        const index = this.#clamp(selectedTabIndex - 1, items.length);
        return items[index];
    }

    #clamp(index: number, elementsLength: number) {
        let returnedIndex = index;
        if (index < 0) {
            returnedIndex = 0;
        } else if (index >= elementsLength) {
            returnedIndex = elementsLength - 1;
        }
        return returnedIndex;
    }
}