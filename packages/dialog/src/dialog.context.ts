export const dialogTags = {
  ROOT: "dialog-root" as HTMLElement["localName"],
  TRIGGER: "dialog-trigger" as HTMLElement["localName"],
  PORTAL: "dialog-portal" as HTMLElement["localName"],
  CONTENT: "dialog-content" as HTMLElement["localName"],
  CLOSE: "dialog-close" as HTMLElement["localName"],
};

export const DIALOG_EVENTS_NAME = {
  /**
   * Event fired when the dialog is opened.
   */
  OPEN: "dialog-open",
  /**
   * Event fired when the dialog is closed.
   */
  CLOSE: "dialog-close",
  /**
   * Event fired when the dialog state changes.
   */
  STATE_CHANGE: "dialog-state-change",
};

export interface DialogEventDetail {
  dialogDataId?: string | null;
  open?: boolean;
}

export const createDialogEvent = (
  eventName: keyof typeof DIALOG_EVENTS_NAME,
  options: CustomEventInit<DialogEventDetail> = {}
  // can be this options: CustomEventInit = {},
  // then open, close will have each own interface
) => {
  return new CustomEvent(DIALOG_EVENTS_NAME[eventName], {
    bubbles: true,
    cancelable: true,
    composed: true,
    ...options,
  });
};

export type CustomDialogEvent = ReturnType<typeof createDialogEvent>;

export type DialogEventRecord = Record<
  keyof typeof DIALOG_EVENTS_NAME,
  (details: DialogEventDetail) => CustomDialogEvent
>;

export const DIALOG_EVENTS_RECORD: DialogEventRecord = {
  OPEN: (details: DialogEventDetail) =>
    createDialogEvent("OPEN", { detail: details }),
  CLOSE: (details: DialogEventDetail) =>
    createDialogEvent("CLOSE", { detail: details }),
  STATE_CHANGE: (details: DialogEventDetail) =>
    createDialogEvent("STATE_CHANGE", { detail: details }),
};

export const DIALOG_ATTRIBUTES = {
  // The HTML attribute name used to store dialog IDs
  // Usage: element.setAttribute(DIALOG_ATTRIBUTES.DATA_ID, "my-dialog")
  DATA_ID_KEY: "data-dialog-id" as const,
  PORTALLED_ID_KEY: "data-dialog-portalled-id" as const,
  DATA_DIALOG_CLOSE: "data-dialog-close" as const,
};
