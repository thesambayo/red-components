import { createContext } from "@lit/context";

export const DEFAULT_DURATION = 5000; // 5s

export const toastTags = {
  PROVIDER: "toast-provider" as HTMLElement["localName"],
  ROOT: "toast-root" as HTMLElement["localName"],
  VIEWPORT: "toast-viewport" as HTMLElement["localName"],
  // CLOSE: "toast-close" as HTMLElement["localName"],
};

export interface Toast {
  id: string;
  content: string;
  duration?: number;
  open: boolean;
}

export interface ToastContext {
  toasts: Toast[];
  duration: number;
  addToast(toast: Omit<Toast, "id">): void;
  removeToast(id: string): void;
  updateToast(id: string, updates: Partial<Toast>): void;
}

export const toastContext = createContext<ToastContext, string>("TOAST");
