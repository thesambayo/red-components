type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ToastTypes = "success" | "info" | "warning" | "error" | "loading";

export interface Toast {
  id: string;
  duration: number;
  /**
   * Toast text. Rendered as TEXT - markup in here is escaped, not parsed.
   * This is the safe default: toast content is frequently built from user or
   * server data, and `red-toast` events can be dispatched by any script on the
   * page.
   */
  content: string;
  /**
   * Raw HTML, rendered WITHOUT escaping.
   *
   * Only pass markup you construct yourself. Never pass user input, API
   * responses, or anything derived from them - it is an XSS vector.
   */
  unsafeHtml?: string;
  type?: ToastTypes;
  // callbacks
  onDismiss?: (toast: Toast) => void;
  onAutoClose?: (toast: Toast) => void;
}

export type ToastOptions = Optional<Toast, "id" | "duration">;

type Subscriber = (toasts: Toast[]) => void;

type DismissOptions = {
  /** manually closing toast */
  manuallyDismiised?: boolean;
};

export const DEFAULT_DURATION = 5000; // 5s
class ToastStore {
  // private static DEFAULT_DURATION = 5000; // 5 seconds

  private subscribers = new Set<Subscriber>();
  private toasts: Toast[] = [];
  private timeouts = new Map<string, number>();

  subscribe = (callback: Subscriber) => {
    this.subscribers.add(callback);
    // Initial call with current state
    callback(this.toasts);
    // Return unsubscribe function
    return () => this.subscribers.delete(callback);
  };

  private notify = () => {
    this.subscribers.forEach((callback) => callback(this.toasts));
  };

  /**
   * @returns new toast id
   */
  addToast = (newToast: ToastOptions): string => {
    if (!newToast.content && !newToast.unsafeHtml) {
      throw new Error("Toast requires `content` (or `unsafeHtml`)");
    }

    const toast = {
      ...newToast,
      id: newToast.id ?? crypto.randomUUID(),
      duration: newToast.duration ?? DEFAULT_DURATION,
    };

    this.toasts = [...this.toasts, toast];
    this.notify();

    // Handle auto-dismiss, If duration is Infinity, toast stays until manually dismissed
    if (toast.duration !== Infinity) {
      const timeout = window.setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);

      this.timeouts.set(toast.id, timeout);
    }

    return toast.id;
  };

  removeToast = (id: string, dismissOptions?: DismissOptions) => {
    // Clear the timeout if it exists
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout); // Clean up the timer
      this.timeouts.delete(id); // Remove from Map
    }

    this.toasts = this.toasts.filter((toast) => {
      if (toast.id === id) {
        dismissOptions?.manuallyDismiised
          ? toast.onDismiss?.(toast)
          : toast.onAutoClose?.(toast);
      }
      return toast.id !== id;
    });
    this.notify();
  };

  dismissAll = () => {
    // Clear all timeouts
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
    // dismiss all toasts
    this.toasts = [];
    this.notify();
  };

  handleEvent = (event: Event) => {
    console.log(event);
    console.log(event instanceof CustomEvent);
    this.addToast((event as CustomEvent).detail);
  };
}

// singleton
export const toastStore = new ToastStore();
