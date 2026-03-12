/**
 * State for styling hooks
 */
export type DialogState = "open" | "closed";

/**
 * Root context shared with all dialog components
 */
export interface DialogRootContextValue {
  /** Current open state */
  open: boolean;
  /** Whether dialog is modal (uses showModal() vs show()) */
  modal: boolean;
  /** Reference to native dialog element */
  dialogElement: HTMLDialogElement | null;
  /** Generated ID for title element (for aria-labelledby) */
  titleId: string;
  /** Generated ID for description element (for aria-describedby) */
  descriptionId: string;
  /** Reference to trigger element (for returning focus) */
  triggerElement: HTMLElement | null;
  /** Open or close the dialog */
  onOpenChange: (open: boolean) => void;
  /** Called when trigger element mounts */
  onTriggerMount: (el: HTMLElement) => void;
}

/**
 * Props for DialogRoot
 */
export interface DialogRootProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Whether dialog is modal (default: true) */
  modal?: boolean;
}

/**
 * Props for DialogTrigger
 */
export interface DialogTriggerProps {
  /** Pass behavior to slotted child instead of rendering wrapper */
  asChild?: boolean;
}

/**
 * Props for DialogClose
 */
export interface DialogCloseProps {
  /** Pass behavior to slotted child instead of rendering wrapper */
  asChild?: boolean;
}
