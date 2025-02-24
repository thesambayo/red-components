import { createComponent } from "@lit/react";
import React from "react";
import * as toast from "./toast";

export const ToastRoot = createComponent({
  tagName: "toast-root",
  elementClass: toast.ToastRoot,
  react: React,
});

export const ToastClose = createComponent({
  tagName: "tooltip-close",
  elementClass: toast.ToastClose,
  react: React,
});

export const toaster = toast.toaster;
