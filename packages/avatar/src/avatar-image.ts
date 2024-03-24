import {ContextConsumer} from "@lit/context";
import {LitElement, html, nothing} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import {avatarContext, ImageLoadingStatus} from "./avatar-context";

@customElement('avatar-image')
export class AvatarImage extends LitElement {

    _consumer = new ContextConsumer(
        this,
        {
            context: avatarContext,
            subscribe: true,
        }
    );

    @property({type: String, reflect: true})
    src?: string;

    @property({attribute: "alt"})
    alt?: string;

    connectedCallback() {
        super.connectedCallback();
        if (!this.src) {
            console.warn("src not provided");
            return;
        }

        const image = new window.Image();
        image.onload = this.#updateStatus('loaded');
        image.onerror = this.#updateStatus('error');
        image.src = this.src;
    }

    render() {
        const imageStatus = this._consumer.value?.imageLoadingStatus;
        const renderedImg = html`<img src="${this.src}" alt="${this.alt}" />`
        return html`${imageStatus && imageStatus === 'loaded' ? renderedImg : nothing}`
    }

    #updateStatus = (status: ImageLoadingStatus) => () => {
        this._consumer.value?.onImageLoadingStatusChange(status)
    }
}

