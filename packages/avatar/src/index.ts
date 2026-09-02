import React from 'react';
import {createComponent, EventName} from '@lit/react';
import * as avatar from "./avatar";
import type { ImageLoadingStatus } from "./avatar-context";

export const AvatarRoot = createComponent({
    tagName: 'avatar-root',
    elementClass: avatar.AvatarRoot,
    react: React,
    events: {
        onLoadingStatusChange:
            "avatar:loading-status-change" as EventName<CustomEvent<ImageLoadingStatus>>,
    },
});

export const AvatarImage = createComponent({
    tagName: 'avatar-image',
    elementClass: avatar.AvatarImage,
    react: React,
});

export const AvatarFallback = createComponent({
    tagName: 'avatar-fallback',
    elementClass: avatar.AvatarFallback,
    react: React,
});
