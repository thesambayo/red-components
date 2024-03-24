import {css, html, LitElement} from "lit";
import {ContextConsumer} from "@lit/context";
import {customElement, property} from "lit/decorators.js";
import {TabContext, tabsContext} from "./tabs-context";

@customElement('tab-content')
export class TabContent extends LitElement {
    static styles = css`
        :host {
            contain: content;
        }

        :host([hidden]) {
            display: none;
        }
    `;

    @property({ type: String, reflect: true })
    value?: string;

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
        this.setAttribute("role", "tabpanel");
    }

    render() {
        return html`
            <slot></slot>
        `;
    }

    contextValueUpdate(contextValue: TabContext) {
        const { value } = contextValue
        if (this.value && this.value === value) {
            this.setAttribute("data-state", "active");
            this.removeAttribute("hidden");
        } else {
            this.setAttribute("data-state", "inactive");
            this.toggleAttribute("hidden", true);
        }
    }
}
