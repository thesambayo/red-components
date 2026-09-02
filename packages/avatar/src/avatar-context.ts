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

/**
 * Event names. Namespaced as `{component}:{kebab-event}` so a bubbling
 * event cannot be mistaken for a native one by an ancestor listener.
 */
export const AVATAR_EVENTS = {
  LOADING_STATUS_CHANGE: "avatar:loading-status-change",
} as const;
