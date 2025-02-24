// todo: add this to javascript window
// --------------public api

import { ToastOptions, toastStore } from "./toast-store";

// do i want to use event based OR direct store methods
export const toaster = {
  add(toast: ToastOptions): string {
    return toastStore.addToast(toast);
  },
  remove(toastId: string) {
    toastStore.removeToast(toastId);
  },
  dismissAll() {
    toastStore.dismissAll();
  },
  // Event-based method for server-side/external use
  // create(options: ToastOptions) {
  //   window.dispatchEvent(new ToastEvent(options));
  // },
};

// todo: declare this in window
export class ToastEvent extends CustomEvent<ToastOptions> {
  static readonly eventName = "red-toast";
  constructor(options: ToastOptions) {
    super(ToastEvent.eventName, {
      detail: options,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
  }
}

// const sampleToastEvent = new ToastEvent({
//   id: crypto.randomUUID(),
//   duration: 500,
//   content: "Hello, world!",
// });

// window.dispatchEvent(
//   new ToastEvent({
//     id: crypto.randomUUID(),
//     duration: 500,
//     content: "Hello, world!",
//   })
// );

// window.dispatchEvent(new CustomEvent('red-toast', {detail: {
//   id: crypto.randomUUID(),
//   duration: 500,
//   content: "Hello, world!",
// }}));

// Then attach them to window
window.ToastEvent = ToastEvent;
window.toaster = toaster;

// If you want to ensure these are only added once, you can add a check:
if (!window.ToastEvent) {
  window.ToastEvent = ToastEvent;
}

if (!window.toaster) {
  window.toaster = toaster;
}
