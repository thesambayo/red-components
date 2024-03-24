import {ContextConsumer} from "@lit/context";
import {LitElement, html, nothing} from 'lit'
import { customElement } from 'lit/decorators.js'
import {avatarContext} from "./avatar-context";

@customElement('avatar-fallback')
export class AvatarFallback extends LitElement {

    _consumer = new ContextConsumer(
        this,
        {
            context: avatarContext,
            subscribe: true,
        }
    );
    render() {
        const imageStatus = this._consumer.value?.imageLoadingStatus;
        return html`${imageStatus && imageStatus === 'loaded' ? nothing : html`<slot></slot>`}`
    }
}

