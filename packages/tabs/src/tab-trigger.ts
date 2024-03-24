import {html, LitElement} from "lit";
import {ContextConsumer} from "@lit/context";
import {customElement, property} from "lit/decorators.js";
import {TabContext, tabsContext} from "./tabs-context";

@customElement('tab-trigger')
export class TabTrigger extends LitElement {

    @property({ type: String, reflect: true })
    value?: string;

    // todo: implement disabled tab, prevent it from being selectable and focusable
    // @property({type: Boolean, reflect: true})
    // disabled = false;

    _consumer = new ContextConsumer(
        this,
        {
            context: tabsContext,
            subscribe: true,
            callback: (e) => this.contextValueUpdate(e)
        }
    );

    connectedCallback() {
        super.connectedCallback();
        // this.attachInternals().role = "tab";
        this.setAttribute("role", "tab");
    }

    protected render() {
        return html`
            <slot></slot>
        `;
    }

    contextValueUpdate(contextValue: TabContext) {
        const { value, shouldFocus } = contextValue
        // console.log(value, shouldFocus)
        if (this.value && this.value === value) {
            this.setAttribute("data-state", "active");
            this.setAttribute("aria-selected", "true");
            this.setAttribute("tabindex", "0");
            if (shouldFocus) this.focus();
        } else {
            this.setAttribute("data-state", "inactive");
            this.setAttribute("aria-selected", "false");
            this.setAttribute("tabindex", "-1");
        }
    }


}