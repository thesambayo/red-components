import React from "react";
import { createComponent, EventName } from "@lit/react";
import * as switchEl from "./switch";

export const SwitchRoot = createComponent({
  tagName: "switch-root",
  elementClass: switchEl.SwitchRoot,
  react: React,
  events: {
    onCheckedChange: "checkedChange" as EventName<
      CustomEvent<{ checked: boolean }>
    >,
  },
});

export const SwitchThumb = createComponent({
  tagName: "switch-thumb",
  elementClass: switchEl.SwitchThumb,
  react: React,
});
