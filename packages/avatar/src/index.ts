import React from 'react';
import * as avatar from "./avatar";
import {createComponent} from '@lit/react';

export const AvatarRoot = createComponent({
    tagName: 'avatar-root',
    elementClass: avatar.AvatarRoot,
    react: React,
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
