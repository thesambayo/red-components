import {createContext} from "@lit/context";

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarContext {
    imageLoadingStatus: ImageLoadingStatus;
    onImageLoadingStatusChange(status: ImageLoadingStatus): void;
}

export const avatarContext = createContext<AvatarContext>("avatar");