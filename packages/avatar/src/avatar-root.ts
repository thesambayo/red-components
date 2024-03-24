import { LitElement, html } from 'lit'
import {provide} from "@lit/context";
import {customElement, property} from 'lit/decorators.js'
import {AvatarContext, avatarContext, ImageLoadingStatus} from "./avatar-context";

@customElement('avatar-root')
export class AvatarRoot extends LitElement {

    @provide({ context: avatarContext })
    @property()
    _provider: AvatarContext = {
        imageLoadingStatus: "idle",
        onImageLoadingStatusChange: (status: ImageLoadingStatus) => {
            this.updateImageLoadingStatus(status)
        }
    };

    render() {
        return html`<slot></slot>`
    }

    updateImageLoadingStatus(status: any) {
        this._provider = {
            ...this._provider,
            imageLoadingStatus: status
        }
    }
}

