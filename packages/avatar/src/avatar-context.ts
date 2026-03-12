import {createContext} from "@lit/context";

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarContext {
    imageLoadingStatus: ImageLoadingStatus;
    /**
     * Delay in milliseconds before showing fallback
     * @defaultValue 0
     */
    delayMs: number;
    onImageLoadingStatusChange(status: ImageLoadingStatus): void;
}

export const avatarContext = createContext<AvatarContext>("avatar");