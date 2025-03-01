import { toaster, ToastEvent } from "./toast-api";

declare global {
  interface WindowEventMap {
    "red-toast": ToastEvent;
  }
  interface Window {
    ToastEvent: typeof ToastEvent;
    toaster: typeof toaster;
  }
}
